var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var process = require('process');
const db = require("./models/db");
const cors = require('cors'); // Import cors

var employeeModel = require('./models/employee.js');
var formModel = require('./models/appraisalform.js');




// employeeModel.sync();
// formModel.sync();

process.on('SIGINT', db.cleanup);
process.on('SIGTERM', db.cleanup);


var indexRouter = require('./routes/index.js');
var formRouter = require('./routes/appraisalform');
var employeeRouter = require('./routes/employee.js');

var app = express();

//Configure CORS to allow requests from http://localhost:3001
app.use(cors({origin: 'http://localhost:3001'}));

const session = require('express-session');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
//establish session to identify whether login done or not
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//direct to login page first
app.use('/', indexRouter);
// TODO when finalize 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
