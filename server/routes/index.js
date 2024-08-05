var express = require('express');
var router = express.Router();
const axios = require('axios');

// const loginController = require('../controller/logincontroller');
//route to home page
// router.get('/home', loginController.renderHome);
//render login page
// router.get('/', loginController.renderLogin);

//route to logic process logic
router.post('/auth', async (req, res) => {
    try {
        const { staffID, password } = req.body;
        let result;
        if (staffID[0]==="E"){
            result = await axios.post('http://localhost:3000/employee/login', {employeeID: staffID, employeePassword: password});
        } else if (staffID[0]==="M"){
            result = await axios.post('http://localhost:3000/hod/login', {hodID: staffID, hodPassword: password});
        } else {
            result = await axios.post('http://localhost:3000/hr/login', {hrID: staffID, hrPassword: password});
        }
        console.log("LOGINCONTROLLER:",result.data);
        res.json(result.data);
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

module.exports = router;
