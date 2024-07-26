import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HrHomeTable( { HR_ID, name } ) {
	const navigate = useNavigate();
    const [appraisals, setAppraisals] = useState([]);
	const today = new Date();

    useEffect(() => {
		// fetch all forms for HR
		const fetchAppraisals = async() => {
			try {
				const firstResponse = await axios.get('http://localhost:3000/form/HR/status');
				const appraisalData = firstResponse.data;
                // ensure data is in an array format
				const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
					
					if(appraisalArray.length === 0) {
						setAppraisals([]);
						return;
					}

				const staffPromises = appraisalArray.map(async (item) => {
					try{
				        // fetch employee name and department using employeeID
						const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: item.employeeID});
						const { employeeName, department } = secondResponse.data[0];
						const new_date = new Date(item.dueDate);
						const due_date = new_date.toISOString().split('T')[0];

						return {
							employeeName,
							department,
							type: item.appraisalType,
							dueDate: due_date,
							employeeStatus: item.statusEmployee,
							status: item.statusHOD,
							hodID: item.hodID,
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
  	}, []);

	// handle 'View' button to view form
	const handleHrViewClick = (formID, HR_ID, employeeName, department, type) => {
		navigate('/form', { state: { formID, staffID: HR_ID, role: "hr", employeeName, department, type, staffName: name } });
	}

    return (
		<>
		{/* no forms due this month and the previous month */}
		{appraisals.length === 0 && (
			<div className='no-actions'>
				<p>No actions are needed at this time.</p>
			</div>
		)}
		{/* there are forms due this month and the previous month */}
		{appraisals.length !== 0 && (
        <table className='hr-table'>
			<thead>
				<tr>
				<th>Employee Name</th>
				<th>Department</th>
				<th>Purpose</th>
				<th>Due Date</th>
				<th>Staff Status</th>
				<th>HOD Status</th>
				<th></th>
				</tr>
			</thead>
			<tbody>
				{appraisals
					.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
					.map((appraisal, index) => {
						const isOverdue = new Date(appraisal.dueDate) < today;
						return (
							<tr key={index} className={`hr-table-row ${(isOverdue && (appraisal.status === 0)) ? 'overdue' : ''}`}>
								<td>{appraisal.employeeName}</td>
								<td>{appraisal.department}</td>
								<td>{appraisal.type}</td>
								<td>{appraisal.dueDate}</td>
								{appraisal.employeeStatus === 0 && (
									<td className='hr-employee-status-pending'>
										Pending
									</td>
								)}
								{appraisal.employeeStatus === 1 && (
									<td className='hr-employee-status-submitted'>
										Submitted
									</td>
								)}
								{appraisal.status === 0 && (
									<td className='hr-hod-status-pending'>
										Pending
									</td>
								)}
								{appraisal.status === 1 && (
									<td className='hr-hod-status-submitted'>
										Submitted
									</td>
								)}
								<td>
									{/* HR can always click on 'View' to view current state of form */}
									<button className={'hr-view-btn'} onClick={() => handleHrViewClick(appraisal.formID, HR_ID, appraisal.employeeName, appraisal.department, appraisal.type)}>
										View
									</button>
								</td>
							</tr>
						);
					})
				}
			</tbody>
		</table>
		)}
		</>
    );
}

export default HrHomeTable;
