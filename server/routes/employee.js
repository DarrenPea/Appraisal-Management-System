const express = require('express');
const employeeModel = require('../models/employee.js');
var router = express.Router();

router.post('/details', async (req, res, next) => {
    
    const staffID  = req.body.employeeID;
    try {
      const data = await employeeModel.findRecordsByID(staffID);
      res.json(data);

    } catch (error) {
      console.error(error);
      res.status(404).send(JSON.stringify({ message: 'Employee not found' }));
    }
  });

  router.post("/HR/status", async (req, res) => {
    try {
        const {employeeID} = req.body; // Directly accessing employeeID
        const form = await employeeModel.hrStatus(employeeID);
        if (form.length === 0) { // Correct way to check if an array is empty
            return res.status(404).json({ message: "Entry not found" });
        }
        console.log(form);
        res.send(JSON.stringify(form)); // Directly send JSON without converting to string
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Problem with retrieving HR status' }); // More relevant error message
    }
});

router.post('/login', async (req, res, next) => {
  const employeeID = req.body.employeeID;
  const employeePassword = req.body.employeePassword;

  try {
    const result = await employeeModel.login(employeeID, employeePassword);
    res.json(result);
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json(error);
  }
});

  module.exports = router;

