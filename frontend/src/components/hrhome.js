import React from 'react';
import HrHomeTable from './hrhometable';
import '../css/style_hr.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function HrHome() {
	const {state} = useLocation();
	const {staffID} = state;
	const staffIDUpper = staffID.toUpperCase();

    const navigate = useNavigate();
    const handlelogoutSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };

	return (
        <div className="hrhome-body">
            <div className="containerhr">
                <div className='home-header'>
                    <h1>WELCOME, {staffIDUpper} [HR]</h1>
                    <button className='logout-button' onClick={handlelogoutSubmit}>Logout <LogOut style={{marginLeft: '6px'}} /></button>
                </div>
                <main>
                    <div className="hr-appraisal-header">
                        <h2>Pending Appraisals:</h2>
                    </div>
                    <div className='hr-table-container'>
                    <HrHomeTable HR_ID={staffID}/>
                    </div>
                </main>
            </div>
        </div>
		
	);
}

export default HrHome;
