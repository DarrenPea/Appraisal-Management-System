import React from 'react';
import EmployeeHomeTable from './employeehometable';
import '../css/style_employee.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function EmployeeHome() {
	const {state} = useLocation();
	const {staffID, name} = state;
	const nameUpper = name.toUpperCase();

    const navigate = useNavigate();
    const handlelogoutSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };
	
    return (
        <div className='employeehome-body'>
            <div className="containeremployee">
                <div className='home-header'>
                    <h1>WELCOME, {nameUpper} [EMPLOYEE]</h1>
                    <button className='logout-button' onClick={handlelogoutSubmit}>Logout <LogOut style={{marginLeft: '6px'}} /></button>
                </div>
                <main>
                    <div className="employee-appraisal-header">
                        <h2>Pending Appraisals:</h2>
                    </div>
                    <div className='employee-table-container'>
                        <EmployeeHomeTable staffID={staffID} name={name} />
                    </div>
                </main>
            </div>
        </div>
        
    );
}

export default EmployeeHome;
