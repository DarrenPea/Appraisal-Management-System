const db = require('./db.js');
const formModel = require('./appraisalform.js');
const tableName = 'employees';

class Employee {
    constructor(
      staffID,
      managerID,
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
      this.managerID = managerID;
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
          managerID VARCHAR(50) PRIMARY KEY,
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

  async function findStatusByID(staffID) {
    try {
      const [rows_employee] = await db.query('SELECT appraisalAssigned FROM employee WHERE staffID = ?', [staffID]);
      // If formModel got function for getting employee status can just call function instead
      const [rows_form] = await formModel.query('SELECT statusEmployee FROM appraisalform WHERE staffID = ?', [staffID]);
      
      if (rows_employee.length === 0 || rows_form.length === 0) {
        throw new Error('Employee or appraisal form not found');
      }

      const employee = rows_employee[0];
      const form = rows_form[0];
      const formAssigned = Boolean(employee.appraisalAssigned);
      const employeeStatus = Boolean(form.statusEmployee);

      return [formAssigned, employeeStatus];
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
    }
  }

  async function findRecordsByID(staffID) {
    try {
      const [rows] = await db.query('SELECT jobFunction, KPI, disciplinaryRecord, attendanceRecord FROM employee WHERE staffID = ?', [staffID]);
  
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
      const [employees] = await db.query(`SELECT employeeID, managerID FROM employee where MONTH(next_appraisal_date) = ?`, [currentMonth]);
      return employees;
      } catch (error) {
        console.error('Error finding employees by appraisal date:', error);
        throw error;
      }
    }

  async function updateNextAppraisalDate(employeeID){
  let date_join;
  try{
    const query = `
      SELECT employeeDateJoined
      FROM ${tableName}
      WHERE employeeID = ?
    `;

    const [rows] = await db.query(query, [employeeID]);
    date_join = rows[0].employeeDateJoined;
  }
  catch (error) {
    throw new Error('Could not get date_joined');
  }

  try{
    const query = `
      UPDATE ${tableName} 
      SET nextAppraisalDate = STR_TO_DATE(CONCAT(YEAR(DATE_ADD(NOW(), INTERVAL 1 YEAR)), '-', MONTH(date_join), '-', DAY(date_join)), '%Y-%m-%d')
      WHERE employeeID = ?
    `;

    await db.query(query, [employeeID]);
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

  module.exports = {Employee, sync, findStatusByID, findRecordsByID, findByAppraisalDateDue, updateNextAppraisalDate, login};
