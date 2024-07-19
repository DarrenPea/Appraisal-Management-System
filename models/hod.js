const db = require('./db.js');
const tableName = 'hod';

class HOD {
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

  async function sync() {
    try { 
        db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            ManagerID VARCHAR(255) PRIMARY KEY,
            ManagerPassword VARCHAR(255) NOT NULL,
            ManagerName VARCHAR(255) NOT NULL,
            ManagerEmail VARCHAR(255) NOT NULL,
            ManagerDepartment VARCHAR(255),
            Role VARCHAR(255)
        )
        `);
    } catch (error) {
        console.error("database connection failed. " + error);
        throw error;
    }
}

//routename: /hod/login
async function login(username, password) {
    try {
      const [rows] = await db.pool.query(
        `SELECT * FROM ${tableName} WHERE managerID = ?`,
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
      const isPasswordValid = password === user.managerPassword;
      //TODO: add encryption to password
    //   const isPasswordValid = await bcrypt.compare(password, user.ManagerPassword);

  
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
          managerID: user.managerID,
          managerName: user.managerName,
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

module.exports =  { HOD, login}
