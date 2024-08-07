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
async function login(staffID, password) {

  if (typeof staffID !== 'string' || typeof password !== 'string') {
    return [3];
  }
  
  try {
    const [rows] = await db.pool.query(
      `SELECT hodName, role, hodPassword 
      FROM ${tableName} 
      WHERE hodID = ?`,
      [staffID]
    );

    // code 1 means employeeID not found
    if (rows.length === 0) {
      return [1];
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = password === rows[0].hodPassword;
    //TODO: add encryption to password
  //   const isPasswordValid = await bcrypt.compare(password, user.HRPassword);

    //code 2 means password is invalid
    if (!isPasswordValid) {
      return [2];
    }

    // code 0 means authentication successful
    delete rows[0].hodPassword;
    

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

module.exports =  { HOD, login}
