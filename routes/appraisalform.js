const express = require("express");
const model = require("../models/appraisalform.js");
var router = express.Router();

router.get("/", async (req, res) => {
    try {
        const formInstance = model.form();
        // We only send a list of data. in ORDER of question!
        let to_send = []
        for (let value of Object.values(formInstance)) {
            to_send.push(value);
        }
        res.json(to_send); // Send the data as JSON
    } catch (error) {
        console.error("Error fetching form data:", error);
        res.status(500).send("Server error");
    }
  });

router.post("/employee", async(req,res) => {
    try{
        
    }catch{

    }
});

module.exports = router;