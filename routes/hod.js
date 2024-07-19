const express = require('express');
const hodModel = require('../models/hod')
var router = express.Router();

router.post('/hod/login', async (req, res, next) => {
    const { hodID, hodPassword } = req.body;
  
    try {
      const result = await hodModel.login(hodID, hodPassword);
      
      //if valid user
      if (result.valid_user) {
        res.status(200).json({
          verified: true,
          user: result.user,
          /*
          result.user contains the below
          hodID: user.hodID,
          hodName: user.hodName,
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



