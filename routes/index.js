var express = require('express');
var router = express.Router();

const loginController = require('../controller/logincontroller');

/* GET home page. */
router.get('/', loginController.renderLogin);
router.post('/auth', loginController.authenticateUser);
router.get('/home', loginController.renderHome);

module.exports = router;
