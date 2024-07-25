const express = require('express');
const hrModel = require('../models/hr')
var router = express.Router();

router.post('/login', async (req, res, next) => {
  const hrID = req.body.hrID;
  const hrPassword = req.body.hrPassword;

  try {
    const result = await hrModel.login(hrID, hrPassword);
    res.json(result);
    
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({
      verified: false,
        user: null,
    });
  }
});

  module.exports = router;



