const db = require('./db.js');
const tableName = 'appraisalform';

//i think i didnt even use this appraisalform class
class AppraisalForm {
  constructor() {
    this.formID = null;
    this.employeeID = null;
    this.hodID = null;
    this.statusEmployee = null;
    this.statusHOD = null;
    this.dateCreated = null;
    this.lastUpdated = null;
    this.a1 = null;
    this.a2_1 = null;
    this.a2_2 = null;
    this.a2_3 = null;
    this.a2_4 = null;
    this.a2_5 = null;
    this.a2_6 = null;
    this.a2_7 = null;
    this.a2_8 = null;
    this.a3_1 = null;
    this.commentsA3_1 = null;
    this.a3_2 = null;
    this.commentsA3_2 = null;
    this.a3_3 = null;
    this.commentsA3_3 = null;
    this.a3_4 = null;
    this.commentsA3_4 = null;
    this.a3_5 = null;
    this.commentsA3_5 = null;
    this.a3_6 = null;
    this.commentsA3_6 = null;
    this.a3_7 = null;
    this.commentsA3_7 = null;
    this.a3_8 = null;
    this.commentsA3_8 = null;
    this.a3_9 = null;
    this.commentsA3_9 = null;
    this.a3_10 = null;
    this.commentsA3_10 = null;
    this.a3_11 = null;
    this.commentsA3_11 = null;
    this.a3_12 = null;
    this.commentsA3_12 = null;
    this.a3_13 = null;
    this.commentsA3_13 = null;
    this.a3_14 = null;
    this.commentsA3_14 = null;
    this.a3_15 = null;
    this.commentsA3_15 = null;
    this.a3_16 = null;
    this.commentsA3_16 = null;
    this.a3_17 = null;
    this.commentsA3_17 = null;
    this.a3_18 = null;
    this.commentsA3_18 = null;
    this.a3_19 = null;
    this.commentsA3_19 = null;
    this.a3_20 = null;
    this.commentsA3_20 = null;
    this.overallRating = null;
    this.b = null;
  }
}

