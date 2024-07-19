const express = require('express');
const employeeModel = require('./models/employee.js');
var router = express.Router();

// Enable CORS for all routes
router.use(cors({ origin: 'http://localhost:5000' })); // Change port based on FE React port


// AJAX end points

// POST: /employee/status
// For employee to retrieve and view

// FE send: staffID
// {staffID: val1}
// BE return: form assigned(boolean), status_employee(completed or not)
// {form_assigned: boolean , status_employee: boolean}


router.post('/employee/status/', async (req, res, next) => {
    const { staffID } = req.body;
  
    try {
      const [formAssigned, statusEmployee] = await employeeModel.findStatusByID(staffID);
      res.send(JSON.stringify({ form_assigned: formAssigned, status_employee: statusEmployee }));
    } catch (error) {
      console.error(error);
      res.status(404).send(JSON.stringify({ message: 'Employee or appraisal form not found' }));
    }
  });
  

// POST: /employee/details
// Use this to retrieve employee details held in excel sheet in current workflow.

// FE send: staffID
// {staffID: val1}
// BE return: user details (Job func, KPI, disciplinary & attendance records)
// { Job Function: value1, KPI: value2, Disciplinary records: value3, Attendance Records: value4 }

router.post('/employee/details/', async (req, res, next) => {
    const { staffID } = req.body;
  
    try {
      const {jobFunction, KPI, disciplinaryRecord, attendanceRecord} = await employeeModel.findRecordsByID(staffID);
      res.send(JSON.stringify({
        job_function: jobFunction,
        KPI: KPI,
        disciplinary_record: disciplinaryRecord,
        attendance_record: attendanceRecord
    }));
    } catch (error) {
      console.error(error);
      res.status(404).send(JSON.stringify({ message: 'Employee not found' }));
    }
  });

  module.exports = router;

