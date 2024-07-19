const express = require('express');
const hrModel = require('../models/hr')
var router = express.Router();

router.post('/hr/login', async (req, res, next) => {
    const { hrID, hrPassword } = req.body;
  
    try {
      const result = await hrModel.login(hrID, hrPassword);
      
      //if valid user
      if (result.valid_user) {
        res.status(200).json({
          verified: true,
          user: result.user,
          /*
          result.user contains the below
          HR_ID: user.hrID,
          HR_Name: user.hrName,
          role: user.role,
          */
        });
      } else {
        res.status(401).json({
          verified: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Error during login process:', error);
      res.status(500).json({
        verified: false,
          user: null,
      });
    }
  });

  module.exports = router;



