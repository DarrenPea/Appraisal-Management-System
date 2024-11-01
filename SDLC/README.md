# Software Development Life Cycle

## Process
After numerous meetings with our client, we found out the needs and expectations of our client for this particular project. As such, we created a use case diagram to easily visualise it.
<p align="center">
  <img src="https://raw.githubusercontent.com/DarrenPea/Appraisal-Management-System/refs/heads/darren/SDLC/images/use_case_diagram.png" />
</p>

After generating the use case diagram, we came up with use case descriptions for each use case depicted in the diagram and designed sequences diagrams to visualise the process of each use case, from the user interacting with the View layer, to processing in the Controller layer, then being processed by the Model layer. One of our sequence diagrams is depicted as shown below.
<p align="center">
  <img src="https://raw.githubusercontent.com/DarrenPea/Appraisal-Management-System/refs/heads/darren/SDLC/images/sequence_diagram.png" />
</p>

After the implementation of the web application, we conducted various unit testings, fuzzing, integration testing and system testing to ensure our web application works as intended. The fuzzing process ensures that our functions can handle erroneous inputs without causing the application to crash. Below are examples of the test cases we came up with for our system.

<h3>Unit Testing</h3>
<table border='1'>
<tr><th>Use Case ID</th>     <td>UC_5</td></tr>
<tr><th>Test ID</th>         <td>TC_5</td></tr>
<tr><th>Input</th>           <td>{employeeID}</td></tr>
<tr><th>Function/Module</th> <td>employeeStatus()<br><br>This function serves to pull the required data for display on the landing page of employee users</td></tr>
<tr><th>Expected Output</th> <td>[{formID, statusEmployee, appraisalType, dueDate}]</td></tr>
<tr><th>Date executed</th>   <td>21-07-2024</td></tr>
</table>

<h3>Robustness Testing (Fuzzing)</h3>
<table border='1'>
<tr><th>Test Case ID</th>    <td>RTC_2</td></tr>
<tr><th>Test Case Name</th>  <td>Login</td></tr>
<tr><th>Objective</th>       <td>Fuzzing login function with string inputs</td></tr>
<tr><th>Pre-Conditions</th>  <td>N/A</td></tr>
<tr><th>Input</th>           <td>Random string inputs from naughty_list.<br><br> naughty_list includes 'undefined', 'null', '0', '-1E+02', various representations of truthy and falsey values, and edge-case strings</td></tr>
<tr><th>Output</th>          <td>[1]</td></tr>
<tr><th>Post-conditions</th> <td>N/A</td></tr>
<tr><th>Date executed</th>   <td>06-08-2024</td></tr>
</table>

<h3>Integration Testing</h3>
<table border='1'>
<tr><th>Use Case ID</th>     <td>UC_5: View assigned appraisals</td></tr>
<tr><th>Test ID</th>         <td>ITC_3</td></tr>
<tr><th>Input</th>           <td>{"employeeID" = "E001"}</td></tr>
<tr><th>Path Tested</th>     <td>POST: /form/employee/status --> employeeStatus(employeeID)</td></tr>
<tr><th>Expected Output</th> <td>{"formID": 1,<br>"statusEmployee": 1,<br>"appraisalType": "Confirmation",<br>"dueDate": "2024-08-XX"}<br><br>*Note we check for same year as current year and 1 month after current month</td></tr>
<tr><th>Date executed</th>   <td>21-07-2024</td></tr>
</table>

<h3>System Testing</h3>
<table border='1'>
<tr><th>Test Case ID</th>    <td>STC_2</td></tr>
<tr><th>Test Case Name</th>  <td>Submit self appraisal</td></tr>
<tr><th>Objective</th>       <td>Allows employee to submit a form with data they have entered</td></tr>
<tr><th>Pre-Conditions</th>  <td>Appraisal form is assigned to employee</td></tr>
<tr><th>Event Sequence</th>  <td>1. Employee login<br>2. Select form<br>3. Fill up form<br>4. Submit form<br>5. Logout</td></tr>
<tr><th>Input</th>           <td>The employee types in the respective data into the form</td></tr>
<tr><th>Output</th>          <td>N/A</td></tr>
<tr><th>Input</th>           <td>The employee presses 'Submit form'</td></tr>
<tr><th>Output</th>          <td>The respective form in the database is updated with the fields</td></tr>
<tr><th>Post-Conditions</th> <td>N/A</td></tr>
<tr><th>Date-Executed</th>   <td>03-08-2024</td></tr>
</table>
