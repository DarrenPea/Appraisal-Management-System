import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeHomeTable({staffID}) {
	const [appraisals, setAppraisals] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// Simulate an axios request with a timeout
		setTimeout(() => {
			const sampleData = [
			  {
				employeeName: 'John Doe',
				department: 'customer service',
				appraisalType: 'Annual Review',
				dueDate: '2024-07-30',
				statusEmployee: 'Pending',
				formID: 'form 1'
			  },
			  {
				employeeName: 'Jane Smith',
				department: 'manufacturing',
				appraisalType: 'Mid-Year Review',
				dueDate: '2024-08-15',
				statusEmployee: 'Submitted',
				formID: 'form 2'
			  },
			];
	  
			const newAppraisals = sampleData.map(item => ({
				department: item.department,
			  	employeeName: item.employeeName,
			  	type: item.appraisalType,
			  	dueDate: item.dueDate,
			  	status: item.statusEmployee,
			  	formID: item.formID
			}));
	  
			setAppraisals(newAppraisals);
		  }, 1000); // Simulate a 1-second delay

    // Uncomment the axios request when database is ready
	const fetchAppraisals = async() => {
		try {
			// console.log(staffID);
			const firstResponse = await axios.post('http://localhost:3000/form/employee/status', {staffID} );
			const appraisalData = firstResponse.data;

			const staffPromises = appraisalData.map(async (item) => {
				const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: staffID});
				const { employeeName, department } = secondResponse.data;
				return {
					employeeName,
					department,
					type: item.appraisalType,
					dueDate: item.dueDate,
					employeeStatus: item.statusEmployee,
					formID: item.formID
				};
			});
			
			const newAppraisals = await Promise.all(staffPromises);
			setAppraisals(newAppraisals);
		} catch (error) {
			console.error('Error fetching data', error);
		}
	};

	fetchAppraisals();

  	}, [staffID]);


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
                        <td className={appraisal.status === 'Pending' ? 'employee-status-pending' : 'employee-status-submitted'}>
                            {appraisal.status}
                        </td>
                        <td>
                            <button
                                className={`employee-fill-up-btn ${appraisal.status === 'Submitted' ? 'disabled' : ''}`}
                                disabled={appraisal.status === 'Submitted'}
								onClick={() => handleEmployeeFillUpClick(appraisal.formID, staffID, appraisal.employeeName, appraisal.department, appraisal.type)}
                            >
                                Fill up
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EmployeeHomeTable;
