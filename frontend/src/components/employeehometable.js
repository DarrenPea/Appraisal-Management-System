import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeHomeTable({staffID, name}) {
	const [appraisals, setAppraisals] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// fetch form for employee using employeeID
		const fetchAppraisals = async () => {
		  try {
			const firstResponse = await axios.post('http://localhost:3000/form/employee/status', { employeeID: staffID });
			const appraisalData = firstResponse.data;
			// ensure data is in an array format
			const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
			
			if(appraisalArray[0].length === 0) {
				setAppraisals([]);
				return;
			}
	  
			const staffPromises = appraisalArray.map(async (item) => {
			  try {
				// fetch employee name and department using employeeID
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

	// handle 'Fill up' button to bring up form
	const handleEmployeeFillUpClick = (formID, staffID, employeeName, department, type) => {
		navigate('/form', { state: { formID , staffID, role: "employee", employeeName, department, type, staffName: name} });
	};

    return (
		<>
		{/* no forms are due */}
		{appraisals.length === 0 && (
			<div className='no-actions'>
				<p>No actions are needed at this time.</p>
			</div>
		)}
		{/* there is a form due */}
		{appraisals.length !== 0 && (
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
							{/* employees can click on 'Fill up' if they have a 'Pending' form. If submitted, disable 'Fill up' */}
                            <button
                                className={`employee-fill-up-btn ${appraisal.employeeStatus === 1 ? 'disabled' : ''}`}
                                disabled={appraisal.employeeStatus === 1}
								onClick={() => handleEmployeeFillUpClick(appraisal.formID, staffID, appraisal.employeeName, appraisal.department, appraisal.type )}
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
