# Software Development Life Cycle

## Process
After numerous meetings with our client, we found out the needs and expectations of our client for this particular project. As such, we created a use case diagram to easily visualise it.
![Use Case Diagram](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/SDLC/images/use_case_diagram.png)

After generating the use case diagram, we came up with use case descriptions for each use case depicted in the diagram and designed sequences diagrams to visualise the process of each use case, from the user interacting with the View layer, to processing in the Controller layer, then being processed by the Model layer. One of our sequence diagrams is depicted as shown below.
![Sequence Diagram](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/SDLC/images/sequence_diagram.png)

After the implementation of the web application, we conducted various unit testings, fuzzing, integration testing and system testing to ensure our web application works as intended. The fuzzing process ensures that our functions can handle erroneous inputs without causing the application to crash. Below are examples of the test cases we came up with for our system.

| Unit Testing | Details |
|----------|---------|
| **Use Case ID** | UC_5 |
| **Test ID** | TC_5 |
| **Input** | {employeeID} |
| **Function/Module** | employeeStatus()<br>This function serves to pull the required data for display on the landing page of employee users |
| **Expected Output** | [{formID, statusEmployee, appraisalType, dueDate}] |
| **Date executed** | 21-07-2024 |

| Robustness Testing (Fuzzing) | Details |
|----------|---------|
| **Test Case ID** | RTC_2 |
| **Test Case Name** | Login |
| **Objective** | Fuzzing login function with string inputs |
| **Pre-Conditions** | N/A |
| **Input** | Random string inputs from naughty_list. <br><br> naughty_list includes "undefined", "null", "0", "-1E+02", various representations of truthy and falsey values, and edge-case strings |
| **Output** | [1] |
| **Post-conditions** | N/A |
| **Date executed** | 06-08-2024 |

| Integration Testing | Details |
|----------|---------|
| **Use Case ID** | UC_5: View assigned appraisals |
| **Test ID** | ITC_3 |
| **Input** | {"employeeID" = "E001"} |
| **Path Tested** | POST: /form/employee/status --> employeeStatus(employeeID) |
| **Expected Output** | {"formID": 1, <br> "statusEmployee": 1 <br> "appraisalType": "Confirmation" <br> "dueDate": "2024-08-XX"} <br><br> *Note we check for same year as current year and 1 month after current month
| **Date executed** | 21-07-2024 |

| System Testing | Details |
|----------|---------|
| **Test Case ID** | STC_2 |
| **Test Case Name** | Submit self appraisal |
| **Objective** | Allows employee to submit a form with data they have entered |
| **Pre-Conditions** | Appraisal form is assigned to employee |
| **Event Sequence** | 1. Employee login <br> 2. Select form <br> 3. Fill up form <br> 4. Submit form <br> 5. Logout |
| **Input** | The employee types in the respective data into the form |
| **Output** | N/A |
| **Input** | The employee presses "Submit form" |
| **Output** | The respective form in the database is updated with the fields |
| **Post-Conditions** | N/A |
| **Date-Executed** | 03-08-2024 |