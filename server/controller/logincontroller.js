const db = require('../models/db');
const testlogin = require('../models/hod'); //test hod
const testhr = require('../models/hr');

//to render the login page
exports.renderLogin = (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.render('login', { title: 'LoginPage', alerMessage: '' });
};

exports.renderHome = (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
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

exports.authenticateUser = (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
	//console.log("testhr1 here");
	const { username, password } = req.body;
	
	if (username === 'testhod' && password === 'test') {
        req.session.loggedin = true;
        req.session.username = username; // Optional: Store username in session
        res.redirect('/home');
    } 
	//temporary
	else {
		req.session.loggedin = true;
        req.session.username = username;
		res.redirect('/home');
	}
	
	//else {
    //    res.render('login', { title: 'LoginPage', alertMessage: 'Invalid username or password' });
    //}

	//const tester = testhr.login(username, password);
}