async function sync() {
  try {
    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        formID INT AUTO_INCREMENT PRIMARY KEY,
        employeeID INT NOT NULL,
        hodID INT,
        statusEmployee BOOLEAN,
        statusHOD BOOLEAN,
        dateCreated DATE,
        lastUpdated DATE,
        appraisalType VARCHAR(255),
        dueDate DATE, 
        a1 VARCHAR(255),
        a2_1 VARCHAR(255),
        a2_2 VARCHAR(255),
        a2_3 VARCHAR(255),
        a2_4 VARCHAR(255),
        a2_5 VARCHAR(255),
        a2_6 VARCHAR(255),
        a2_7 VARCHAR(255),
        a2_8 VARCHAR(255),
        a3_1 VARCHAR(255),
        commentsA3_1 TEXT,
        a3_2 VARCHAR(255),
        commentsA3_2 TEXT,
        a3_3 VARCHAR(255),
        commentsA3_3 TEXT,
        a3_4 VARCHAR(255),
        commentsA3_4 TEXT,
        a3_5 VARCHAR(255),
        commentsA3_5 TEXT,
        a3_6 VARCHAR(255),
        commentsA3_6 TEXT,
        a3_7 VARCHAR(255),
        commentsA3_7 TEXT,
        a3_8 VARCHAR(255),
        commentsA3_8 TEXT,
        a3_9 VARCHAR(255),
        commentsA3_9 TEXT,
        a3_10 VARCHAR(255),
        commentsA3_10 TEXT,
        a3_11 VARCHAR(255),
        commentsA3_11 TEXT,
        a3_12 VARCHAR(255),
        commentsA3_12 TEXT,
        a3_13 VARCHAR(255),
        commentsA3_13 TEXT,
        a3_14 VARCHAR(255),
        commentsA3_14 TEXT,
        a3_15 VARCHAR(255),
        commentsA3_15 TEXT,
        a3_16 VARCHAR(255),
        commentsA3_16 TEXT,
        a3_17 VARCHAR(255),
        commentsA3_17 TEXT,
        a3_18 VARCHAR(255),
        commentsA3_18 TEXT,
        a3_19 VARCHAR(255),
        commentsA3_19 TEXT,
        a3_20 VARCHAR(255),
        commentsA3_20 TEXT,
        overallRating FLOAT,
        b LONGTEXT
      )
    `);
  } catch (error) {
    console.error("Database connection failed. " + error);
    throw error;
  }
}

// /form/employee/status
// checks if there is a form assigned to employee in current month
async function employeeStatus(employeeID) {
  try {
    const curr_year = new Date().getFullYear();
    const curr_month = new Date().getMonth() + 1; // JavaScript months are 0-indexed, SQL months are 1-indexed
    // get previous month/year
    const prev_month = curr_month === 1 ? 12: curr_month - 1;
    const prev_year = curr_month === 1 ? curr_year - 1 : curr_year;

    const query = `
      SELECT formID, statusEmployee, appraisalType, dueDate
      FROM ${tableName}
      WHERE employeeID = ?
      AND (
        (YEAR(dateCreated) = ? AND MONTH(dateCreated) = ?) 
        OR 
        (YEAR(dateCreated) = ? AND MONTH(dateCreated) = ?)
      )
    `;
    const [rows] = await db.pool.query(query, [employeeID, curr_year, curr_month, prev_year, prev_month]);
    return rows;  
  } catch (error) {
    console.error("Error fetching form: ", error);
    throw error;  
  }
}

//retrieveForm returns ONE SINGULAR FORM to be FILLED UP
async function retrieveForm(formID){
  try{
    const query = `
      SELECT * 
      FROM ${tableName} 
      WHERE formID = ? 
    `;

    //rows is an array of data
    const [row] = await db.pool.query(query, [formID]);

    return row;
  } 
  catch (error) {
    throw new Error('Form not retrieved');
  }
} 

// /form/HOD/submit (PREVIOUS VERSION)
// async function updateForm(formID, formfields, statusHOD = false) {
//   if (formfields.length != 51) {
//     throw new Error("updateOne: formfields length is not 51, it is " + formfields.length);
//   }

//   try {
    
//     // we dont insert into formID cause that'll be auto generated
//     const query = `
//     UPDATE ${tableName} SET
//     statusEmployee = ?, statusHOD = ?, lastUpdated = ?, 
//     A1 = ?, A2_1 = ?, A2_2 = ?, A2_3 = ?, A2_4 = ?, A2_5 = ?, A2_6 = ?, A2_7 = ?, A2_8 = ?, 
//     A3_1 = ?, CommentsA3_1 = ?, A3_2 = ?, CommentsA3_2 = ?, A3_3 = ?, CommentsA3_3 = ?, 
//     A3_4 = ?, CommentsA3_4 = ?, A3_5 = ?, CommentsA3_5 = ?, A3_6 = ?, CommentsA3_6 = ?, 
//     A3_7 = ?, CommentsA3_7 = ?, A3_8 = ?, CommentsA3_8 = ?, A3_9 = ?, CommentsA3_9 = ?, 
//     A3_10 = ?, CommentsA3_10 = ?, A3_11 = ?, CommentsA3_11 = ?, A3_12 = ?, CommentsA3_12 = ?, 
//     A3_13 = ?, CommentsA3_13 = ?, A3_14 = ?, CommentsA3_14 = ?, A3_15 = ?, CommentsA3_15 = ?, 
//     A3_16 = ?, CommentsA3_16 = ?, A3_17 = ?, CommentsA3_17 = ?, A3_18 = ?, CommentsA3_18 = ?, 
//     A3_19 = ?, CommentsA3_19 = ?, A3_20 = ?, CommentsA3_20 = ?, overallRating = ?, b = ?
//     WHERE formID = ? 
// `;
//     // Add formID and current year to the values array
//     const values = [true, statusHOD, new Date(), ...formfields, formID]

//     await db.pool.query(query, values);
//     return [true];
//   } catch (error) {
//     console.log(error);
//     throw new Error('Form not retrieved, problem with retrieveAllForms');
//   }
// }

/*to include flag for saving form /form/HOD/submit (NEW VERSION)*/
async function updateForm(formID, formfields, saveStatus, statusHOD = false) {
  if (formfields.length != 51) {
    throw new Error("updateOne: formfields length is not 51, it is " + formfields.length);
  }

  if (saveStatus && statusHOD===false) {
    statusEmployee = false;
  } else if (saveStatus && statusHOD){
    statusHOD = false;
    statusEmployee = true;
  } else {
    statusEmployee = true;
  }

  try {
    
    // we dont insert into formID cause that'll be auto generated
    const query = `
    UPDATE ${tableName} SET
    statusEmployee = ?, statusHOD = ?, lastUpdated = ?, 
    A1 = ?, A2_1 = ?, A2_2 = ?, A2_3 = ?, A2_4 = ?, A2_5 = ?, A2_6 = ?, A2_7 = ?, A2_8 = ?, 
    A3_1 = ?, CommentsA3_1 = ?, A3_2 = ?, CommentsA3_2 = ?, A3_3 = ?, CommentsA3_3 = ?, 
    A3_4 = ?, CommentsA3_4 = ?, A3_5 = ?, CommentsA3_5 = ?, A3_6 = ?, CommentsA3_6 = ?, 
    A3_7 = ?, CommentsA3_7 = ?, A3_8 = ?, CommentsA3_8 = ?, A3_9 = ?, CommentsA3_9 = ?, 
    A3_10 = ?, CommentsA3_10 = ?, A3_11 = ?, CommentsA3_11 = ?, A3_12 = ?, CommentsA3_12 = ?, 
    A3_13 = ?, CommentsA3_13 = ?, A3_14 = ?, CommentsA3_14 = ?, A3_15 = ?, CommentsA3_15 = ?, 
    A3_16 = ?, CommentsA3_16 = ?, A3_17 = ?, CommentsA3_17 = ?, A3_18 = ?, CommentsA3_18 = ?, 
    A3_19 = ?, CommentsA3_19 = ?, A3_20 = ?, CommentsA3_20 = ?, overallRating = ?, b = ?
    WHERE formID = ? `;

    // Add formID and current year to the values array
    const values = [statusEmployee, statusHOD, new Date(), ...formfields, formID]

    await db.pool.query(query, values);
    return [true];
  } catch (error) {
    console.log(error);
    throw new Error('Form not retrieved, problem with retrieveAllForms');
  }
}

// /form/HOD/status
// returns an array where each element is an array that represents a form
async function hodStatus(hodID){  
  const curr_year = new Date().getFullYear();
  const curr_month = new Date().getMonth() + 1; // JavaScript months are 0-indexed, SQL months are 1-indexed
  // get previous month/year
  const prev_month = curr_month === 1 ? 12: curr_month - 1;
  const prev_year = curr_month === 1 ? curr_year - 1 : curr_year;

  try{
    // get table entries based on hodID and current year.
    const query = `
      SELECT formID, employeeID, statusEmployee, statusHOD, appraisalType, dueDate 
      FROM ${tableName}
      WHERE hodID = ?
      AND (
        (YEAR(dateCreated) = ? AND MONTH(dateCreated) = ?)
        OR
        (YEAR(dateCreated) = ? AND MONTH(dateCreated) = ?)
      )
    `;
    //rows is an array of data. 
    const [rows] = await db.pool.query(query, [hodID, curr_year, curr_month, prev_year, prev_month]);
    console.log(rows);
    return rows

  } 
  catch (error) {
    throw new Error('Form not retrieved, problem with retrieveAllForms');
  }
}

// /form/HR/status
async function hrStatus(){
  try{
    const curr_year = new Date().getFullYear();
    const curr_month = new Date().getMonth() + 1; // JavaScript months are 0-indexed, SQL months are 1-indexed
    // get previous month/year
    const prev_month = curr_month === 1 ? 12: curr_month - 1;
    const prev_year = curr_month === 1 ? curr_year - 1 : curr_year;

    const query = `
      SELECT  formID, employeeID, hodID, statusEmployee, statusHOD, appraisalType, dueDate 
      FROM ${tableName}
      WHERE 
        (YEAR(lastUpdated) = ? AND MONTH(lastUpdated) = ?)
        OR 
        (YEAR(lastUpdated) = ? AND MONTH(lastUpdated) = ?)
    `;
    //rows is an array of data
    const [rows] = await db.pool.query(query, [curr_year, curr_month, prev_year, prev_month]);
    return rows
  } 
  catch (error) {
    throw new Error('Form not retrieved, problem with retrieveForHR');
  }
}

async function createEntry(employeeID, hodID){

  let appraisalType; 
  try {
    const query = `
      SELECT COUNT(*) AS entryCount 
      FROM ${tableName} 
      WHERE employeeID = ?
    `;
    const values = [employeeID];
    const [[result]] = await db.pool.query(query, values); // Destructure to get the first object directly
  
    if (result.entryCount == 0) {
      appraisalType = 'Confirmation';
    } else {
      appraisalType = 'Yearly';
    }
  } catch (error) {
    throw new Error('Error counting entries');
  }

  try{
    const query = ` 
      INSERT INTO ${tableName} (employeeID, hodID, appraisalType, statusEmployee,  statusHOD, dateCreated, lastUpdated, dueDate) 
      VALUES (?, ?, ?, false, false, NOW(), NOW(), NOW() + INTERVAL 1 MONTH)
    `;

    await db.pool.query(query, [employeeID, hodID, appraisalType]);
    return [true];
  } 
  catch (error) {
    throw new Error('Form not created');
  }
}

module.exports = {AppraisalForm, sync, hodStatus, retrieveForm, hrStatus, updateForm, employeeStatus, createEntry}