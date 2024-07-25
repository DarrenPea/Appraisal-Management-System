const db = require('./db.js');
const tableName = 'hr';

class HR {
    constructor(
      HRID,
      HRPassword,
      HRName,
      HREmail,
      HRDepartment,
      role
    ) {
      this.HRID = HRID;
      this.HRPassword = HRPassword;
      this.HRName = HRName;
      this.HREmail = HREmail;
      this.HRDepartment = HRDepartment;
      this.role = role;
    }
  }

  async function sync() {
    try { 
        db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            hrID VARCHAR(255) PRIMARY KEY,
            hrPassword VARCHAR(255) NOT NULL,
            hrName VARCHAR(255) NOT NULL,
            hrEmail VARCHAR(255) NOT NULL,
            hrDepartment VARCHAR(255),
            role VARCHAR(255)
        )
        `);
    } catch (error) {
        console.error("database connection failed. " + error);
        throw error;
    }
}

  //routename: /hr/login
  async function login(staffID, password) {
    try {
      const [rows] = await db.pool.query(
        `SELECT hrName, role, hrPassword 
        FROM ${tableName} 
        WHERE hrID = ?`,
        [staffID]
      );
  
      // code 1 means employeeID not found
      if (rows.length === 0) {
        return [1];
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = password === rows[0].hrPassword;
      //TODO: add encryption to password
    //   const isPasswordValid = await bcrypt.compare(password, user.HRPassword);
  
      //code 2 means password is invalid
      if (!isPasswordValid) {
        return [2];
      }
  
      // code 0 means authentication successful
      delete rows[0].hrPassword;
      
  
      // Authentication successful
      //TODO: may need to change
      return rows;
  
    } catch (error) {
      console.error('Failed to authenticate: ' + error.message);
      return {
        valid_user: false,
        user: null
      };
      // throw error;
    }
  }
  

module.exports =  {HR, login}