var express = require('express');
var router = express.Router();
const EmployeeModel = require('../models/employee');
const HrModel = require('../models/hr');
const HODModel = require('../models/hod');

const loginController = require('../controller/logincontroller');

//render login page
// router.get('/', loginController.renderLogin);

//route to logic process logic
router.post('/auth', async (req, res) => {
    try {
        const { staffID, password } = req.body;
        let result;
        if (staffID[0]==="E"){
            result = await EmployeeModel.login(staffID, password);
        } else if (staffID[0]==="M"){
            result = await HODModel.login(staffID, password);
        } else {
            result = await HrModel.login(staffID, password);
        }
        console.log("LOGINCONTROLLER:",result);
        res.json(result);
        /*
        output success:
        
            [ { employeeName: 'Shev Curry', role: 'staff' } ]
        
        
        output fail:
        { valid_user: false, user: null }
        */
    } catch (error){
        console.error(error);
    }
});

//route to home page
// router.get('/home', loginController.renderHome);

module.exports = router;
