const db = require('./db.js');
const tableName = 'appraisalform';

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
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            msg VARCHAR(255),
            time DATETIME PRIMARY KEY
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function form() {
    return new AppraisalForm();
}

//appraisalform is an AppraisalForm object with the fields filled up accordingly.
async function insertOne(appraisalForm) {
  if (!appraisalForm || !appraisalForm.employeeID) {
    throw new Error("Invalid appraisal form data");
  }
  try {
    const query = `
      INSERT INTO ${tableName} (
        formID, employeeID, statusEmployee, statusHOD, formDateUploaded, 
        a1, a2_1, a2_2, a2_3, a2_4, a2_5, a2_6, a2_7, a2_8, 
        a3_1, commentsA3_1, a3_2, commentsA3_2, a3_3, commentsA3_3, 
        a3_4, commentsA3_4, a3_5, commentsA3_5, a3_6, commentsA3_6, 
        a3_7, commentsA3_7, a3_8, commentsA3_8, a3_9, commentsA3_9, 
        a3_10, commentsA3_10, a3_11, commentsA3_11, a3_12, commentsA3_12, 
        a3_13, commentsA3_13, a3_14, commentsA3_14, a3_15, commentsA3_15, 
        a3_16, commentsA3_16, a3_17, commentsA3_17, a3_18, commentsA3_18, 
        a3_19, commentsA3_19, a3_20, commentsA3_20, b
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      appraisalForm.formID, appraisalForm.employeeID, appraisalForm.statusEmployee, appraisalForm.statusHOD, appraisalForm.formDateUploaded, 
      appraisalForm.a1, appraisalForm.a2_1, appraisalForm.a2_2, appraisalForm.a2_3, appraisalForm.a2_4, appraisalForm.a2_5, appraisalForm.a2_6, appraisalForm.a2_7, appraisalForm.a2_8, 
      appraisalForm.a3_1, appraisalForm.commentsA3_1, appraisalForm.a3_2, appraisalForm.commentsA3_2, appraisalForm.a3_3, appraisalForm.commentsA3_3, 
      appraisalForm.a3_4, appraisalForm.commentsA3_4, appraisalForm.a3_5, appraisalForm.commentsA3_5, appraisalForm.a3_6, appraisalForm.commentsA3_6, 
      appraisalForm.a3_7, appraisalForm.commentsA3_7, appraisalForm.a3_8, appraisalForm.commentsA3_8, appraisalForm.a3_9, appraisalForm.commentsA3_9, 
      appraisalForm.a3_10, appraisalForm.commentsA3_10, appraisalForm.a3_11, appraisalForm.commentsA3_11, appraisalForm.a3_12, appraisalForm.commentsA3_12, 
      appraisalForm.a3_13, appraisalForm.commentsA3_13, appraisalForm.a3_14, appraisalForm.commentsA3_14, appraisalForm.a3_15, appraisalForm.commentsA3_15, 
      appraisalForm.a3_16, appraisalForm.commentsA3_16, appraisalForm.a3_17, appraisalForm.commentsA3_17, appraisalForm.a3_18, appraisalForm.commentsA3_18, 
      appraisalForm.a3_19, appraisalForm.commentsA3_19, appraisalForm.a3_20, appraisalForm.commentsA3_20, appraisalForm.b
    ];

    const [rows, fieldDefs] = await db.pool.query(query, values);
  } catch (error) {
    console.error("database connection failed. Problem: insertOne(appraisalForm)! " + error);
    throw error;
  }
}

async function retrieveForm(formID){
  try{
    const [rows, fieldDefs] = await db.pool.query(
      `SELECT * from ${tableName} where FormID = ${formID}`
    );
  
    const form = new AppraisalForm(rows[0]);
    return form; 
  } 
  catch (error) {
    throw new Error('Form not formed');
  }
}

