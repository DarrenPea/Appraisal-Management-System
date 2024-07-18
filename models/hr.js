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
      `SELECT * FROM ${tableName} WHERE HRID = ?`,
      [username]
    );

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    const user = rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = password === user.HRPassword;
    //TODO: add encryption to password
  //   const isPasswordValid = await bcrypt.compare(password, user.HRPassword);


    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Authentication successful
    //TODO: may need to change
    return {
      message: 'Authentication successful',
      user: {
        HR_ID: user.HRID,
        HR_Name: user.HRName,
        HR_Email: user.HREmail,
        role: user.Role,
      }
    };
  } catch (error) {
    console.error('Failed to authenticate: ' + error.message);
    throw error;
  }
}

async function retrieve_employeeData(staffID) {
  //TODO: add additional params to appraisalform table
    try {
        // Extract the first 5 column names
        //TODO: change to a new column name called EmployeeData
        const columnName = 'EmployeeEmail';
        // const columnName = employee_KPI;

        //get from database based on the column names
        //TODO: change EmployeeID to HRID, since we want all forms under HOD
        const [rows] = await db.pool.query(
          `SELECT ${columnName} FROM ${staffTableName} WHERE EmployeeID = ?`,
          [staffID]
      );
        return rows;

    } catch (error) {   
        console.error('Failed to retrieve employee data: ' + error.message);
        throw error;
    }
}

module.exports =  {HR, login, retrieve_employeeData}