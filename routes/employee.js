const express = require('express');
const employeeModel = require('./models/employee.js');
var router = express.Router();


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
      res.json({ form_assigned: formAssigned, status_employee: statusEmployee });
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Employee or appraisal form not found' });
    }
  });
  
  module.exports = router;
