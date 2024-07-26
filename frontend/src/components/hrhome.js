import React from 'react';
import HrHomeTable from './hrhometable';
import '../css/style_hr.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function HrHome() {
	const {state} = useLocation();
	const {staffID, name} = state;
	const nameUpper = name.toUpperCase();
    const navigate = useNavigate();

    // clicking 'Logout' button
    const handlelogoutSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };

	return (
        <div className="hrhome-body">
            <div className="containerhr">
                <div className='home-header'>
                    <h1>WELCOME, {nameUpper} [HR]</h1>
                    <button className='logout-button' onClick={handlelogoutSubmit}>Logout <LogOut style={{marginLeft: '6px'}} /></button>
                </div>
                <main>
                    <div className="hr-appraisal-header">
                        <h2>Pending Appraisals</h2>
                    </div>
                    <div className='hr-table-container'>
                        {/* display all forms due this month and the previous month */}
                        <HrHomeTable HR_ID={staffID} name={name} />
                    </div>
                </main>
            </div>
        </div>
		
	);
}

export default HrHome;
