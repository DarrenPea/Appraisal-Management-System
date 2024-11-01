# Appraisal Management System
## Project
This appraisal management system was proposed to Total Manufacturing Solution Provider (TSH) as part of a Elements of Software Construction project.

It is a web application that automates the labor-intensive performance appraisal process for employees and the Human Resources (HR) department would be able to view past appraisal records efficiently. The appraisal criterias were also adhered to the specified form provided by the company.

## Implementations
1. A database that stores the necessary staff information
2. Digitizing paper forms
3. A tracking system for the HR department to monitor the completion status of every form
4. A customised landing page for employees to view forms that are only relevant to them and view past appraisals if necessary

## Process
1. We adopted the Software Development Life Cycle (SDLC) at the beginning of this project to understand the client's needs. Further details on our SDLC can be viewed [here](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/SDLC).

2. After delegating different aspects of the project to different individuals, everyone worked independently on their own tasks. However, we remained aligned throughout due to the clear set of requirements and specifications established early on, including the API calls between the backend and frontend of the system.

3. As the project was created, we also performed testing on various aspects of our system, in particular, Unit Testing, Fuzzing, Integration Testing and System Testing. We created test files for our [frontend](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/frontend/src/test) and [backend](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/server/\_\_test\_\_) files seperately to test each of their individual components and functionalities using Jest. As a whole system, we used Cypress to test our [entire system](https://github.com/DarrenPea/Appraisal-Management-System/tree/darren/cypress/e2e/integration), from logging in, to viewing appraisals, to filling their forms, etc.