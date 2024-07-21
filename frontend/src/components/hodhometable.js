import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './modal';
import AppraisalForm from './appraisalform';
import { useNavigate } from 'react-router-dom';

function HodHomeTable( { HOD_ID }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // uncomment!!!!!
    // const [appraisals, setAppraisals] = useState([]);

    // useEffect(() => {
        //STOPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP



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
        // const fetchAppraisals = async() => {
        //     try {
        //         const firstResponse = await axios.post('http://localhost:3000/form/HOD/status', { HOD_ID });
        //         const appraisalData = firstResponse.data;

        //         const staffPromises = appraisalData.map(async (item) => {
        //             const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: item.employeeID});
        //             const { employeeName, department } = secondResponse.data;
        //             return {
        //                 employeeID: item.employeeID,
        //                 employeeName,
        //                 department,
        //                 type: item.appraisalType,
        //                 dueDate: item.dueDate,
        //                 employeeStatus: item.statusEmployee,
        //                 status: item.statusHOD,
        //                 formID: item.formID
        //             };
        //         });
                
        //         const newAppraisals = await Promise.all(staffPromises);
        //         setAppraisals(newAppraisals);
        //     } catch (error) {
        //         console.error('Error fetching data', error);
        //     }
        // };

        // fetchAppraisals();

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

    //remove this
  	// }, [HOD_ID]);


    const appraisals = [
        { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
        { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'svc', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
        { employeeID: 'Fred', employeeName: 'Freddy', department: 'manufacturing', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
        { employeeID: 'Fath', employeeName: 'Father Loh', department: 'manufacturing', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' },
        { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
        { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'test', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
        { employeeID: 'Fred', employeeName: 'Freddy', department: 'sleep', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
        { employeeID: 'Fath', employeeName: 'Father Loh', department: 'cry', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' },
        { employeeID: 'Sara', employeeName: 'Sarah Lee', department: 'manufacturing', type: 'Yearly', dueDate: '11/1/24', employeeStatus: 'Submitted', status: 'Pending', formID: '1'},
        { employeeID: 'Lebro', employeeName: 'Lebron James', department: 'manufacturing', type: 'Confirmation', dueDate: '12/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '2' },
        { employeeID: 'Fred', employeeName: 'Freddy', department: 'ded', type: 'Yearly', dueDate: '13/2/24', employeeStatus: 'Submitted', status: 'Submitted', formID: '3' },
        { employeeID: 'Fath', employeeName: 'Father Loh', department: 'manufacturing', type: 'Yearly', dueDate: '14/2/24', employeeStatus: 'Pending', status: 'Pending', formID: '4' }
    ];

    const handleHodFillUpClick = (formID, HOD_ID, employeeName, department, type) => {
		navigate('/form', { state: { formID , staffID: HOD_ID, role: "hod", employeeName, department, type } });
	};

    return (
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
                        <td className={appraisal.employeeStatus === 'Pending' ? 'hod-employee-status-pending' : 'hod-employee-status-submitted'}>
                            {appraisal.employeeStatus}
                        </td>
                        <td className={appraisal.status === 'Pending' ? 'hod-status-pending' : 'hod-status-submitted'}>
                            {appraisal.status}
                        </td>
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
                                className={`hod-fill-up-btn ${appraisal.status === 'Submitted' ? 'disabled' : ''}`}
                                disabled={appraisal.status === 'Submitted'}
                                onClick={() => handleHodFillUpClick(appraisal.formID, HOD_ID, appraisal.employeeName, appraisal.department, appraisal.type)}
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

export default HodHomeTable;
