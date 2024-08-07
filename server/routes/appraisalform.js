const express = require("express");
const formModel = require("../models/appraisalform.js");
var router = express.Router();

router.post("/employee/status", async(req,res) => {
    try{
        const employeeID = req.body.employeeID;
        const form = await formModel.employeeStatus(employeeID);
        console.log(form)

        // Check if form is empty
        // if (form.length === 0) {
        //     return res.status(404).json({ message: "Entry not found" });
        // }

        res.json(form[0]);
    }catch(error){
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'Problem with retrieving employee status' }));
    }
});

//EMPLOYEE SUBMIT (NEW VERSION), To include flag for saving form.
router.post("/employee/submit", async(req,res) => {
    try{
        const {saveStatus, formID, ...formfields} = req.body;
        const order = [
            'A1', 'A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8',
            'A3_1', 'CommentsA3_1', 'A3_2', 'CommentsA3_2', 'A3_3', 'CommentsA3_3',
            'A3_4', 'CommentsA3_4', 'A3_5', 'CommentsA3_5', 'A3_6', 'CommentsA3_6', 
            'A3_7', 'CommentsA3_7', 'A3_8', 'CommentsA3_8', 'A3_9', 'CommentsA3_9',
            'A3_10', 'CommentsA3_10', 'A3_11', 'CommentsA3_11', 'A3_12', 'CommentsA3_12',
            'A3_13', 'CommentsA3_13', 'A3_14', 'CommentsA3_14', 'A3_15', 'CommentsA3_15',
            'A3_16', 'CommentsA3_16', 'A3_17', 'CommentsA3_17', 'A3_18', 'CommentsA3_18',
            'A3_19', 'CommentsA3_19', 'A3_20', 'CommentsA3_20', 'overallRating', 'B'
          ];
        const formfields_array = order.map(key => formfields[key]);
        const upload_status = await formModel.updateForm(formID, formfields_array, saveStatus);
        res.send(JSON.stringify(upload_status));
    }catch(error){
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'Problem with /form/employee/submit' }));
    }
});
// EMPLOYEE SUBMIT (PREVIOUS VERSION)
// router.post("/employee/submit", async(req,res) => {
//     try{
//         const {formID, ...formfields} = req.body;
//         const order = [
//             'A1', 'A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8',
//             'A3_1', 'CommentsA3_1', 'A3_2', 'CommentsA3_2', 'A3_3', 'CommentsA3_3',
//             'A3_4', 'CommentsA3_4', 'A3_5', 'CommentsA3_5', 'A3_6', 'CommentsA3_6', 
//             'A3_7', 'CommentsA3_7', 'A3_8', 'CommentsA3_8', 'A3_9', 'CommentsA3_9',
//             'A3_10', 'CommentsA3_10', 'A3_11', 'CommentsA3_11', 'A3_12', 'CommentsA3_12',
//             'A3_13', 'CommentsA3_13', 'A3_14', 'CommentsA3_14', 'A3_15', 'CommentsA3_15',
//             'A3_16', 'CommentsA3_16', 'A3_17', 'CommentsA3_17', 'A3_18', 'CommentsA3_18',
//             'A3_19', 'CommentsA3_19', 'A3_20', 'CommentsA3_20', 'overallRating', 'B'
//           ];
//         const formfields_array = order.map(key => formfields[key]);
//         const upload_status = await formModel.updateForm(formID, formfields_array);
//         res.send(JSON.stringify(upload_status));
//     }catch(error){
//         console.error(error);
//         res.status(500).send(JSON.stringify({ message: 'Problem with /form/employee/submit' }));
//     }
// });

