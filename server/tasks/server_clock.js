const employeeModel = require('../models/employee.js');
const formModel = require('../models/appraisalform.js');

// function to update next appraisal date for employee and to create appraisal form for employee
// if the current month is the month of the employee's next appraisal date

async function checkForAppraisal() {

    try {
        const employees = await employeeModel.findByAppraisalDateDue();
        for (const employee of employees) {
        console.log("inserting:  " + employee);
            let employeeID = employee.employeeID;
            let  managerID = employee.hodID;
            await employeeModel.updateNextAppraisalDate(employeeID)
            await formModel.createEntry(employeeID, managerID);
        }
    } catch(error) {
        console.error('Error checking and assigning appraisals:', error);
    }
}

module.exports = {
    checkForAppraisal // Export the function to be used in www.js
};