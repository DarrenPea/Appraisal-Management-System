const express = require("express");
const formModel = require("../models/appraisalform.js");
var router = express.Router();

// GET: /form/retrieve
// Use this to pull a NEW appraisal form for the employee to fill up.
router.get("/retrieve/", async (req, res) => {
    try {
        const formInstance = formModel.blank_form();
        res.json(formInstance); // Send the data as JSON
    } catch (error) {
        console.error("Error fetching form data:", error);
        res.status(500).send("Server error");
    }
  });


//   Submit the fully filled up appraisal form by employee.
//   FE send: completed form (by employee only), staffID
//   {staffID: val1, {qn1: None, qn2: None,..., last_qn: None}}
//   BE returns: Success of saving to database
router.post("/employee/submit", async(req,res) => {
    try{
        const list_of_data = req.body;
        const staffID = list_of_data[0];
        const formfields = list_of_data.slice(1,);
        const upload_status = await formModel.insertone(staffID, formfields);
        res.send(JSON.stringify(upload_status));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'problem with /form/employee' }));
    }
});

// use by HOD to submit their completed appraisal form to backend for storage.
// FE send: formID, completed form (by HOD)
// --> [formID, qn1: val1, qn2:val2, ... , qn_last:vallast]
// BE returns: Success of saving to database
router.post("/HOD/submit", async(req,res) => {
    try{
        const list_of_data = req.body;
        const formID = list_of_data[0];
        const formfields = list_of_data.slice(1,);
        // we only update status_HOD, latest upload and ALL of form fields.
        const to_upload = [true, new Date(), ... formfields];
        const upload_status = await formModel.updateone(formID, to_upload);
        res.send(JSON.stringify(upload_status));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'problem with /form/HOD/submit' }));
    }
});


// use by HOD to retrieve forms completed by employee to fill up
// FE send: employeeID
// BE return: respective staff form
// {qn1: None, qn2: None,..., last_qn:None}
// *FE need to take note which questions can be filled up by HOD.
router.post("/HOD/retrieve", async(req,res) => {
    try{
        const employeeID = req.body;
        const form = await formModel.retrieveform(employeeID);
        res.send(JSON.stringify(form));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'problem with /form/HOD/retrieve' }));
    }
});

// 10.) POST: /form/completed
// use by HR to view completed form for a specific row of the table.
// FE send: employeeID
// BE return: respective completed form
// {qn1: val1, qn2: val2,...,last_qn:valLast}
router.post("/completed", async(req,res) => {
    try{
        const employeeID = req.body;
        const form = await formModel.retrieveform(employeeID);
        res.send(JSON.stringify(form));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'problem with /form/completed' }));
    }
});

//8.) POST: /form/HOD/status
// use by HOD to retrieve and view the list of all forms assigned to HOD to be completed. 
// FE send: HOD_ID
// {HOD_ID:val1}
// BE return: list of forms for HOD to complete and their status
// {formID: int, name: staffID_string, department: staff_dept_string, type: formtype_string, duedate: date_string, status_HOD: boolean, status_employee: boolean}
router.post("/HOD/status", async(req,res) => { 
    try{
    const HOD_ID = req.body;
    const form = await formModel.retrieveAllForms(HOD_ID);
    res.send(JSON.stringify(form));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'problem with /form/completed' }));
    }
});

module.exports = router;