const db = require('../models/db');

exports.renderLogin = (req, res) => {
    res.render('login', { title: 'LoginPage' });
};

exports.authenticateUser = (req, res) => {
    const { username, password } = req.body;
    console.log('Received data:', { username, password });

    if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.pool.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
};

exports.renderHome = (req, res) => {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
};