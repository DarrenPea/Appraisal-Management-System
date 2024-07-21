import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HrHomeTable() {
    const [appraisals, setAppraisals] = useState([]);

    useEffect(() => {
		// Simulate an axios request with a timeout
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

    // Uncomment the axios request when database is ready
	const fetchAppraisals = async() => {
		try {
			const firstResponse = await axios.get('http://localhost:3000/form/HR/status');
			const appraisalData = firstResponse.data;

			const staffPromises = appraisalData.map(async (item) => {
				const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: item.employeeID});
				const { employeeName, department } = secondResponse.data;
				return {
					employeeName,
					department,
					type: item.appraisalType,
					dueDate: item.dueDate,
					employeeStatus: item.statusEmployee,
					status: item.statusHOD,
					hodID: item.hodID,
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

  	}, []);


    // const appraisals = [
    //     { employeeName: 'Sarah Lee', department: 'manu', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending' },
    //     { employeeName: 'Lebron James', department: 'manu', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted' },
    //     { employeeName: 'Freddy', department: 'manu', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted' },
    //     { employeeName: 'Father Loh', department: 'manu', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending' }
    // ];

    return (
        <table className='hr-table'>
			<thead>
				<tr>
				<th>Name</th>
				<th>Department</th>
				<th>Purpose</th>
				<th>Due Date</th>
				<th>HOD Status</th>
				<th>Staff Status</th>
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
						<td className={appraisal.employeeStatus === 'Pending' ? 'hr-employee-status-pending' : 'hr-employee-status-submitted'}>
                            {appraisal.employeeStatus}
                        </td>
                        <td className={appraisal.status === 'Pending' ? 'hr-hod-status-pending' : 'hr-hod-status-submitted'}>
                            {appraisal.status}
                        </td>
                        <td>
                            <button className={'hr-view-btn'}>
                                View
                            </button>
                        </td>
					</tr>
				))}
			</tbody>
		</table>
    );
}

export default HrHomeTable;
