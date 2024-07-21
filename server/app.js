const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index'); // Importing the router
var cors = require('cors');

const app = express();

const session = require('express-session');
app.use(cors());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));
//establish session to identify whether login done or not
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Routes
app.use('/', indexRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});