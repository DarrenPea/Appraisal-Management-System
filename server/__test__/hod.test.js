const hodModel = require('../models/hod.js');
const db = require('../models/db.js');
const request = require('supertest')
const app = require('../app');
const tablename = 'hod';

async function setup() {
    try{
        await db.pool.query(`
            INSERT INTO ${tablename} 
            VALUES 
            ('M001','hodpw123','Tom Tan','tomtan@example.com','Manufacturing','HOD'),
            ('M002','hodpw2','Tom Tanks','tomtanks@example.com','Finance','HOD'),
            ('M003','hodpw3','Leflop James','Leflopjames@example.com','Marketing','HOD'),
            ('M004','hodpw1234','Tim Tang','timtang@example.com','R&D','HOD')
            ON DUPLICATE KEY UPDATE role=role;
            `)

    } catch (error) {
        console.error
        ("setup insert failed. " + error);
        throw error;
    }
}

async function teardown() {
    try {
        // Move data back from 'message_backup' to 'message'

        await db.pool.query(`
            INSERT INTO ${tablename} 
            VALUES 
            ('M001','hodpw123','Tom Tan','tomtan@example.com','Manufacturing','HOD'),
            ('M002','hodpw2','Tom Tanks','tomtanks@example.com','Finance','HOD'),
            ('M003','hodpw3','Leflop James','Leflopjames@example.com','Marketing','HOD'),
            ('M004','hodpw1234','Tim Tang','timtang@example.com','R&D','HOD')
            ON DUPLICATE KEY UPDATE role=role;
            `)
    } catch (error) {
        console.error
        ("teardown failed. " + error);
        throw error;
    }
}

describe("hodModel: login unit testing", () => {
    beforeAll( async() => {
        await setup();
    });

    test ("Testing: valid login", async() => {
        const expectedValue ={
                 "hodName": "Tom Tan",
                 "role": "HOD",
               };
        const [value] = await hodModel.login("M001", "hodpw123");

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: wrong username for login", async() => {
        const [value] = await hodModel.login("asdfasd", "hodpw123");

        expect(value).toEqual(1);   
    });

    test ("Testing: wrong password for login", async() => {
        const [value] = await hodModel.login("M001", "2342");

        expect(value).toEqual(2);   
    });


    afterAll( async() => {
        await teardown();
    }); 
});

describe("hod routes integration testing", () => {
    beforeAll(async () => {
        await setup();
    });

    test("/hod/login for valid users", async () => {

        const requestBody = {hodID : 'M001', hodPassword: 'hodpw123'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/hod/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = {"hodName": "Tom Tan", "role": "HOD"};

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/hod/login, wrong password", async () => {

        const requestBody = {hodID : 'M001', hodPassword: 'hodpw123234'};
        //Sending POST request with hodID as payload
        const res = await request(app)
            .post('/hod/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = 2;

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/hod/login, wrong ID", async () => {

        const requestBody = {hodID : 'M001343', hodPassword: 'hodpw123'};
        //Sending POST request with hodID as payload
        const res = await request(app)
            .post('/hod/login')
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
        for (let i = 0; i < 1550; i++) {
            const randomUsername = naughty_list_non_str[Math.floor(Math.random() * naughty_list_non_str.length)];
            const randomPassword = naughty_list_non_str[Math.floor(Math.random() * naughty_list_non_str.length)];
    
            try {
                // Simulate login attempt
                const result = await hodModel.login(randomUsername, randomPassword);
    
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
                const result = await hodModel.login(randomUsername, randomPassword);
    
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