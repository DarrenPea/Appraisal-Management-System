const appraisalFormModel = require('../models/appraisalform.js');
const db = require('../models/db.js');
const request = require('supertest')
const app = require('../app');
const tablename = 'appraisalform';

async function setupInsert() {
    const formBackup = `${tablename}_backup`;
    try {
        // Create the table if it doesn't exist
        await appraisalFormModel.sync(); // Ensure the table is created

        // Your existing code to clear the 'message' table and insert test data
        await db.pool.query(`CREATE TABLE ${formBackup} LIKE ${tablename};`);
        // Copy the contents of the original table to the backup table
        await db.pool.query(`INSERT INTO ${formBackup} SELECT * FROM ${tablename};`);

        await db.pool.query(`TRUNCATE TABLE ${tablename}`);
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}

async function teardown() {
    const formBackup = `${tablename}_backup`;
    try {
        // Delete the original table
        await db.pool.query(`DROP TABLE ${tablename};`);

        // Rename the backup table to the original table's name
        await db.pool.query(`RENAME TABLE ${formBackup} TO ${tablename};`);

    } catch (error) {
        console.error("Teardown failed: " + error);
        throw error;
    }
}


describe("appraisalFormModel insertion unit tests", () => {
    beforeAll(async () => {
        await setupInsert();
    });

    test ("Testing: calling hrStatus with empty table", async () => {
        const value = await appraisalFormModel.hrStatus();

        expect(value).toEqual([]);  
    });

    test ("Testing: createEntry(employeeID, hodID)", async () => {
        const employeeId = 'E001';
        const hodId = 'M001';
        const time = new Date();
        time.setHours(0, time.getMinutes(), 0, time.getMilliseconds());

        const expectedReturn = [{employeeId : 'E001', hodId : 'M001', statusEmployee : 0, statusHOD : 0}];
        await appraisalFormModel.createEntry(employeeId, hodId);
        const value = await db.pool.query(`SELECT employeeId, hodId, statusEmployee, statusHOD FROM appraisalform WHERE employeeId = 'E001' AND hodId = 'M001'`);
        const [realDateCreated] = await db.pool.query(`SELECT dateCreated FROM appraisalform WHERE employeeID='E001' and hodID='M001'`)

        expect(value[0]).toEqual(expectedReturn);
        expect(time.getMonth() + 1).toEqual(realDateCreated[0].dateCreated.getMonth()+1);
    });
    
    test("Testing: updateForm(formID, formfields, saveStatus, statusHOD = true) for HOD", async () => {
        const formID = 1;
        const formfields = [
            'EMPLOYEE-ANSWERS1.1',
            'EMPLOYEE-ANSWERS2.1',
            'EMPLOYEE-ANSWERS2.2',
            'EMPLOYEE-ANSWERS2.3',
            'EMPLOYEE-ANSWERS2.4',
            'EMPLOYEE-ANSWERS2.5',
            'EMPLOYEE-ANSWERS2.6',
            'EMPLOYEE-ANSWERS2.7',
            'EMPLOYEE-ANSWERS2.8',
            3,
            'HOD-COMMENTS3', // Replace EMPLOYEE-ANSWERS3
            4,
            'HOD-COMMENTS4', // Replace EMPLOYEE-ANSWERS4
            5,
            'HOD-COMMENTS5', // Replace EMPLOYEE-ANSWERS5
            6,
            'HOD-COMMENTS6', // Replace EMPLOYEE-ANSWERS6
            7,
            'HOD-COMMENTS7', // Replace EMPLOYEE-ANSWERS7
            8,
            'HOD-COMMENTS8', // Replace EMPLOYEE-ANSWERS8
            9,
            'HOD-COMMENTS9', // Replace EMPLOYEE-ANSWERS9
            10,
            'HOD-COMMENTS10', // Replace EMPLOYEE-ANSWERS10
            11,
            'HOD-COMMENTS11', // Replace EMPLOYEE-ANSWERS11
            12,
            'HOD-COMMENTS12', // Replace EMPLOYEE-ANSWERS12
            13,
            'HOD-COMMENTS13', // Replace EMPLOYEE-ANSWERS13
            14,
            'HOD-COMMENTS14', // Replace EMPLOYEE-ANSWERS14
            15,
            'HOD-COMMENTS15', // Replace EMPLOYEE-ANSWERS15
            16,
            'HOD-COMMENTS16', // Replace EMPLOYEE-ANSWERS16
            17,
            'HOD-COMMENTS17', // Replace EMPLOYEE-ANSWERS17
            18,
            'HOD-COMMENTS18', // Replace EMPLOYEE-ANSWERS18
            19,
            'HOD-COMMENTS19', // Replace EMPLOYEE-ANSWERS19
            20,
            'HOD-COMMENTS20', // Replace EMPLOYEE-ANSWERS20
            21,
            'HOD-COMMENTS21', // Replace EMPLOYEE-ANSWERS21
            22,
            'HOD-COMMENTS22', // Replace EMPLOYEE-ANSWERS22
            4.3,
            'HOD-B' // Replace EMPLOYEE-ANSWERS23
        ];

       
        
        // Define the expected form value with comments and 'B' fields replaced by HOD values.
        const expectedFormValue = [{
            "A1": "EMPLOYEE-ANSWERS1.1",
            "A2_1": "EMPLOYEE-ANSWERS2.1",
            "A2_2": "EMPLOYEE-ANSWERS2.2",
            "A2_3": "EMPLOYEE-ANSWERS2.3",
            "A2_4": "EMPLOYEE-ANSWERS2.4",
            "A2_5": "EMPLOYEE-ANSWERS2.5",
            "A2_6": "EMPLOYEE-ANSWERS2.6",
            "A2_7": "EMPLOYEE-ANSWERS2.7",
            "A2_8": "EMPLOYEE-ANSWERS2.8",
            "A3_1": 3,
            "CommentsA3_1": "HOD-COMMENTS3", // Replaced
            "A3_2": 4,
            "CommentsA3_2": "HOD-COMMENTS4", // Replaced
            "A3_3": 5,
            "CommentsA3_3": "HOD-COMMENTS5", // Replaced
            "A3_4": 6,
            "CommentsA3_4": "HOD-COMMENTS6", // Replaced
            "A3_5": 7,
            "CommentsA3_5": "HOD-COMMENTS7", // Replaced
            "A3_6": 8,
            "CommentsA3_6": "HOD-COMMENTS8", // Replaced
            "A3_7": 9,
            "CommentsA3_7": "HOD-COMMENTS9", // Replaced
            "A3_8": 10,
            "CommentsA3_8": "HOD-COMMENTS10", // Replaced
            "A3_9": 11,
            "CommentsA3_9": "HOD-COMMENTS11", // Replaced
            "A3_10": 12,
            "CommentsA3_10": "HOD-COMMENTS12", // Replaced
            "A3_11": 13,
            "CommentsA3_11": "HOD-COMMENTS13", // Replaced
            "A3_12": 14,
            "CommentsA3_12": "HOD-COMMENTS14", // Replaced
            "A3_13": 15,
            "CommentsA3_13": "HOD-COMMENTS15", // Replaced
            "A3_14": 16,
            "CommentsA3_14": "HOD-COMMENTS16", // Replaced
            "A3_15": 17,
            "CommentsA3_15": "HOD-COMMENTS17", // Replaced
            "A3_16": 18,
            "CommentsA3_16": "HOD-COMMENTS18", // Replaced
            "A3_17": 19,
            "CommentsA3_17": "HOD-COMMENTS19", // Replaced
            "A3_18": 20,
            "CommentsA3_18": "HOD-COMMENTS20", // Replaced
            "A3_19": 21,
            "CommentsA3_19": "HOD-COMMENTS21", // Replaced
            "A3_20": 22,
            "CommentsA3_20": "HOD-COMMENTS22", // Replaced
            "overallRating": 4.3,
            "B": "HOD-B" // Replaced
        }];

        const expectedMonth = new Date().getMonth() + 1;
        const expectedYear = new Date().getFullYear();
        
        await appraisalFormModel.updateForm(formID, formfields, true);

        const [formValue] = await db.pool.query(`
            SELECT A1, A2_1, A2_2, A2_3, A2_4, A2_5, A2_6, A2_7, A2_8, A3_1, CommentsA3_1, A3_2, CommentsA3_2, A3_3, CommentsA3_3, A3_4, CommentsA3_4, A3_5, CommentsA3_5, A3_6, CommentsA3_6, A3_7, CommentsA3_7, A3_8, CommentsA3_8, A3_9, CommentsA3_9, A3_10, CommentsA3_10, A3_11, CommentsA3_11, A3_12, CommentsA3_12, A3_13, CommentsA3_13, A3_14, CommentsA3_14, A3_15, CommentsA3_15, A3_16, CommentsA3_16, A3_17, CommentsA3_17, A3_18, CommentsA3_18, A3_19, CommentsA3_19, A3_20, CommentsA3_20, overallRating, B 
            FROM appraisalform WHERE formID = ?
        `, [formID]);
        
        const [returnedLastUpdated] = await db.pool.query(`SELECT lastUpdated FROM appraisalform WHERE formID = ?`, [formID]);
        const month = returnedLastUpdated[0].lastUpdated.getMonth() + 1;
        const year = returnedLastUpdated[0].lastUpdated.getFullYear();

        expect(formValue).toEqual(expectedFormValue);
        expect(month).toEqual(expectedMonth);
        expect(year).toEqual(expectedYear);
    });

})

describe("appraisalFormModel retrieval unit tests", () => {

    test ("Testing: employeeStatus(employeeID)", async () => {
        const employeeID = 'E001';

        //ADJUST MONTH AND DATE ACCORDINGLY! due date is always one month from now.
        const expectedDueDatemonth = 9;
        const expectedDueDateyear = 2024;
        
        const expectedFormID = 1;
        const expectedStatusEmployee = 0;
        const expectedAppraisalType = 'Confirmation';

        const [value] = await appraisalFormModel.employeeStatus(employeeID);
        const dueDate = value.dueDate;

        expect(expectedDueDatemonth).toEqual(dueDate.getMonth() + 1);
        expect(expectedDueDateyear).toEqual(dueDate.getFullYear());
        expect(expectedFormID).toEqual(value.formID);
        expect(expectedStatusEmployee).toEqual(value.statusEmployee);
        expect(expectedAppraisalType).toEqual(value.appraisalType);
    });

    test ("Testing: retrieveForm(formID)", async () => {
        const formID = 1;

        const expectedReturn = {
            "A1": "EMPLOYEE-ANSWERS1.1",
            "A2_1": "EMPLOYEE-ANSWERS2.1",
            "A2_2": "EMPLOYEE-ANSWERS2.2",
            "A2_3": "EMPLOYEE-ANSWERS2.3",
            "A2_4": "EMPLOYEE-ANSWERS2.4",
            "A2_5": "EMPLOYEE-ANSWERS2.5",
            "A2_6": "EMPLOYEE-ANSWERS2.6",
            "A2_7": "EMPLOYEE-ANSWERS2.7",
            "A2_8": "EMPLOYEE-ANSWERS2.8",
            "A3_1": 3,
            "A3_10": 12,
            "A3_11": 13,
            "A3_12": 14,
            "A3_13": 15,
            "A3_14": 16,
            "A3_15": 17,
            "A3_16": 18,
            "A3_17": 19,
            "A3_18": 20,
            "A3_19": 21,
            "A3_2": 4,
            "A3_20": 22,
            "A3_3": 5,
            "A3_4": 6,
            "A3_5": 7,
            "A3_6": 8,
            "A3_7": 9,
            "A3_8": 10,
            "A3_9": 11,
            "B": "HOD-B", // Updated from "EMPLOYEE-ANSWERS23"
            "CommentsA3_1": "HOD-COMMENTS3", // Updated from "EMPLOYEE-ANSWERS3"
            "CommentsA3_10": "HOD-COMMENTS12", // Updated from "EMPLOYEE-ANSWERS12"
            "CommentsA3_11": "HOD-COMMENTS13", // Updated from "EMPLOYEE-ANSWERS13"
            "CommentsA3_12": "HOD-COMMENTS14", // Updated from "EMPLOYEE-ANSWERS14"
            "CommentsA3_13": "HOD-COMMENTS15", // Updated from "EMPLOYEE-ANSWERS15"
            "CommentsA3_14": "HOD-COMMENTS16", // Updated from "EMPLOYEE-ANSWERS16"
            "CommentsA3_15": "HOD-COMMENTS17", // Updated from "EMPLOYEE-ANSWERS17"
            "CommentsA3_16": "HOD-COMMENTS18", // Updated from "EMPLOYEE-ANSWERS18"
            "CommentsA3_17": "HOD-COMMENTS19", // Updated from "EMPLOYEE-ANSWERS19"
            "CommentsA3_18": "HOD-COMMENTS20", // Updated from "EMPLOYEE-ANSWERS20"
            "CommentsA3_19": "HOD-COMMENTS21", // Updated from "EMPLOYEE-ANSWERS21"
            "CommentsA3_2": "HOD-COMMENTS4", // Updated from "EMPLOYEE-ANSWERS4"
            "CommentsA3_20": "HOD-COMMENTS22", // Updated from "EMPLOYEE-ANSWERS22"
            "CommentsA3_3": "HOD-COMMENTS5", // Updated from "EMPLOYEE-ANSWERS5"
            "CommentsA3_4": "HOD-COMMENTS6", // Updated from "EMPLOYEE-ANSWERS6"
            "CommentsA3_5": "HOD-COMMENTS7", // Updated from "EMPLOYEE-ANSWERS7"
            "CommentsA3_6": "HOD-COMMENTS8", // Updated from "EMPLOYEE-ANSWERS8"
            "CommentsA3_7": "HOD-COMMENTS9", // Updated from "EMPLOYEE-ANSWERS9"
            "CommentsA3_8": "HOD-COMMENTS10", // Updated from "EMPLOYEE-ANSWERS10"
            "CommentsA3_9": "HOD-COMMENTS11", // Updated from "EMPLOYEE-ANSWERS11"
            "appraisalType": "Confirmation",
            "employeeID": "E001",
            "formID": 1,
            "hodID": "M001",
            "overallRating": 4.3,
            "statusEmployee": 0,
            "statusHOD": 0 
          };        
        // [1,'E001', 'M001', true, true, 'confirmation', new Date('2023-10-01'), new Date('2023-10-01'), new Date('2023-04-06'), 'EMPLOYEE-ANSWERS1.1', 'EMPLOYEE-ANSWERS2.1', 'EMPLOYEE-ANSWERS2.2', 'EMPLOYEE-ANSWERS2.3', 'EMPLOYEE-ANSWERS2.4', 'EMPLOYEE-ANSWERS2.5', 'EMPLOYEE-ANSWERS2.6', 'EMPLOYEE-ANSWERS2.7', 'EMPLOYEE-ANSWERS2.8', 3, 'EMPLOYEE-ANSWERS3', 4, 'EMPLOYEE-ANSWERS4', 5, 'EMPLOYEE-ANSWERS5', 6, 'EMPLOYEE-ANSWERS6', 7, 'EMPLOYEE-ANSWERS7', 8, 'EMPLOYEE-ANSWERS8', 9, 'EMPLOYEE-ANSWERS9', 10, 'EMPLOYEE-ANSWERS10', 11, 'EMPLOYEE-ANSWERS11', 12, 'EMPLOYEE-ANSWERS12', 13, 'EMPLOYEE-ANSWERS13', 14, 'EMPLOYEE-ANSWERS14', 15, 'EMPLOYEE-ANSWERS15', 16, 'EMPLOYEE-ANSWERS16', 17, 'EMPLOYEE-ANSWERS17', 18, 'EMPLOYEE-ANSWERS18', 19, 'EMPLOYEE-ANSWERS19', 20, 'EMPLOYEE-ANSWERS20', 21, 'EMPLOYEE-ANSWERS21', 22, 'EMPLOYEE-ANSWERS22', 4.3, 'EMPLOYEE-ANSWERS23'];
        const [value] = await appraisalFormModel.retrieveForm(formID);
        
        //taking out the dates data:
        const dueDate = value.dueDate;
        const lastUpdated = value.lastUpdated;
        const dateCreated = value.dateCreated;

        // delete key from the object value.
        let removeDateVars = ['dueDate', 'lastUpdated', 'dateCreated'];
        removeDateVars.forEach(key => {
            delete value[key];
          });

        expect(value).toEqual(expectedReturn);

        expect(dueDate.getFullYear()).toEqual(2024);
        expect(dueDate.getMonth() + 1).toEqual(9);

        expect(lastUpdated.getFullYear()).toEqual(2024);
        expect(lastUpdated.getMonth() + 1).toEqual(8);

        expect(dateCreated.getFullYear()).toEqual(2024);
        expect(dateCreated.getMonth() + 1).toEqual(8);
    });


    test ("Testing: appraisalFormModel.hodStatus(hodID)", async () => {
        const hodID = 'M001';

        const expectedReturn = {
            "appraisalType": "Confirmation",
            "employeeID": "E001",
            "formID": 1,
            "statusEmployee": 0,
            "statusHOD": 0,
        };

        const [value] = await appraisalFormModel.hodStatus(hodID);
        const dueDate = value.dueDate;
        delete value['dueDate'];

        expect(value).toEqual(expectedReturn);
        expect(dueDate.getFullYear()).toEqual(2024);
        expect(dueDate.getMonth() + 1).toEqual(9);

    });


    test ("Testing: appraisalFormModel.hrStatus()", async () => {
        const expectedReturn = {
            "appraisalType": "Confirmation",
            "employeeID": "E001",
            "formID": 1,
            "hodID": "M001",
            "statusEmployee": 0,
            "statusHOD": 0,
        };
        
        const [value] = await appraisalFormModel.hrStatus();
        const dueDate = value.dueDate;
        delete value['dueDate'];

        expect(value).toEqual(expectedReturn);
        expect(dueDate.getFullYear()).toEqual(2024);
        expect(dueDate.getMonth() + 1).toEqual(9);
    });
    
    test ("Testing: retrieval of empty list when invalid IDs are given", async () => {
        const invalidIDs = 12313;
        
        const employeeStatus = await appraisalFormModel.employeeStatus(invalidIDs);
        const hodStatus = await appraisalFormModel.hodStatus(invalidIDs);
        const retrieveForm = await appraisalFormModel.retrieveForm(invalidIDs);

        expect(employeeStatus).toEqual([]);
        expect(hodStatus).toEqual([]);
        expect(retrieveForm).toEqual([]);

        
    });

})


describe("routes.appraisalform endpoint integration tests", () => {
    test ("testing /form/employee/submit for saving the form", async () => {
        const formID = 1;
        const saveStatus = true;
        const formfields = [
            'EMPLOYEE-ANSWERS1.1',
            'EMPLOYEE-ANSWERS2.1',
            'EMPLOYEE-ANSWERS2.2',
            'EMPLOYEE-ANSWERS2.3',
            'EMPLOYEE-ANSWERS2.4',
            'EMPLOYEE-ANSWERS2.5',
            'EMPLOYEE-ANSWERS2.6',
            'EMPLOYEE-ANSWERS2.7',
            'EMPLOYEE-ANSWERS2.8',
            3,
            'EMPLOYEE-ANSWERS3',
            4,
            'EMPLOYEE-ANSWERS4',
            5,
            'EMPLOYEE-ANSWERS5',
            6,
            'EMPLOYEE-ANSWERS6',
            7,
            'EMPLOYEE-ANSWERS7',
            8,
            'EMPLOYEE-ANSWERS8',
            9,
            'EMPLOYEE-ANSWERS9',
            10,
            'EMPLOYEE-ANSWERS10',
            11,
            'EMPLOYEE-ANSWERS11',
            12,
            'EMPLOYEE-ANSWERS12',
            13,
            'EMPLOYEE-ANSWERS13',
            14,
            'EMPLOYEE-ANSWERS14',
            15,
            'EMPLOYEE-ANSWERS15',
            16,
            'EMPLOYEE-ANSWERS16',
            17,
            'EMPLOYEE-ANSWERS17',
            18,
            'EMPLOYEE-ANSWERS18',
            19,
            'EMPLOYEE-ANSWERS19',
            20,
            'EMPLOYEE-ANSWERS20',
            21,
            'EMPLOYEE-ANSWERS21',
            22,
            'EMPLOYEE-ANSWERS22',
            4.3,
            'EMPLOYEE-ANSWERS23'
        ]; 

        const requestBody = [formID, ...formfields];
        
        const res = await request(app)
            .post('/form/employee/submit')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        // check the status code
        expect(res.statusCode).toBe(200);

        const json = JSON.parse(res.text);
        const expected = [true];
        expect(json).toEqual(expected);
    });


    test ("testing /form/employee/submit for submitting the form", async () => {
        const formID = 1;
        const saveStatus = false;
        const formfields = [
            'EMPLOYEE-ANSWERS1.1',
            'EMPLOYEE-ANSWERS2.1',
            'EMPLOYEE-ANSWERS2.2',
            'EMPLOYEE-ANSWERS2.3',
            'EMPLOYEE-ANSWERS2.4',
            'EMPLOYEE-ANSWERS2.5',
            'EMPLOYEE-ANSWERS2.6',
            'EMPLOYEE-ANSWERS2.7',
            'EMPLOYEE-ANSWERS2.8',
            3,
            'EMPLOYEE-ANSWERS3',
            4,
            'EMPLOYEE-ANSWERS4',
            5,
            'EMPLOYEE-ANSWERS5',
            6,
            'EMPLOYEE-ANSWERS6',
            7,
            'EMPLOYEE-ANSWERS7',
            8,
            'EMPLOYEE-ANSWERS8',
            9,
            'EMPLOYEE-ANSWERS9',
            10,
            'EMPLOYEE-ANSWERS10',
            11,
            'EMPLOYEE-ANSWERS11',
            12,
            'EMPLOYEE-ANSWERS12',
            13,
            'EMPLOYEE-ANSWERS13',
            14,
            'EMPLOYEE-ANSWERS14',
            15,
            'EMPLOYEE-ANSWERS15',
            16,
            'EMPLOYEE-ANSWERS16',
            17,
            'EMPLOYEE-ANSWERS17',
            18,
            'EMPLOYEE-ANSWERS18',
            19,
            'EMPLOYEE-ANSWERS19',
            20,
            'EMPLOYEE-ANSWERS20',
            21,
            'EMPLOYEE-ANSWERS21',
            22,
            'EMPLOYEE-ANSWERS22',
            4.3,
            'EMPLOYEE-ANSWERS23'
        ]; 

        const requestBody = [formID, ...formfields];
        
        const res = await request(app)
            .post('/form/employee/submit')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        // check the status code
        expect(res.statusCode).toBe(200);

        const json = JSON.parse(res.text);
        const expected = [true];
        expect(json).toEqual(expected);
    });

    test("testing /form/hod/submit for saving the form", async () => {
        const formID = 1;
        const saveStatus = true;
        // const statusHOD = true;
        const formFields = [
            'EMPLOYEE-ANSWERS1.1',
            'EMPLOYEE-ANSWERS2.1',
            'EMPLOYEE-ANSWERS2.2',
            'EMPLOYEE-ANSWERS2.3',
            'EMPLOYEE-ANSWERS2.4',
            'EMPLOYEE-ANSWERS2.5',
            'EMPLOYEE-ANSWERS2.6',
            'EMPLOYEE-ANSWERS2.7',
            'EMPLOYEE-ANSWERS2.8',
            3,
            'HOD-COMMENTS3', // Replace EMPLOYEE-ANSWERS3
            4,
            'HOD-COMMENTS4', // Replace EMPLOYEE-ANSWERS4
            5,
            'HOD-COMMENTS5', // Replace EMPLOYEE-ANSWERS5
            6,
            'HOD-COMMENTS6', // Replace EMPLOYEE-ANSWERS6
            7,
            'HOD-COMMENTS7', // Replace EMPLOYEE-ANSWERS7
            8,
            'HOD-COMMENTS8', // Replace EMPLOYEE-ANSWERS8
            9,
            'HOD-COMMENTS9', // Replace EMPLOYEE-ANSWERS9
            10,
            'HOD-COMMENTS10', // Replace EMPLOYEE-ANSWERS10
            11,
            'HOD-COMMENTS11', // Replace EMPLOYEE-ANSWERS11
            12,
            'HOD-COMMENTS12', // Replace EMPLOYEE-ANSWERS12
            13,
            'HOD-COMMENTS13', // Replace EMPLOYEE-ANSWERS13
            14,
            'HOD-COMMENTS14', // Replace EMPLOYEE-ANSWERS14
            15,
            'HOD-COMMENTS15', // Replace EMPLOYEE-ANSWERS15
            16,
            'HOD-COMMENTS16', // Replace EMPLOYEE-ANSWERS16
            17,
            'HOD-COMMENTS17', // Replace EMPLOYEE-ANSWERS17
            18,
            'HOD-COMMENTS18', // Replace EMPLOYEE-ANSWERS18
            19,
            'HOD-COMMENTS19', // Replace EMPLOYEE-ANSWERS19
            20,
            'HOD-COMMENTS20', // Replace EMPLOYEE-ANSWERS20
            21,
            'HOD-COMMENTS21', // Replace EMPLOYEE-ANSWERS21
            22,
            'HOD-COMMENTS22', // Replace EMPLOYEE-ANSWERS22
            4.3,
            'HOD-B' // Replace EMPLOYEE-ANSWERS23 
        ];

        const requestBody = [formID, ...formFields];
        const res = await request(app)
            .post("/form/hod/submit")
            .send(requestBody)
            .set('Content-Type', 'application/json'); // Ensure JSON format

        // check the status code
        expect(res.statusCode).toBe(200);
        
        const json = JSON.parse(res.text);
        const expected = [true];
        expect(json).toEqual(expected);
    });


    test("testing /form/hod/submit for submitting the form", async () => {
        const formID = 1;
        const saveStatus = false;
        // const statusHOD = true;
        const formFields = [
            'EMPLOYEE-ANSWERS1.1',
            'EMPLOYEE-ANSWERS2.1',
            'EMPLOYEE-ANSWERS2.2',
            'EMPLOYEE-ANSWERS2.3',
            'EMPLOYEE-ANSWERS2.4',
            'EMPLOYEE-ANSWERS2.5',
            'EMPLOYEE-ANSWERS2.6',
            'EMPLOYEE-ANSWERS2.7',
            'EMPLOYEE-ANSWERS2.8',
            3,
            'HOD-COMMENTS3', // Replace EMPLOYEE-ANSWERS3
            4,
            'HOD-COMMENTS4', // Replace EMPLOYEE-ANSWERS4
            5,
            'HOD-COMMENTS5', // Replace EMPLOYEE-ANSWERS5
            6,
            'HOD-COMMENTS6', // Replace EMPLOYEE-ANSWERS6
            7,
            'HOD-COMMENTS7', // Replace EMPLOYEE-ANSWERS7
            8,
            'HOD-COMMENTS8', // Replace EMPLOYEE-ANSWERS8
            9,
            'HOD-COMMENTS9', // Replace EMPLOYEE-ANSWERS9
            10,
            'HOD-COMMENTS10', // Replace EMPLOYEE-ANSWERS10
            11,
            'HOD-COMMENTS11', // Replace EMPLOYEE-ANSWERS11
            12,
            'HOD-COMMENTS12', // Replace EMPLOYEE-ANSWERS12
            13,
            'HOD-COMMENTS13', // Replace EMPLOYEE-ANSWERS13
            14,
            'HOD-COMMENTS14', // Replace EMPLOYEE-ANSWERS14
            15,
            'HOD-COMMENTS15', // Replace EMPLOYEE-ANSWERS15
            16,
            'HOD-COMMENTS16', // Replace EMPLOYEE-ANSWERS16
            17,
            'HOD-COMMENTS17', // Replace EMPLOYEE-ANSWERS17
            18,
            'HOD-COMMENTS18', // Replace EMPLOYEE-ANSWERS18
            19,
            'HOD-COMMENTS19', // Replace EMPLOYEE-ANSWERS19
            20,
            'HOD-COMMENTS20', // Replace EMPLOYEE-ANSWERS20
            21,
            'HOD-COMMENTS21', // Replace EMPLOYEE-ANSWERS21
            22,
            'HOD-COMMENTS22', // Replace EMPLOYEE-ANSWERS22
            4.3,
            'HOD-B' // Replace EMPLOYEE-ANSWERS23 
        ];

        const requestBody = [formID, ...formFields];
        const res = await request(app)
            .post("/form/hod/submit")
            .send(requestBody)
            .set('Content-Type', 'application/json'); // Ensure JSON format

        // check the status code
        expect(res.statusCode).toBe(200);
        
        const json = JSON.parse(res.text);
        const expected = [true];
        expect(json).toEqual(expected);
    });

    test ("testing /form/employee/status", async () => {
        const requestbody = {employeeID: 'E001'};

        // Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/form/employee/status')
            .send(requestbody) // Send employeeID in request body
            .set('Content-Type', 'application/json'); // Ensure JSON format

        // check the status code
        expect(res.statusCode).toBe(200);

        const expected = {
            formID: 1,
            statusEmployee: 0,
            appraisalType: "Confirmation",
            dueDate: expect.any(String) // Assuming dueDate is in ISO string format
        };
    
        const json = JSON.parse(res.text);
        expect(json).toMatchObject(expected);
    });

test ("testing /form/hod/status", async () => {
        const requestbody = {hodID: 'M001'};

        // Sending POST request with hodID as payload
        const res = await request(app)
            .post('/form/hod/status')
            .send(requestbody) // Send hodID in request body
            .set('Content-Type', 'application/json'); // Ensure JSON format

        
        expect(res.statusCode).toBe(200);

        // formID, employeeID, statusEmployee, statusHOD, appraisalType, dueDate 
        const expected = {
            formID: 1,
            employeeID: 'E001',
            statusEmployee: 0,
            statusHOD: 0,
            appraisalType: "Confirmation",
            dueDate: expect.any(String)
        };

        const json = JSON.parse(res.text);
        expect(json).toMatchObject(expected);
    });

    test ("testing /form/HR/status", async () => {
        const res = await request(app)
        .get('/form/HR/status')
        .set('Content-Type', 'application/json'); // Ensure JSON format

    // Check the status code
    expect(res.statusCode).toBe(200);

    const expected = {
        formID: expect.any(Number),
        employeeID: expect.any(String),
        hodID: expect.any(String),
        statusEmployee: 0,
        statusHOD: 0,
        appraisalType: expect.any(String),
        dueDate: expect.any(String) // Assuming dueDate is a string (ISO format)
    };

    const json = JSON.parse(res.text);
    expect(json).toMatchObject(expected);
    });

    afterAll(async () => {
        await teardown();
        await db.pool.end();
    });
})
