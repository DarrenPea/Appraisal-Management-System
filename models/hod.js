const db = require('./db.js');
const tableName = 'hod';
const staffTableName = 'employees'
const appraisalTableName = 'appraisalform';

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
        `SELECT * FROM ${tableName} WHERE ManagerID = ?`,
        [username]
      );
  
      if (rows.length === 0) {
        throw new Error('User not found');
      }
  
      const user = rows[0];
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = password === user.ManagerPassword;
      //TODO: add encryption to password
    //   const isPasswordValid = await bcrypt.compare(password, user.ManagerPassword);

  
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
  
      // Authentication successful
      //TODO: may need to change
      return {
        message: 'Authentication successful',
        user: {
          managerID: user.ManagerID,
          managerName: user.ManagerName,
          managerEmail: user.ManagerEmail,
          managerDepartment: user.ManagerDepartment,
          role: user.Role,
        }
      };
    } catch (error) {
      console.error('Failed to authenticate: ' + error.message);
      throw error;
    }
  }







  
// //routename: /form/HOD
// async function retrieve_indivForm(staffID) {
//     try {
//         // Get the column names
//         const [columns] = await db.pool.query(`SHOW COLUMNS FROM ${appraisalTableName}`);

//         //the last qn for staff
//         const staffqn_num = 10;
//         // Extract the first n column names based on the last qn of staff
//         const columnNames = columns.slice(0, staffqn_num).map(col => col.Field).join(', ');

//         //get from database all form details & answers completed by staff
//         const [rows] = await db.pool.query(
//           `SELECT ${columnNames} FROM ${appraisalTableName} WHERE EmployeeID = ?`,
//           [staffID]
//       );
//         return rows;
//     } catch (error) {
//         console.error ('Fail to submit');
//         throw error;
//     }
// }

// /* 
// routename: form/HOD/submit
// Havent tested

// data to be passed in this form
// {
//     "staffID": "someStaffID",
//     "a1": "value1",
//     "a2": "value2",
//     "a3": "value3",
//     "a4": "value4",
//     ...
// }
// */
// //routename: form/HOD/submit
// async function submit_indivForm(req, res) {
//   try {
//       // Extract staffID and the rest of the form data
//       const { staffID, ...formData } = req.body;

//       // Check if formData is properly extracted
//       console.log('Form data:', formData);

//       // Get the column names from the appraisalTableName
//       const [columns] = await db.pool.query(`SHOW COLUMNS FROM ${appraisalTableName}`);
      
//       // Index for the first question that HOD needs to fill up
//       const hodstart_qn = 7;

//       // Extract column names starting from index 7 onwards
//       const columnNames = columns.slice(hodstart_qn).map(col => col.Field);
      
//       // Extract values from formData that correspond to the columns starting from index 7 onwards
//       const values = columnNames.map(col => formData[col]);

//       // Check for undefined values
//       values.forEach((value, index) => {
//           if (value === undefined) {
//               console.log(`Value for column ${columnNames[index]} is undefined`);
//           }
//       });

//       // Construct the SET clause for the UPDATE query
//       const setClause = columnNames.map(col => `${col} = ?`).join(', ');

//       // Construct the UPDATE query
//       const query = `UPDATE ${appraisalTableName} SET ${setClause} WHERE EmployeeID = ?`;

//       // Execute the query
//       await db.pool.query(query, [...values, staffID]);
      
//       res.status(200).send('Form submitted successfully');
//   } catch (error) {
//       console.error('Failed to submit: ' + error.message);
//       res.status(500).send('Failed to submit form');
//   }
// }

// //routename: employee/details
// async function retrieve_employeeData(staffID) {
//   //TODO: add additional params to appraisalform table
//     try {
//         // Extract the first 5 column names
//         //TODO: change to a new column name called EmployeeData
//         const columnName = 'EmployeeEmail';
//         // const columnName = employee_KPI;

//         //get from database based on the column names
//         //TODO: change EmployeeID to ManagerID, since we want all forms under HOD
//         const [rows] = await db.pool.query(
//           `SELECT ${columnName} FROM ${staffTableName} WHERE EmployeeID = ?`,
//           [staffID]
//       );
//         return rows;

//     } catch (error) {   
//         console.error('Failed to retrieve employee data: ' + error.message);
//         throw error;
//     }
// }

// //routename: /form/HOD/status
// async function retrieve_allforms(hodID) {
//   //TODO: add additional params to appraisalform table
//     try {
//         // Get the column names
//         const [columns] = await db.pool.query(`SHOW COLUMNS FROM ${appraisalTableName}`);

//         // Extract the first 5 column names
//         const columnNames = columns.slice(0, 5).map(col => col.Field).join(', ');

//         //get from appraisalfomr table database based on the column names
//         //TODO: change EmployeeID to ManagerID, since we want all forms under HOD
//         const [rows] = await db.pool.query(
//           `SELECT ${columnNames} FROM ${appraisalTableName} WHERE EmployeeID = ?`,
//           [hodID]
//       );
//         return rows;

//     } catch (error) {   
//         console.error('Failed to retrieve forms: ' + error.message);
//         throw error;
//     }
// }

module.exports =  { HOD, login, retrieve_indivForm, retrieve_allforms, submit_indivForm, retrieve_employeeData}
