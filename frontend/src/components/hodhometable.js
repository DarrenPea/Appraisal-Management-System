import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './modal';
import { useNavigate } from 'react-router-dom';

function HodHomeTable( { HOD_ID, name}) {
    const [showModal, setShowModal] = useState(false);
    const [currentEmployeeID, setCurrentEmployeeID] = useState(null);
    const [currentEmployeeName, setCurrentEmployeeName] = useState(null);
    const [appraisals, setAppraisals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // fetch forms for HOD using hodID
        const fetchAppraisals = async() => {
            try {
                const firstResponse = await axios.post('http://localhost:3000/form/hod/status', { hodID: HOD_ID });
                const appraisalData = firstResponse.data;
                // ensure data is in an array format
                const appraisalArray = Array.isArray(appraisalData) ? appraisalData : [appraisalData];
                
                if(appraisalArray.length === 0) {
                    setAppraisals([]);
                    return;
                }

                const staffPromises = appraisalArray.map(async (item) => {
                    try {
				        // fetch employee name and department using employeeID
                        const secondResponse = await axios.post('http://localhost:3000/employee/HR/status', { employeeID: item.employeeID});
                        const { employeeName, department } = secondResponse.data[0];
                        const new_date = new Date(item.dueDate);
                        const due_date = new_date.toISOString().split('T')[0];

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
                setAppraisals(newAppraisals.filter(item => item !== null));
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchAppraisals();
    }, [HOD_ID]);

    // handle 'View' button to view employee details
    const handleViewClick = (employeeID, employeeName) => {
        setCurrentEmployeeID(employeeID);
        setCurrentEmployeeName(employeeName);
        setShowModal(true);
    };

	// handle 'Fill up' button to bring up form
    const handleHodFillUpClick = (formID, HOD_ID, employeeName, department, type, employeeID) => {
		navigate('/form', { state: { formID , staffID: HOD_ID, role: "hod", employeeName, department, type, employeeID, staffName: name } });
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
                            {/* HOD can click on 'View' to view employee's details */}
                            <button
                                className='hod-view-btn'
                                onClick={() => handleViewClick(appraisal.employeeID, appraisal.employeeName)}
                            >
                                View
                            </button>
                        </td>
                        <td>
							{/* HOD can click on 'Fill up' if they have a 'Pending' form and the employee has already submitted. Else, disable 'Fill up' */}
                            <button
                                className={`hod-fill-up-btn ${(appraisal.status === 1 || appraisal.employeeStatus === 0) ? 'disabled' : ''}`}
                                disabled={appraisal.status === 1 || appraisal.employeeStatus === 0}
                                onClick={() => handleHodFillUpClick(appraisal.formID, HOD_ID, appraisal.employeeName, appraisal.department, appraisal.type, appraisal.employeeID)}
                            >
                                Fill up
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        )}
        {/* display employee's details in a modal */}
        {showModal && <Modal onClose={() => setShowModal(false)} employeeID={currentEmployeeID} employeeName={currentEmployeeName}/>}
        </>
    );
}

export default HodHomeTable;
