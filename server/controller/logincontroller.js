const db = require('../models/db');
const testhod = require('../models/hod'); //test hod
const testhr = require('../models/hr'); //test hr
const testemployee = require('../models/employee'); //test employee
const testform = require('../models/appraisalform'); //test appraisalform

//to render the login page
exports.renderLogin = (req, res) => {
    res.render('login', { title: 'LoginPage', alerMessage: '' });
};

exports.renderHome = (req, res) => {
    if (req.session.loggedin) {
        // res.send('Welcome back, ' + req.session.username + '!');
		//check if username is hod or employee, and render the relevant pages
        if (req.session.username=="testhod") {
            const hodName = req.session.username;
            res.render('hodhome', {title: "Welcome HOD", hodName});
        }else {
            const employeeName = req.session.username;
            res.render('employeehome', {title: "Welcome Employee", employeeName});
        }
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
};
/*
Under employee: findByAppraisalDateDue() and updateNextAppraisalDate() checked by systemclock calls
Under appraisalform: createEntry() checked by systemclock calls
*/
/* TEST:login */
exports.authenticateUser = async (req, res) => {
	console.log("test1 here");
    try {
        const { staffID, password } = req.body;
        let result;
        if (staffID[0]==="E"){
            result = await testemployee.login(staffID, password);
        } else if (staffID[0]==="M"){
            result = await testhod.login(staffID, password);
        } else {
            result = await testhr.login(staffID, password);
        }
        console.log("LOGINCONTROLLER:",result);
        res.json(result);
        /*
        output success:
        
            [ { employeeName: 'Shev Curry', role: 'staff' } ]
        
        
        output fail:
        { valid_user: false, user: null }
        */
    } catch (error){
        console.error(error);
    }
}

/* TEST: employee.findRecordsByID */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         const result = await testemployee.findRecordsByID(username); 
//         console.log(result);
//         /*
//         output success:
//         [{
//             jobFunction: 'job3',
//             KPI: 'KPI3',
//             disciplinaryRecord: 'disR3',
//             attendanceRecord: 'atR3'
//         }]
        
//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: employee.hrStatus */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         const result = await testemployee.hrStatus(username); 
//         console.log(result);
//         /*
//         output success:
//         [{ employeeName: 'Shev Curry', department: 'Manufacturing' } ]
        
//         output fail:
//          []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: appraisalform.employeeStatus */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         const result = await testform.employeeStatus(username);
//         console.log(result);
//         res.json(result);
//         /*
//         output success:
//         [{
//             formID: 14,
//             statusEmployee: 0,
//             appraisalType: 'Comfirmation',
//             dueDate: 2024-08-02T16:00:00.000Z
//         }]
//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: appraisalform.retrieveForm */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         console.log(username);
//         const result = await testform.retrieveForm(username);
//         console.log(result);
//         // res.json(result);
//         /*
//         output success:
//             [
//             {
//                 formID: 14,
//                 employeeID: 'E006',
//                 hodID: 'M002',
//                 statusEmployee: 0,
//                 statusHOD: 0,
//                 appraisalType: 'Comfirmation',
//                 overallRating: null,
//                 dateCreated: 2024-07-19T16:00:00.000Z,
//                 lastUpdated: 2024-07-19T16:00:00.000Z,
//                 dueDate: 2024-08-02T16:00:00.000Z,
//                 A1: null,
//                 A2_1: null,
//                 A2_2: null,
//                 A2_3: null,
//                 A2_4: null,
//                 A2_5: null,
//                 A2_6: null,
//                 A2_7: null,
//                 A2_8: null,
//                 A3_1: null,
//                 CommentsA3_1: null,
//                 A3_2: null,
//                 CommentsA3_2: null,
//                 A3_3: null,
//                 CommentsA3_3: null,
//                 A3_4: null,
//                 CommentsA3_4: null,
//                 A3_5: null,
//                 CommentsA3_5: null,
//                 A3_6: null,
//                 CommentsA3_6: null,
//                 A3_7: null,
//                 CommentsA3_7: null,
//                 A3_8: null,
//                 CommentsA3_8: null,
//                 A3_9: null,
//                 CommentsA3_9: null,
//                 A3_10: null,
//                 CommentsA3_10: null,
//                 A3_11: null,
//                 CommentsA3_11: null,
//                 A3_12: null,
//                 CommentsA3_12: null,
//                 A3_13: null,
//                 CommentsA3_13: null,
//                 A3_14: null,
//                 CommentsA3_14: null,
//                 A3_15: null,
//                 CommentsA3_15: null,
//                 A3_16: null,
//                 CommentsA3_16: null,
//                 A3_17: null,
//                 CommentsA3_17: null,
//                 A3_18: null,
//                 CommentsA3_18: null,
//                 A3_19: null,
//                 CommentsA3_19: null,
//                 A3_20: null,
//                 CommentsA3_20: null,
//                 B: null
//             }
//             ]
//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: appraisalform.hodStatus */
/**************************************************************************************************** Accepts 14fsdfds*/
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         console.log(username);
//         const result = await testform.hodStatus(username);
//         console.log(result);
//         // res.json(result);
//         /*
//         output success:
//             [
//                 {
//                     formID: 9,
//                     employeeID: 'E005',
//                     statusEmployee: 1,
//                     statusHOD: 1,
//                     appraisalType: null,
//                     dueDate: null
//                 },
//                 {
//                     formID: 10,
//                     employeeID: 'E005',
//                     statusEmployee: 1,
//                     statusHOD: 1,
//                     appraisalType: null,
//                     dueDate: null
//                 }
//             ]
//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: appraisalform.hrStatus */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         const { username, password } = req.body;
//         console.log(username);
//         const result = await testform.hrStatus();
//         console.log(result);
//         // res.json(result);
//         /*
//         output success:
//             [
//             {
//                 formID: 8,
//                 employeeID: 'E004',
//                 hodID: 'M001',
//                 statusEmployee: 1,
//                 statusHOD: 0,
//                 appraisalType: null,
//                 dueDate: null
//             },
//             {
//                 formID: 9,
//                 employeeID: 'E005',
//                 hodID: 'M004',
//                 statusEmployee: 1,
//                 statusHOD: 1,
//                 appraisalType: null,
//                 dueDate: null
//             },
//             {
//                 formID: 10,
//                 employeeID: 'E005',
//                 hodID: 'M004',
//                 statusEmployee: 1,
//                 statusHOD: 1,
//                 appraisalType: null,
//                 dueDate: null
//             },
//             {
//                 formID: 14,
//                 employeeID: 'E006',
//                 hodID: 'M002',
//                 statusEmployee: 0,
//                 statusHOD: 0,
//                 appraisalType: 'Comfirmation',
//                 dueDate: 2024-08-02T16:00:00.000Z
//             }
//             ]
//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }

/*TEST: appraisalform.updateForm */
//************************************************************************************************* */
// exports.authenticateUser = async (req, res) => {
// 	console.log("test1 here");
//     try {
//         let new_list = Array(51).fill(0);
//         const { username, password } = req.body;
//         console.log(username);
//         const result = await testform.updateForm(username, new_list);
//         console.log(result);
//         // res.json(result);
//         /*
//         output success:

//         output fail:
//             []
//         */
//     } catch (error){
//         console.error(error);
//     }
// }
