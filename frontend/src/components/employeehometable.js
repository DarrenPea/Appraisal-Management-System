import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeHomeTable({staffID}) {
	const [appraisals, setAppraisals] = useState([]);
	const navigate = useNavigate();

		// // Simulate an axios request with a timeout
		// setTimeout(() => {
		// 	const sampleData = [
		// 	  {
		// 		employeeName: 'John Doe',
		// 		department: 'customer service',
		// 		appraisalType: 'Annual Review',
		// 		dueDate: '2024-07-30',
		// 		statusEmployee: 'Pending',
		// 		formID: 'form 1'
		// 	  },
		// 	  {
		// 		employeeName: 'Jane Smith',
		// 		department: 'manufacturing',
		// 		appraisalType: 'Mid-Year Review',
		// 		dueDate: '2024-08-15',
		// 		statusEmployee: 'Submitted',
		// 		formID: 'form 2'
		// 	  },
		// 	];
	  
		// 	const newAppraisals = sampleData.map(item => ({
		// 		department: item.department,
		// 	  	employeeName: item.employeeName,
		// 	  	type: item.appraisalType,
		// 	  	dueDate: item.dueDate,
		// 	  	status: item.statusEmployee,
		// 	  	formID: item.formID
		// 	}));
	  
		// 	setAppraisals(newAppraisals);
		//   }, 1000); // Simulate a 1-second delay

    // Uncomment the axios request when database is ready
	useEffect(() => {
		const fetchAppraisals = async () => {
		  try {
			console.log("here0");
			const firstResponse = await axios.post('http://localhost:3000/form/employee/status', { employeeID: staffID });
			const appraisalData = firstResponse.data;
	  
			// Ensure data is in an array format
			const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
			
			if(appraisalArray[0].length === 0) {
				setAppraisals({formID: null})
				return
			}
	  
			const staffPromises = appraisalArray.map(async (item) => {
			  console.log("here1: fetching second response");

			  try {
				const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: staffID });
				const { employeeName, department } = secondResponse.data[0];
				const new_date = new Date(item.dueDate);
                const due_date = new_date.toISOString().split('T')[0];

				return {
				  employeeName,
				  department,
				  type: item.appraisalType,
				  dueDate: due_date,
				  employeeStatus: item.statusEmployee,
				  formID: item.formID
				};
			  } catch (error) {
				console.error('Error fetching second response', error);
				return null;
			  }
			});
	  
			const newAppraisals = await Promise.all(staffPromises);
			setAppraisals(newAppraisals.filter(item => item !== null));

		  } catch (error) {
			console.error('Error fetching data', error);
		  }
		};
	  
		fetchAppraisals();
	  }, [staffID]);
	  
	  useEffect(() => {
		// console.log("Updated appraisals:", appraisals.map((appraisal, i) => (appraisal.employeeStatus)));
		console.log("formid", appraisals.formID!==null)
	  }, [appraisals]);


	// axios.post('http://localhost:3000/form/employee/status', {staffID: staffID})
	// .then(res => {
	// 	const data = res.data;
	// 	appraisals.name = data.staffID;
	// 	appraisals.type = data.purpose;
	// 	appraisals.dueDate = data.dueDate;
	// 	appraisals.status = data.statusEmployee;
	// })
	// .then(err => console.log(err));


	const handleEmployeeFillUpClick = (formID, staffID, employeeName, department, type) => {
		navigate('/form', { state: { formID , staffID, role: "employee", employeeName, department, type} });
	};

    return (
		<>
		{appraisals.formID === null && (
			<div className='no-actions'>
				<p>No actions are needed at this time.</p>
			</div>
		)}
		{appraisals.formID !== null && (
        <table className='employee-table'>
            <thead>
                <tr>
                    <th>Name</th>
					<th>Department</th>
                    <th>Purpose</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {appraisals.map((appraisal, index) => (
                    <tr key={index}>
                        <td>{appraisal.employeeName}</td>
						<td>{appraisal.department}</td>
                        <td>{appraisal.type}</td>
                        <td>{appraisal.dueDate}</td>
						{appraisal.employeeStatus === 0 && (
							<td className='employee-status-pending'>
								Pending
							</td>
						)}
						{appraisal.employeeStatus === 1 && (
							<td className='employee-status-submitted'>
								Submitted
							</td>
						)}
                        <td>
                            <button
                                className={`employee-fill-up-btn ${appraisal.employeeStatus === '1' ? 'disabled' : ''}`}
                                disabled={appraisal.employeeStatus === '1'}
								onClick={() => handleEmployeeFillUpClick(appraisal.formID, staffID, appraisal.employeeName, appraisal.department, appraisal.type)}
                            >
                                Fill up
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
		)}
		</>
    );
}

export default EmployeeHomeTable;
