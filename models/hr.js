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

  //routename: /hr/login
async function login(username, password) {
  try {
    const [rows] = await db.pool.query(
      `SELECT * FROM ${tableName} WHERE hrID = ?`,
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
    const isPasswordValid = password === user.hrPassword;
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
        HR_ID: user.hrID,
        HR_Name: user.hrName,
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

module.exports =  {HR, login}