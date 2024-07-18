const express = require('express');
const hodModel = require('../models/hod')
var router = express.Router();

router.post('/form/hod/status/', async (req, res, next) => {
    const { hodID } = req.body;
  
    try {
      const [formID, employeeID, employeeStatus, hodStatus, uploadDate] = await hodModel.retrieve_allforms(hodID);
      //parameters are according to the element ids from frontend
      res.send(JSON.stringify({ form_id: formID, employee_id: employeeID,
         employee_status: employeeStatus, hod_status: hodStatus, upload_date: uploadDate }));

    } catch (error) {
      console.error(error);
      res.status(404).send(JSON.stringify({ message: 'Employee or appraisal form not found' }));
    }
  });

  router.post('/form/hod', async (req, res, next) => {
    const { hodID } = req.body;
  
    try {
      const [formID, employeeID, employeeStatus, hodStatus, uploadDate] = await hodModel.retrieve_allforms(hodID);
      //parameters are according to the element ids from frontend
      res.send(JSON.stringify({ form_id: formID, employee_id: employeeID,
         employee_status: employeeStatus, hod_status: hodStatus, upload_date: uploadDate }));

    } catch (error) {
      console.error(error);
      res.status(404).send(JSON.stringify({ message: 'Employee or appraisal form not found' }));
    }
  });


  module.exports = router;



