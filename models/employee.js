const db = require('./db.js');
const formModel = require('./appraisalform.js');
const tableName = 'employee';

class Employee {
    constructor(
      staffID,
      employeePassword,
      employeeName,
      employeeEmail,
      dateOfAppraisalMeeting,
      employeeDateJoined,
      lastAppraisalDate,
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
      this.employeePassword = employeePassword;
      this.employeeName = employeeName;
      this.employeeEmail = employeeEmail;
      this.dateOfAppraisalMeeting = dateOfAppraisalMeeting;
      this.employeeDateJoined = employeeDateJoined;
      this.lastAppraisalDate = lastAppraisalDate;
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
          employeePassword VARCHAR(255),
          employeeName VARCHAR(255),
          employeeEmail VARCHAR(255),
          dateOfAppraisalMeeting DATE,
          employeeDateJoined DATE,
          lastAppraisalDate DATE,
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

  module.exports = {Employee, sync, findStatusByID, findRecordsByID};
