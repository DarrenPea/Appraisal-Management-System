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
}); 

describe("FUZZING TESTS", () => {
    const naughty_list_non_str = [
        [],
        null,
        undefined,
        {},
        [],
        [],
        [null],
        [undefined],
        [{}],
        [""],
        [1],
        [0],
        [true],
        [false],
        true,
        false
    ];

    const naughty_list = [
        "", 
        "undefined", 
        "undef", 
        "null", 
        "NULL", 
        "(null)", 
        "nil", 
        "NIL", 
        "true", 
        "false", 
        "True", 
        "False", 
        "TRUE", 
        "FALSE", 
        "None", 
        "hasOwnProperty", 
        "then", 
        "\\", 
        "\\\\", 
        "0", 
        "1", 
        "1.00", 
        "$1.00", 
        "1/2", 
        "1E2", 
        "1E02", 
        "1E+02", 
        "-1", 
        "-1.00", 
        "-$1.00", 
        "-1/2", 
        "-1E2", 
        "-1E02", 
        "-1E+02"
    ];

    test("Fuzzing login with non strings", async () => {
        for (let i = 0; i < 1500; i++) {
            const randomUsername = naughty_list_non_str[Math.floor(Math.random() * naughty_list_non_str.length)];
            const randomPassword = naughty_list_non_str[Math.floor(Math.random() * naughty_list_non_str.length)];
    
            try {
                // Simulate login attempt
                const result = await hrModel.login(randomUsername, randomPassword);
    
                // Add assertions to check the behavior
                expect(result).toStrictEqual([3]);
            } catch (error) {
                console.error(`Test failed for username: ${randomUsername}, password: ${randomPassword}`);
                throw error; // Re-throw the error to ensure the test fails
            }
        }
    });

    test("Fuzzing login with strings", async () => {
        for (let i = 0; i < 1550; i++) {
            const randomUsername = naughty_list[Math.floor(Math.random() * naughty_list.length)];
            const randomPassword = naughty_list[Math.floor(Math.random() * naughty_list.length)];
    
            try {
                // Simulate login attempt
                const result = await hrModel.login(randomUsername, randomPassword);
    
                // Add assertions to check the behavior
                expect(result).toStrictEqual([1]);
            } catch (error) {
                console.error(`Test failed for username: ${randomUsername}, password: ${randomPassword}`);
                throw error; // Re-throw the error to ensure the test fails
            }
        }
    });

    afterAll(async () => {
        await teardown();
        await db.pool.end();
    });
});