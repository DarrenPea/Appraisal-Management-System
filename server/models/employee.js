const db = require('./db.js');
const tableName = 'employees';

class Employee {
    constructor(
      employeeID,
      hodID,
      employeePassword,
      employeeName,
      employeeEmail,
      employeeDateJoined,
      nextAppraisalDate,
      appraisalScore,
      role,
      department,
      jobFunction,
      KPI,
      disciplinaryRecord,
      attendanceRecord
    ) {
      this.employeeID = employeeID;
      this.hodID = hodID;
      this.employeePassword = employeePassword;
      this.employeeName = employeeName;
      this.employeeEmail = employeeEmail;
      this.employeeDateJoined = employeeDateJoined;
      this.nextAppraisalDate = nextAppraisalDate;
      this.appraisalScore = appraisalScore;
      this.role = role;
      this.department = department;
      this.jobFunction = jobFunction;
      this.KPI = KPI;
      this.disciplinaryRecord = disciplinaryRecord;
      this.attendanceRecord = attendanceRecord;
    }
  }

  async function sync() {
    try {
      await db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          employeeID VARCHAR(50) PRIMARY KEY,
          hodID VARCHAR(50) PRIMARY KEY,
          employeePassword VARCHAR(255),
          employeeName VARCHAR(255),
          employeeEmail VARCHAR(255),
          employeeDateJoined DATE,
          nextAppraisalDate DATE,
          appraisalScore INT,
          role VARCHAR(100),
          department VARCHAR(100),
          jobFunction VARCHAR(255),
          KPI INT,
          disciplinaryRecord VARCHAR(255),
          attendanceRecord VARCHAR(255)
        )
      `);
      console.log(`Table ${tableName} created or already exists.`);
    } catch (error) {
      console.error("Database connection failed. " + error);
      throw error;
    }
  }

  async function findRecordsByID(employeeID) {
    try {
      const query = `
      SELECT jobFunction, KPI, disciplinaryRecord, 
      attendanceRecord FROM ${tableName} WHERE employeeID = ?`;
      
      const [rows] = await db.pool.query(query, [employeeID]);

      return rows;

    } catch (error) {
      console.error("Database connection failed. " + error);
      throw error;
    }
  }

  async function findByAppraisalDateDue() {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Query to get employees whose next appraisal month is the current month
      // const [employees] = await db.pool.query(`SELECT employeeID, hodID FROM employees where MONTH(nextAppraisalDate) = ?`, [currentMonth]);
      //const [employees] = await db.pool.query(`SELECT employeeID, hodID, employeeDateJoined FROM employees where MONTH(nextAppraisalDate) = ? AND YEAR(nextAppraisalDate) = ?`, [currentMonth, currentYear]);
      const [employees] = await db.pool.query(`SELECT employeeID, employeeName, hodID FROM employees where MONTH(nextAppraisalDate) = ?`, [currentMonth]);
      return employees;
      } catch (error) {
        console.error('Error finding employees by appraisal date:', error);
        throw error;
      }
    }

  async function updateNextAppraisalDate(employeeID){
  let date_join;
  let date_join_month;
  let date_join_day;
  try{
    const query = `
      SELECT employeeDateJoined
      FROM ${tableName}
      WHERE employeeID = ?
    `;

    const [rows] = await db.pool.query(query, [employeeID]);
    try{
      if (rows.length === 0){
        throw new Error('updateNextAppraisalDate: employeeID not found, cant get employeeDateJoined');
      }
    }
    catch(error){
      throw new Error('date_join is empty');
    }
    date_join = new Date(rows[0].employeeDateJoined);
    date_join_month =  String(date_join.getUTCMonth() + 1).padStart(2, '0'); //extract month
    date_join_day = String(date_join.getUTCDate()).padStart(2, '0');  // Extracts the day
  }
  catch (error) {
    throw new Error('Could not get date_joined');
  }

  try{
    const query = `
      UPDATE ${tableName} 
      SET nextAppraisalDate = CONCAT(YEAR(DATE_ADD(NOW(), INTERVAL 1 YEAR)), '-', ${date_join_month}, '-', ${date_join_day})
      WHERE employeeID = ?
    `;
    const [result] = await db.pool.query(query, [employeeID]);
    return [true];
  } 
  catch (error) {
    throw new Error('Next meeting not updated');
  }
}

async function login(staffID, password) {

  if (typeof staffID !== 'string' || typeof password !== 'string') {
    return [3];
  }

  try {
    const [rows] = await db.pool.query(
      `SELECT employeeName, role, employeePassword 
      FROM ${tableName} 
      WHERE employeeID = ?`,
      [staffID]
    );

    // code 1 means employeeID not found
    if (rows.length === 0) {
      return [1];
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = password === rows[0].employeePassword;
    //TODO: add encryption to password
  //   const isPasswordValid = await bcrypt.compare(password, user.HRPassword);

    //code 2 means password is invalid
    if (!isPasswordValid) {
      return [2];
    }

    // code 0 means authentication successful
    delete rows[0].employeePassword;
    

    // Authentication successful
    //TODO: may need to change
    return rows;

  } catch (error) {
    console.error('Failed to authenticate: ' + error.message);
    throw error;
  }
}

async function hrStatus(employeeID){
  try{
    // get table entries based on hodID and current year.
    const query = `
      SELECT employeeName, department
      FROM ${tableName}
      WHERE employeeID = ?
      `;
    //rows is an array of data. 
    console.log("TEST", employeeID);
    const [rows] = await db.pool.query(query, [employeeID]);

    if (rows.length === 0) {
      throw new Error('Employee not found');
    }
    
    return rows;
  } 
  catch (error) {
    throw new Error('Form not retrieved, problem with getting employeeName and department');
  }
}

module.exports = {Employee, sync, findRecordsByID, findByAppraisalDateDue, updateNextAppraisalDate, login, hrStatus};
