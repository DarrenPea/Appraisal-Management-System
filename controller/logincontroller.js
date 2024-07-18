const db = require('../models/db');
const testlogin = require('../models/hod')

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

//to authenticate user

// exports.authenticateUser = (req, res) => {
//     const { username, password } = req.body;
//     console.log('Received data:', { username, password });

//     if (username && password) {
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		db.pool.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				req.session.loggedin = true;
// 				req.session.username = username;
// 				// Redirect to home page
// 				res.redirect('/home');
// 			} else {
// 				//display popup message and reload the login page
//                 res.render('login', { title: 'Login Page', alertMessage: 'Incorrect Username and/or Password!' });
// 				// res.send('Incorrect Username and/or Password!');
// 			}			
// 			res.end();
// 		});
// 	} else {
// 		res.send('Please enter Username and Password!');
// 		res.end();
// 	}
// };

//TEST:login
// exports.authenticateUser = (req, res) => {
// 	console.log("testing here");
// 	const { username, password } = req.body;
// 	const tester = testlogin.login(username, password);
// 	res.redirect('/home');
// }

//TEST: get all form details
// exports.authenticateUser = async (req, res) => {
//     console.log("testing2 here");
//     const { username, password } = req.body;

//     try {
//         const tester = await testlogin.retrieve_indivForm(username);
//         console.log(tester);
//         // res.redirect('/home');
//     } catch (error) {
//         console.error('Error retrieving forms:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };



//to direct to diff home page for employee and hod

//TEST:update form (INCOMPLETE)
// exports.authenticateUser = async (req, res) => {
//     console.log("testing3 here");
//     const { username, password } = req.body;

//     try {
//         await testlogin.submit_indivForm(req, res);
//         console.log("submitted successfully");
//         // res.redirect('/home');
//     } catch (error) {
//         console.error('Error retrieving forms:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };


//TEST: retrieve employee data
exports.authenticateUser = async (req, res) => {
    console.log("testing4 here");
    const { username, password } = req.body;

    try {
        const testing = await testlogin.retrieve_employeeData(username);
        console.log(testing);
        // res.redirect('/home');
    } catch (error) {
        console.error('Error retrieving forms:', error);
        res.status(500).send('Internal Server Error');
    }
};


