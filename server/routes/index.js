const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controller/logincontroller');

//render login page
router.get('/', loginController.renderLogin);

//route to logic process logic
router.post('/auth', loginController.authenticateUser);

//route to home page
router.get('/home', loginController.renderHome);

module.exports = router;
