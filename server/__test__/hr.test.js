const hrModel = require('../models/hr.js');
const db = require('../models/db.js');
const request = require('supertest')
const app = require('../app');
const tablename = 'hr';

async function setup() {    
    // Assuming 'db' is your database connection and 'tablename' is the name of your original table
    const backupTableName = `${tablename}_backup`;
    try {
        // Create a backup of the original table
        await db.pool.query(`CREATE TABLE ${backupTableName} LIKE ${tablename};`);
        // Copy the contents of the original table to the backup table
        await db.pool.query(`INSERT INTO ${backupTableName} SELECT * FROM ${tablename};`);
        // Insert test data into the original table
        await db.pool.query(`
            INSERT IGNORE INTO ${tablename} VALUES 
            ('H001', 'hodpass123', 'Michael Scott', 'michael.scott@dundermifflin.com', 'HR'),
            ('H002', 'hodpass456', 'Pam Beesly', 'pam.beesly@dundermifflin.com', 'HR'),
            ('H003', 'hodpass789', 'Jim Halpert', 'jim.halpert@dundermifflin.com', 'HR'),
            ('H004', 'hodpass321', 'Dwight Schrute', 'dwight.schrute@dundermifflin.com', 'HR');
        `);
    } catch (error) {
        console.error("Setup failed: " + error);
        throw error;
    }
}

async function teardown() {
    const backupTableName = `${tablename}_backup`;
    try {
        // Delete the original table
        await db.pool.query(`DROP TABLE ${tablename};`);
        // Rename the backup table to the original table's name
        await db.pool.query(`RENAME TABLE ${backupTableName} TO ${tablename};`);
    } catch (error) {
        console.error("Teardown failed: " + error);
        throw error;
    }
}

describe("hrModel: login unit testing", () => {
    beforeAll( async() => {
        await setup();
    });

    test ("Testing: valid login", async() => {
        const expectedValue ={
                 "hrName": "Pam Beesly",
                 "role": "HR",
               };
        const [value] = await hrModel.login("H002", "hodpass456");

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: wrong username for login", async() => {
        const [value] = await hrModel.login("asdfasd", "hodpass456");

        expect(value).toEqual(1);   
    });

    test ("Testing: wrong password for login", async() => {
        const [value] = await hrModel.login("H002", "2342");

        expect(value).toEqual(2);   
    });


    afterAll( async() => {
        await teardown();
    }); 
});

describe("HR routes integration testing", () => {
    beforeAll(async () => {
        await setup();
    });

    test("/hr/login for valid users", async () => {

        const requestBody = {hrID : 'H001', hrPassword: 'hodpass123'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/hr/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = {"hrName": "Michael Scott", "role": "HR"};

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/hr/login, wrong password", async () => {

        const requestBody = {hrID : 'H001', hrPassword: 'hodpass1233'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/hr/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = 2;

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/hr/login, wrong ID", async () => {

        const requestBody = {hrID : 'H002234', hrPassword: 'hodpass123'};
        //Sending POST request with hrID as payload
        const res = await request(app)
            .post('/hr/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = 1;

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 

    afterAll(async () => {
        await teardown();
        await db.pool.end();
    });
}); 