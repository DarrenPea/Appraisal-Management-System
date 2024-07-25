const serverClock = require('../tasks/server_clock.js');
const db = require('../models/db.js');
const request = require('supertest')
const app = require('../app');
const employeeTable = 'employees';
const formTable = 'appraisalform';

async function setup() {    
    // Assuming 'db' is your database connection and 'tablename' is the name of your original table
    const employeeBackup = `${employeeTable}_backup`;
    const formBackup = `${formTable}_backup`;

    try {
        // Create a backup of the original table
        await db.pool.query(`CREATE TABLE ${employeeBackup} LIKE ${employeeTable};`);
        await db.pool.query(`CREATE TABLE ${formBackup} LIKE ${formTable};`);
        // Copy the contents of the original table to the backup table
        await db.pool.query(`INSERT INTO ${employeeBackup} SELECT * FROM ${employeeTable};`);
        await db.pool.query(`INSERT INTO ${formBackup} SELECT * FROM ${formTable};`);

        await db.pool.query(`TRUNCATE TABLE ${employeeTable}`);
        await db.pool.query(`TRUNCATE TABLE ${formTable}`);

        // Insert test data into the original table
        await db.pool.query(`
        INSERT INTO ${employeeTable} VALUES
        ('E001', 'password123', 'John Doe', 'john.doe@example.com', '2020-01-10', 'Employee', 'M001', 'IT', 'Ensure servers are up and running', '2024-07-21', 4.50, 'None', 'Excellent'),
        ('E002', 'password456', 'Jane Smith', 'jane.smith@example.com', '2022-12-22', 'Employee', 'M002', 'Management', 'Lead IT team to find and resolve cybersecurity risks', '2024-08-10', 4.00, 'None', 'Good'),
        ('E003', 'password789', 'Alice Johnson', 'alice.johnson@example.com', '2021-03-15', 'Employee', 'M001', 'IT', 'Ensure servers are up and running', '2024-09-15', 4.75, 'None', 'Excellent'),
        ('E004', 'password321', 'Bob Brown', 'bob.brown@example.com', '2024-04-05', 'Employee', 'M003', 'Sales', 'Manage client relations and sales targets', '2024-10-01', 3.80, 'Minor', 'Satisfactory'); 
        `);
        
    } catch (error) {
        console.error("Setup failed: " + error);
        throw error;
    }
}

async function teardown() {
    const employeeBackup = `${employeeTable}_backup`;
    const formBackup = `${formTable}_backup`;
    try {
        // Delete the original table
        await db.pool.query(`DROP TABLE ${formTable};`);
        await db.pool.query(`DROP TABLE ${employeeTable};`);


        // Rename the backup table to the original table's name
        await db.pool.query(`RENAME TABLE ${employeeBackup} TO ${employeeTable};`);
        await db.pool.query(`RENAME TABLE ${formBackup} TO ${formTable};`);

        await db.pool.end();

    } catch (error) {
        console.error("Teardown failed: " + error);
        throw error;
    }
}

describe("testing for system clock's scheduling", () => {
    beforeAll( async() => {
        await setup();
    });

    test ("Testing: checkForAppraisal()", async() => {
        await serverClock.checkForAppraisal();

        //testing for createEntry
        const time = new Date();
        time.setHours(0, time.getMinutes(), 0, time.getMilliseconds());

        const expectedReturn = {employeeId : 'E001', hodId : 'M001', statusEmployee : 0, statusHOD : 0};
        const [value] = await db.pool.query(`SELECT employeeId, hodId, statusEmployee, statusHOD FROM ${formTable} WHERE employeeId = 'E001' AND hodId = 'M001'`);
        const [realDateCreated] = await db.pool.query(`SELECT dateCreated FROM ${formTable} WHERE employeeID='E001' and hodID='M001'`)
        
        expect(value[0]).toEqual(expectedReturn);
        expect(time.getMonth() + 1).toEqual(realDateCreated[0].dateCreated.getMonth()+1);
    })


    afterAll( async() => {
        await teardown();
    }); 
    
});