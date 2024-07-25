const express = require('express');
const hodModel = require('../models/hod')
var router = express.Router();

router.post('/login', async (req, res, next) => {
  const hodID = req.body.hodID;
  const hodPassword = req.body.hodPassword;
  
  try {
    const result = await hodModel.login(hodID, hodPassword);
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



