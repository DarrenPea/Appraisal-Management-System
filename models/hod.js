const db = require('./db.js');
const tableName = 'hod';

class HOD {
    constructor(
      hodID,
      hodPassword,
      hodName,
      hodEmail,
      hodDepartment,
      role
    ) {
      this.hodID = hodID;
      this.hodPassword = hodPassword;
      this.hodName = hodName;
      this.hodEmail = hodEmail;
      this.hodDepartment = hodDepartment;
      this.role = role;
    }
  }

  async function sync() {
    try { 
        db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            hodID VARCHAR(255) PRIMARY KEY,
            hodPassword VARCHAR(255) NOT NULL,
            hodName VARCHAR(255) NOT NULL,
            hodEmail VARCHAR(255) NOT NULL,
            hodDepartment VARCHAR(255),
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
        `SELECT * FROM ${tableName} WHERE hodID = ?`,
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
      const isPasswordValid = password === user.hodPassword;
      //TODO: add encryption to password
    //   const isPasswordValid = await bcrypt.compare(password, user.hodPassword);

  
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
          hodID: user.hodID,
          hodName: user.hodName,
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
