import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HrHomeTable( { HR_ID, name } ) {
	const navigate = useNavigate();

	// UNCOMMENT WHEN API CALL READY
    const [appraisals, setAppraisals] = useState([]);

    useEffect(() => {

	// STOP HERE

		// Simulate an axios request with a timeout (useless)
		// setTimeout(() => {
		// 	const sampleData = [
        //         { employeeID: 'Sarah Lee', hodID: '132894', appraisalType: 'Yearly', dueDate: '11/1/24', statusEmployee: 'Submitted', statusHOD: 'Pending', formID: 'sdfsdg' },
        //         { employeeID: 'Lebron James', hodID: '213124', appraisalType: 'Confirmation', dueDate: '12/2/24', statusEmployee: 'Submitted', statusHOD: 'Submitted', formID: 'dfgsdf' },
        //         { employeeID: 'Freddy', hodID: '12314', appraisalType: 'Yearly', dueDate: '13/2/24', statusEmployee: 'Submitted', statusHOD: 'Submitted', formID: 'sdhsfsasf' },
        //         { employeeID: 'Father Loh', hodID: '213452665', appraisalType: 'Yearly', dueDate: '14/2/24', statusEmployee: 'Pending', statusHOD: 'Pending', formID: 'gfjfhbgcv' }
        //     ];
	  
		// 	const newAppraisals = sampleData.map(item => ({
		// 	    name: item.employeeID,
		// 		hodName: item.hodID,
		// 	    type: item.appraisalType,
		// 	    dueDate: item.dueDate,
        //      employeeStatus: item.statusEmployee,
		// 	    hodStatus: item.statusHOD,
		// 		formID: item.formID,
		// 	}));
	  
		// 	setAppraisals(newAppraisals);
		//   }, 1000); // Simulate a 1-second delay


	// UNCOMMENT WHEN API CALL READY
	const fetchAppraisals = async() => {
		try {
			const firstResponse = await axios.get('http://localhost:3000/form/HR/status');
			const appraisalData = firstResponse.data;

			const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
                console.log("array", appraisalArray);
                
                if(appraisalArray[0].length === 0) {
                    setAppraisals({formID: null})
                    return
                }

			const staffPromises = appraisalArray.map(async (item) => {
				try{
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
			setAppraisals(newAppraisals);
		} catch (error) {
			console.error('Error fetching data', error);
		}
	};

	fetchAppraisals();

  	}, []);
	// STOP HERE

	
	// MOCK DATA
    // const appraisals = [
    //     { employeeName: 'Sarah Lee', department: 'manu', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', hodID: 'hodododd', formID: '123' },
    //     { employeeName: 'Lebron James', department: 'manu', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', hodID: 'hodfwododd', formID: '1212' },
    //     { employeeName: 'Freddy', department: 'manu', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', hodID: 'wqeadsf', formID: '3454' },
    //     { employeeName: 'Father Loh', department: 'manu', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', hodID: 'hoasddodasdodd', formID: '24123' }
    // ];


	const handleHrViewClick = (formID, HR_ID, employeeName, department, type) => {
		navigate('/form', { state: { formID, staffID: HR_ID, role: "hr", employeeName, department, type, staffName: name } });
	}

    return (
		<>
		{console.log("len", appraisals.length)}
		{appraisals.formID === null && (
			<div className='no-actions'>
				<p>No actions are needed at this time.</p>
			</div>
		)}
		{appraisals.formID !== null && (
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
				{appraisals.map((appraisal, index) => (
					<tr key={index}>
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
                            <button className={'hr-view-btn'} onClick={() => handleHrViewClick(appraisal.formID, HR_ID, appraisal.employeeName, appraisal.department, appraisal.type)}>
                                View
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

export default HrHomeTable;
