import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './modal';
import AppraisalForm from './appraisalform';
import { useNavigate } from 'react-router-dom';

function HodHomeTable( { HOD_ID }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


		// Simulate an axios request with a timeout
		// setTimeout(() => {
		// 	const sampleData = [
        //         { employeeID: 'Sarah Lee', appraisalType: 'Yearly', dueDate: '11/1/24', statusEmployee: 'Submitted', statusHOD: 'Pending', formID:'dsfd' },
        //         { employeeID: 'Lebron James', appraisalType: 'Confirmation', dueDate: '12/2/24', statusEmployee: 'Submitted', statusHOD: 'Submitted', formID:'sadas' },
        //         { employeeID: 'Freddy', appraisalType: 'Yearly', dueDate: '13/2/24', statusEmployee: 'Submitted', statusHOD: 'Submitted', formID:'sadasfg' },
        //         { employeeID: 'Father Loh', appraisalType: 'Yearly', dueDate: '14/2/24', statusEmployee: 'Pending', statusHOD: 'Pending', formID:'dsfsdg' }
        //     ];
	  
		// 	const newAppraisals = sampleData.map(item => ({
		// 	    employeeID: item.employeeID,
		// 	    type: item.appraisalType,
		// 	    dueDate: item.dueDate,
        //         employeeStatus: item.statusEmployee,
		// 	    status: item.statusHOD,
        //         formID: item.formID
		// 	}));
	  
		// 	setAppraisals(newAppraisals);
		//   }, 1000); // Simulate a 1-second delay




    // Uncomment the axios request when database is ready
    const [appraisals, setAppraisals] = useState([]);

    useEffect(() => {
        const fetchAppraisals = async() => {
            try {
                const firstResponse = await axios.post('http://localhost:3000/form/HOD/status', { HOD_ID });
                const appraisalData = firstResponse.data;

                // Ensure data is in an array format
                const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
                console.log("array", appraisalArray);
                
                if(appraisalArray[0].length === 0) {
                    setAppraisals({formID: null})
                    return
                }

                const staffPromises = appraisalData.map(async (item) => {
                    console.log("item", item.employeeID);
                    console.log("here1: fetching second response");

                    try {
                        const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: item.employeeID});
                        const { employeeName, department } = secondResponse.data[0];
                        const new_date = new Date(item.dueDate);
                        const due_date = new_date.toISOString().split('T')[0];

                        console.log("name", employeeName)
                        return {
                            employeeID: item.employeeID,
                            employeeName,
                            department,
                            type: item.appraisalType,
                            dueDate: due_date,
                            employeeStatus: item.statusEmployee,
                            status: item.statusHOD,
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
    }, [HOD_ID]);


        // until hereeee!!!!!




		// axios.post('http://localhost:3000/form/HOD/status', { HOD_ID })
		// .then(res => {
		// 	const data = res.data;
		// 	const newAppraisals = data.map(item => ({
		// 		employeeID: item.employeeID,
        //         type: item.appraisalType,
        //         dueDate: item.dueDate,
        //         employeeStatus: item.statusEmployee,
        //         status: item.statusHOD,
        //         formID: item.formID
		// 	}));
		// 	setAppraisals(newAppraisals);
		// })
	    // .catch(err => console.log(err));


    // const appraisals = [
    //     { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
    //     { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'svc', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
    //     { employeeID: 'Fred', employeeName: 'Freddy', department: 'manufacturing', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
    //     { employeeID: 'Fath', employeeName: 'Father Loh', department: 'manufacturing', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' },
    //     { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
    //     { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'test', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
    //     { employeeID: 'Fred', employeeName: 'Freddy', department: 'sleep', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
    //     { employeeID: 'Fath', employeeName: 'Father Loh', department: 'cry', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' },
    //     { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
    //     { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'manufacturing', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
    //     { employeeID: 'Fred', employeeName: 'Freddy', department: 'ded', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
    //     { employeeID: 'Fath', employeeName: 'Father Loh', department: 'manufacturing', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' }
    // ];

    const handleHodFillUpClick = (formID, HOD_ID, employeeName, department, type) => {
		navigate('/form', { state: { formID , staffID: HOD_ID, role: "hod", employeeName, department, type } });
	};

    return (
        <>
        {appraisals.formID === null && (
            <div className='no-actions'>
                <p>No actions are needed at this time.</p>
            </div>
        )}
        {appraisals.formID !== null && (
        <table className='hod-table'>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Purpose</th>
                    <th>Due Date</th>
                    <th>Employee Status</th>
                    <th>Status</th>
                    <th>Employee Data</th>
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
                            <td className='hod-employee-status-pending'>
                                Pending
                            </td>
                        )}
                        {appraisal.employeeStatus === 1 && (
                            <td className='hod-employee-status-submitted'>
                                Submitted
                            </td>
                        )}
                        {appraisal.status === 0 && (
                            <td className='hod-status-pending'>
                                Pending
                            </td>
                        )}
                        {appraisal.status === 1 && (
                            <td className='hod-status-submitted'>
                                Submitted
                            </td>
                        )}
                        <td className='hod-view'>
                            <button
                                className='hod-view-btn'
                                onClick={() => setShowModal(true)}
                            >
                                View    
                            </button>
                            {showModal && <Modal onClose={() => setShowModal(false)} employeeID={appraisal.employeeID} employeeName={appraisal.employeeName}/>}
                        </td>
                        <td>
                            <button
                                className={`hod-fill-up-btn ${appraisal.status === '1' ? 'disabled' : ''}`}
                                disabled={appraisal.status === '1'}
                                onClick={() => handleHodFillUpClick(appraisal.formID, HOD_ID, appraisal.employeeName, appraisal.department, appraisal.type)}
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

export default HodHomeTable;
