const cron = require('node-cron');
const employeeModel = require('../models/employee.js');
const formModel = require('../models/appraisalform.js');


// cron.schedule(minute, hour, day of month, month, day of week)
// clock will schedule on the first day of every month to assign appraisal to employee 
// if the current month is the month of their next appraisal date

async function checkForAppraisal() {
    try {
        const employees = await employeeModel.findByAppraisalDateDue();
        for (const employee of employees) {
            const {employeeID, managerID} = employee;
            await employeeModel.updateNextAppraisalDate()
            await formModel.createEntry(employeeID, managerID);
        }
    } catch(error) {
        console.error('Error checking and assigning appraisals:', error);
    }
}

cron.schedule('0 0 1 * *', checkForAppraisal);
