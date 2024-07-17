const db = require('./db.js');
const tableName = 'hr';

class HR {
    constructor(
      managerID,
      managerPassword,
      managerName,
      managerEmail,
      managerDepartment,
      role
    ) {
      this.managerID = managerID;
      this.managerPassword = managerPassword;
      this.managerName = managerName;
      this.managerEmail = managerEmail;
      this.managerDepartment = managerDepartment;
      this.role = role;
    }
  }