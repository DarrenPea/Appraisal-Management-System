const db = require('./db.js');
const tableName = 'employee';

class Employee {
    constructor(
      employeeID,
      employeePassword,
      employeeName,
      employeeEmail,
      dateOfAppraisalMeeting,
      employeeDateJoined,
      lastAppraisalDate,
      appraisalScore,
      appraisalAssigned,
      role
    ) {
      this.employeeID = employeeID;
      this.employeePassword = employeePassword;
      this.employeeName = employeeName;
      this.employeeEmail = employeeEmail;
      this.dateOfAppraisalMeeting = dateOfAppraisalMeeting;
      this.employeeDateJoined = employeeDateJoined;
      this.lastAppraisalDate = lastAppraisalDate;
      this.appraisalScore = appraisalScore;
      this.appraisalAssigned = appraisalAssigned;
      this.role = role;
    }
  }

  