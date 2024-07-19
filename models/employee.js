const db = require('./db.js');
const tableName = 'employees';

class Employee {
    constructor(
      staffID,
      hodID,
      employeePassword,
      employeeName,
      employeeEmail,
      employeeDateJoined,
      nextAppraisalDate,
      appraisalScore,
      appraisalAssigned,
      role,
      department,
      jobFunction,
      KPI,
      disciplinaryRecord,
      attendanceRecord
    ) {
      this.staffID = staffID;
      this.hodID = hodID;
      this.employeePassword = employeePassword;
      this.employeeName = employeeName;
      this.employeeEmail = employeeEmail;
      this.employeeDateJoined = employeeDateJoined;
      this.nextAppraisalDate = nextAppraisalDate;
      this.appraisalScore = appraisalScore;
      this.appraisalAssigned = appraisalAssigned;
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
          staffID VARCHAR(50) PRIMARY KEY,
          hodID VARCHAR(50) PRIMARY KEY,
          employeePassword VARCHAR(255),
          employeeName VARCHAR(255),
          employeeEmail VARCHAR(255),
          employeeDateJoined DATE,
          nextAppraisalDate DATE,
          appraisalScore INT,
          appraisalAssigned BOOLEAN,
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

  async function findRecordsByID(staffID) {
    try {
      const [rows] = await db.query('SELECT jobFunction, KPI, disciplinaryRecord, attendanceRecord FROM employees WHERE employeeID = ?', [staffID]);
  
      if (rows.length === 0) {
        throw new Error('Employee not found');
      }
  
      const employeeRecords = rows[0];
      // destructure
      const {jobFunction, KPI, disciplinaryRecord, attendanceRecord} = employeeRecords; 
  
      return {
        jobFunction,
        KPI,
        disciplinaryRecord,
        attendanceRecord
      };
    } catch (error) {
      console.error("Database connection failed. " + error);
      throw error;
    }
  }

  async function findByAppraisalDateDue() {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;

      // Query to get employees whose next appraisal month is the current month
      const [employees] = await db.pool.query(`SELECT employeeID, hodID FROM employees where MONTH(nextAppraisalDate) = ?`, [currentMonth]);
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
    console.log(result);
    return true
  } 
  catch (error) {
    throw new Error('Next meeting not updated');
  }
}

async function login(username, password) {
  try {
    const [rows] = await db.pool.query(
      `SELECT * FROM ${tableName} WHERE employeeID = ?`,
      [username]
    );

    if (rows.length === 0) {
      return {
        valid_user: false,
        user: null
      };
    }

    const user = rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = password === user.employeePassword;
    //TODO: add encryption to password
  //   const isPasswordValid = await bcrypt.compare(password, user.HRPassword);


    if (!isPasswordValid) {
      return {
        valid_user: false,
        user: null
      };
    }

    // Authentication successful
    //TODO: may need to change
    return {
      valid_user: true,
      user: {
        employee_ID: user.employeeID,
        employee_Name: user.employeeName,
        role: user.role,
      }
    };
  } catch (error) {
    console.error('Failed to authenticate: ' + error.message);
    return {
      valid_user: false,
      user: null
    };
    // throw error;
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
    const [rows] = await db.pool.query(query, [employeeID]);
    return rows

  } 
  catch (error) {
    throw new Error('Form not retrieved, problem with getting employeeName and department');
  }
}

module.exports = {Employee, sync, findRecordsByID, findByAppraisalDateDue, updateNextAppraisalDate, login, hrStatus};
