const employeeModel = require('../models/employee.js');
const db = require('../models/db.js');
const request = require('supertest')
const app = require('../app');
const tablename = 'employees';


async function setup() {    
    // Assuming 'db' is your database connection and 'tablename' is the name of your original table
    const employeeBackup = `${tablename}_backup`;

    try {
        // Create a backup of the original table
        await db.pool.query(`CREATE TABLE ${employeeBackup} LIKE ${tablename};`);
        // Copy the contents of the original table to the backup table
        await db.pool.query(`INSERT INTO ${employeeBackup} SELECT * FROM ${tablename};`);

        await db.pool.query(`TRUNCATE TABLE ${tablename}`);

        // Insert test data into the original table
        await db.pool.query(`
            INSERT INTO ${tablename} VALUES 
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
    const employeeBackup = `${tablename}_backup`;
    try {
        // Delete the original table
        await db.pool.query(`DROP TABLE ${tablename};`);

        // Rename the backup table to the original table's name
        await db.pool.query(`RENAME TABLE ${employeeBackup} TO ${tablename};`);

    } catch (error) {
        console.error("Teardown failed: " + error);
        throw error;
    }
}

describe("employeeModel: retrieval unit testing", () => {
    beforeAll( async() => {
        await setup();
    });

    test ("Testing: findRecordsByID(staffID)", async() => {
        const expectedValue ={"KPI": "4.50", "attendanceRecord": "Excellent", "disciplinaryRecord": "None", "jobFunction": "Ensure servers are up and running"};
        const [value] = await employeeModel.findRecordsByID('E001');
        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: findByAppraisalDateDue()", async() => {
        const expectedValue ={"employeeID": "E001", "employeeName": "John Doe", "hodID": "M001"};
        const [value] = await employeeModel.findByAppraisalDateDue();

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: updateNextAppraisalDate(employeeID)", async() => {
        const returnStatus = await employeeModel.updateNextAppraisalDate('E001');

        let newDate;
        try{
            const query = `SELECT nextAppraisalDate FROM ${tablename} WHERE employeeID = 'E001'`;
            [newDate] = await db.pool.query(query)
        }
        catch (error) {
            console.error("Database connection failed. " + error);
            throw error;
        }

        const returnedMonth = newDate[0].nextAppraisalDate.getMonth()+1;
        const returnedYear = newDate[0].nextAppraisalDate.getFullYear();

        expect(returnStatus).toEqual([true]);   
        expect(returnedMonth).toEqual(1);
        expect(returnedYear).toEqual(2025);
    });

    test ("Testing: hrStatus(employeeID)", async() => {
        const expectedValue ={"employeeName": "John Doe", "department": "IT"};
        const [value] = await employeeModel.hrStatus("E001");

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: valid login", async() => {
        const expectedValue ={
                 "employeeName": "John Doe",
                 "role": "Employee",
               };
        const [value] = await employeeModel.login("E001", "password123");

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: wrong username for login", async() => {
        const expectedValue =1;
        const [value] = await employeeModel.login("asdfasd", "password123");

        expect(value).toEqual(expectedValue);   
    });

    test ("Testing: wrong password for login", async() => {
        const expectedValue =2;
        const [value] = await employeeModel.login("E001", "2342");

        expect(value).toEqual(expectedValue);   
    });

    test("/employee/HR/status ---> hrStatus(employeeID)", async () => {
        const requestBody = {'employeeID' : 'E001'};

        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/employee/HR/status')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = {
            "employeeName" : "John Doe",
            "department" : "IT"
        };

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    });

    test("/employee/details ---> hrStatus(employeeID)", async () => {

        const requestBody = {employeeID : 'E001'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/employee/details')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = {
            "KPI": "4.50", 
            "attendanceRecord": "Excellent", 
            "disciplinaryRecord": "None", 
            "jobFunction": "Ensure servers are up and running"
        };

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 

    test("/employee/login for valid users", async () => {

        const requestBody = {employeeID : 'E001', employeePassword: 'password123'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/employee/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = {"employeeName": "John Doe", "role": "Employee"};

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/employee/login, wrong password", async () => {

        const requestBody = {employeeID : 'E001', employeePassword: 'password1233'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/employee/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = 2;

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 
    test("/employee/login, wrong password", async () => {

        const requestBody = {employeeID : 'E0012443', employeePassword: 'password123'};
        //Sending POST request with employeeID as payload
        const res = await request(app)
            .post('/employee/login')
            .send(requestBody) // Send the correct data format
            .set('Content-Type', 'application/json'); // Ensure JSON format

        expect(res.statusCode).toBe(200);

        const expected = 1;

        const json = JSON.parse(res.text);
        expect(json[0]).toEqual(expected);
    }); 

    afterAll( async() => {
        await teardown();
        await db.pool.end();
    }); 
});

// describe("employeeModel: integration testing", () => {
//     beforeAll(async () => {
//         await setup();
//     });

//     test("/employee/HR/status ---> hrStatus(employeeID)", async () => {
//         const requestBody = {'employeeID' : 'E001'};

//         //Sending POST request with employeeID as payload
//         const res = await request(app)
//             .post('/employee/HR/status')
//             .send(requestBody) // Send the correct data format
//             .set('Content-Type', 'application/json'); // Ensure JSON format

//         expect(res.statusCode).toBe(200);

//         const expected = {
//             "employeeName" : "John Doe",
//             "department" : "IT"
//         };

//         const json = JSON.parse(res.text);
//         expect(json[0]).toEqual(expected);
//     });

//     test("/employee/details ---> hrStatus(employeeID)", async () => {

//         const requestBody = {employeeID : 'E001'};
//         //Sending POST request with employeeID as payload
//         const res = await request(app)
//             .post('/employee/details')
//             .send(requestBody) // Send the correct data format
//             .set('Content-Type', 'application/json'); // Ensure JSON format

//         expect(res.statusCode).toBe(200);

//         const expected = {
//             "KPI": "4.50", 
//             "attendanceRecord": "Excellent", 
//             "disciplinaryRecord": "None", 
//             "jobFunction": "Ensure servers are up and running"
//         };

//         const json = JSON.parse(res.text);
//         expect(json[0]).toEqual(expected);
//     }); 

//     test("/employee/login for valid users", async () => {

//         const requestBody = {employeeID : 'E001', employeePassword: 'password123'};
//         //Sending POST request with employeeID as payload
//         const res = await request(app)
//             .post('/employee/login')
//             .send(requestBody) // Send the correct data format
//             .set('Content-Type', 'application/json'); // Ensure JSON format

//         expect(res.statusCode).toBe(200);

//         const expected = {"employeeName": "John Doe", "role": "Employee"};

//         const json = JSON.parse(res.text);
//         expect(json[0]).toEqual(expected);
//     }); 
//     test("/employee/login, wrong password", async () => {

//         const requestBody = {employeeID : 'E001', employeePassword: 'password1233'};
//         //Sending POST request with employeeID as payload
//         const res = await request(app)
//             .post('/employee/login')
//             .send(requestBody) // Send the correct data format
//             .set('Content-Type', 'application/json'); // Ensure JSON format

//         expect(res.statusCode).toBe(200);

//         const expected = 2;

//         const json = JSON.parse(res.text);
//         expect(json[0]).toEqual(expected);
//     }); 
//     test("/employee/login, wrong password", async () => {

//         const requestBody = {employeeID : 'E0012443', employeePassword: 'password123'};
//         //Sending POST request with employeeID as payload
//         const res = await request(app)
//             .post('/employee/login')
//             .send(requestBody) // Send the correct data format
//             .set('Content-Type', 'application/json'); // Ensure JSON format

//         expect(res.statusCode).toBe(200);

//         const expected = 1;

//         const json = JSON.parse(res.text);
//         expect(json[0]).toEqual(expected);
//     }); 

//     afterAll(async () => {
//         await teardown();
//         await db.pool.end();
//     });
// }); 