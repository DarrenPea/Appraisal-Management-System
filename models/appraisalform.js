const db = require('./db.js');
const tableName = 'appraisalform';
const employeetable = 'employee';

class AppraisalForm {
  constructor() {
    this.formID = null;
    this.employeeID = null;
    this.statusEmployee = null;
    this.statusHOD = null;
    this.formDateUploaded = null;
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
    this.b = null;
  }
}

async function sync() {
  try {
    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        formID INT AUTO_INCREMENT PRIMARY KEY,
        employeeID INT NOT NULL,
        managerID INT,
        statusEmployee BOOLEAN,
        statusHOD BOOLEAN,
        formDateUploaded DATETIME,
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
        b TEXT
      )
    `);
  } catch (error) {
    console.error("Database connection failed. " + error);
    throw error;
  }
}

// /form/retrieve. NEED TO DELETE?
async function blank_form() {
    return new AppraisalForm();
}

//appraisalform is an AppraisalForm object with the fields filled up accordingly.
// /form/employee/submit
async function insertOne(employeeID, formfields) {
  if (formfields.length != 50) {
    throw new Error("insertOne: something wrong with formfields length, it is " + formfields.length);
  }
  
  let managerID;
  // Query for managerID
  try {
    const query = `SELECT managerID FROM ${employeetable} WHERE employeeID = ?`;
    const result = await db.query(query, [employeeID]);
    if (result.length > 0) {
      managerID = result[0].managerID;
    } else {
      throw new Error("insertOne: Can't obtain managerID with employeeID:" + employeeID); // No matching employee found
    }
  } catch (error) {
    console.error("Error fetching manager ID:", error);
    throw error; // Rethrow or handle as needed
  }

  // Updating appraisalForm table
  try {
    const query = `
      INSERT INTO ${tableName} (
        employeeID, managerID, statusEmployee, statusHOD, formDateUploaded, 
        a1, a2_1, a2_2, a2_3, a2_4, a2_5, a2_6, a2_7, a2_8, 
        a3_1, commentsA3_1, a3_2, commentsA3_2, a3_3, commentsA3_3, 
        a3_4, commentsA3_4, a3_5, commentsA3_5, a3_6, commentsA3_6, 
        a3_7, commentsA3_7, a3_8, commentsA3_8, a3_9, commentsA3_9, 
        a3_10, commentsA3_10, a3_11, commentsA3_11, a3_12, commentsA3_12, 
        a3_13, commentsA3_13, a3_14, commentsA3_14, a3_15, commentsA3_15, 
        a3_16, commentsA3_16, a3_17, commentsA3_17, a3_18, commentsA3_18, 
        a3_19, commentsA3_19, a3_20, commentsA3_20, b
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [employeeID, managerID, true, false, new Date(), ...formfields];
    await db.pool.query(query, values);
    return true;
  } catch (error) {
    console.error("Database connection failed. Problem: insertOne(appraisalForm)! " + error);
    throw error; // Rethrow or handle as needed
  }
}


//retrieveForm returns ONE SINGULAR FORM to be FILLED UP
async function retrieveForm(employeeID){
  try{
    const curr_year = new Date().getFullYear();
    const query = `
      SELECT * 
      FROM ${tableName} 
      WHERE employeeID = ? 
        AND YEAR(FormDateUploaded) = ?
    `;

    //rows is an array of data
    const [rows] = await db.pool.query(query, [employeeID, curr_year]);

    // slice 5 cause we only want to give the columns pertaining to the questions in the form
    return rows
  } 
  catch (error) {
    throw new Error('Form not retrieved');
  }
}


// /form/HOD/submit
async function updateOne(formID, formfields) {
  if (formfields.length != 52) {
    throw new Error("updateOne: formfields length is not 52, it is " + formfields.length);
  }
  const curr_year = new Date().getFullYear();

  try {
    // we dont insert into formID cause that'll be auto generated
    const query = `
    UPDATE ${tableName} SET
    statusHOD = ?, formDateUploaded = ?, 
    a1 = ?, a2_1 = ?, a2_2 = ?, a2_3 = ?, a2_4 = ?, a2_5 = ?, a2_6 = ?, a2_7 = ?, a2_8 = ?, 
    a3_1 = ?, commentsA3_1 = ?, a3_2 = ?, commentsA3_2 = ?, a3_3 = ?, commentsA3_3 = ?, 
    a3_4 = ?, commentsA3_4 = ?, a3_5 = ?, commentsA3_5 = ?, a3_6 = ?, commentsA3_6 = ?, 
    a3_7 = ?, commentsA3_7 = ?, a3_8 = ?, commentsA3_8 = ?, a3_9 = ?, commentsA3_9 = ?, 
    a3_10 = ?, commentsA3_10 = ?, a3_11 = ?, commentsA3_11 = ?, a3_12 = ?, commentsA3_12 = ?, 
    a3_13 = ?, commentsA3_13 = ?, a3_14 = ?, commentsA3_14 = ?, a3_15 = ?, commentsA3_15 = ?, 
    a3_16 = ?, commentsA3_16 = ?, a3_17 = ?, commentsA3_17 = ?, a3_18 = ?, commentsA3_18 = ?, 
    a3_19 = ?, commentsA3_19 = ?, a3_20 = ?, commentsA3_20 = ?, b = ?
    WHERE formID = ? AND YEAR(FormDateUploaded) = ?
    `;
    // Add formID and current year to the values array
    const values = [...formfields, formID, curr_year]

    await db.pool.query(query, values);
    return true;
  } catch (error) {
    console.error("database connection failed. Problem: insertOne(formID, formfields)! " + error);
    return false
  }
}


// /form/HOD/status
// returns an array where each element is an array that represents a form
async function retrieveAllForms(managerID){
  const curr_year = new Date().getFullYear();
  try{
    // get table entries based on managerID and current year.
    const query = `
      SELECT EmployeeID, ManagerID, StatusEmployee, StatusHOD, FormDateUploaded 
      FROM ${tableName}
      WHERE ManagerID = ?
      AND YEAR(FormDateUploaded) = ?

    `;

    //rows is an array of data. 
    const [rows] = await db.pool.query(query, [managerID, curr_year]);
    return rows

  } 
  catch (error) {
    throw new Error('Form not retrieved, problem with retrieveAllForms');
  }
}