/*HOD SUBMIT NEW VERSION, To include flag for saving form. */
router.post("/hod/submit", async(req,res) => {
    // console.log('Request received at /hod/submit');
    try{
        const {saveStatus, formID, ...formfields} = req.body;
        const order = [
            'A1', 'A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8',
            'A3_1', 'CommentsA3_1', 'A3_2', 'CommentsA3_2', 'A3_3', 'CommentsA3_3',
            'A3_4', 'CommentsA3_4', 'A3_5', 'CommentsA3_5', 'A3_6', 'CommentsA3_6', 
            'A3_7', 'CommentsA3_7', 'A3_8', 'CommentsA3_8', 'A3_9', 'CommentsA3_9',
            'A3_10', 'CommentsA3_10', 'A3_11', 'CommentsA3_11', 'A3_12', 'CommentsA3_12',
            'A3_13', 'CommentsA3_13', 'A3_14', 'CommentsA3_14', 'A3_15', 'CommentsA3_15',
            'A3_16', 'CommentsA3_16', 'A3_17', 'CommentsA3_17', 'A3_18', 'CommentsA3_18',
            'A3_19', 'CommentsA3_19', 'A3_20', 'CommentsA3_20', 'overallRating', 'B'
          ];
        const formfields_array = order.map(key => formfields[key]);
        const upload_status = await formModel.updateForm(formID, formfields_array, saveStatus, true);
        res.send(JSON.stringify(upload_status));
    }catch(error){
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'Problem with /form/hod/submit' }));
    }
});

//HOD SUBMIT (PREVIOUS VERSION)
// router.post("/hod/submit", async(req,res) => {
//     // console.log('Request received at /hod/submit');
//     try{
//         const {formID, ...formfields} = req.body;
//         const order = [
//             'A1', 'A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8',
//             'A3_1', 'CommentsA3_1', 'A3_2', 'CommentsA3_2', 'A3_3', 'CommentsA3_3',
//             'A3_4', 'CommentsA3_4', 'A3_5', 'CommentsA3_5', 'A3_6', 'CommentsA3_6', 
//             'A3_7', 'CommentsA3_7', 'A3_8', 'CommentsA3_8', 'A3_9', 'CommentsA3_9',
//             'A3_10', 'CommentsA3_10', 'A3_11', 'CommentsA3_11', 'A3_12', 'CommentsA3_12',
//             'A3_13', 'CommentsA3_13', 'A3_14', 'CommentsA3_14', 'A3_15', 'CommentsA3_15',
//             'A3_16', 'CommentsA3_16', 'A3_17', 'CommentsA3_17', 'A3_18', 'CommentsA3_18',
//             'A3_19', 'CommentsA3_19', 'A3_20', 'CommentsA3_20', 'overallRating', 'B'
//           ];
//         const formfields_array = order.map(key => formfields[key]);
//         const upload_status = await formModel.updateForm(formID, formfields_array, true);
//         res.send(JSON.stringify(upload_status));
//     }catch(error){
//         console.error(error);
//         res.status(500).send(JSON.stringify({ message: 'Problem with /form/hod/submit' }));
//     }
// });


router.post("/retrieve", async(req,res) => {
    try{
        const {formID} = req.body;
        const form = await formModel.retrieveForm(formID);
        res.send(JSON.stringify(form));
    }catch(error){
        console.error(error);
        res.status(404).send(JSON.stringify({ message: 'Problem with /form/retrieve' }));
    }
});


router.post("/hod/status", async(req,res) => { 
    try{
        const hodID = req.body.hodID;
        const forms = await formModel.hodStatus(hodID);

        // console.log('hodstatus', forms);

        // Check if no forms found
        // if (forms.length === 0) {
        //     return res.status(404).json({ message: "No entries found" });
        // }

        // Send response with the forms found
        res.json(forms);
    }catch(error){
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'problem with /form/hod/status' }));
    }
});


router.get("/HR/status", async(req,res) => {
    try{
        const forms = await formModel.hrStatus();
        console.log('hrstatus', forms);

        // if (forms.length === 0) { // Correct way to check if an array is empty
        //     return res.status(404).json({ message: "Entry not found" });
        // }
        res.json(forms);
    }catch(error){ 
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'problem with /form/HR/status' }));
    }
})

module.exports = router;
