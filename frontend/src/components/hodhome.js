import React from 'react';
import HodHomeTable from './hodhometable';
import '../css/style_hod.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function HodHome() {
	const {state} = useLocation();
	const {staffID} = state;
	const staffIDUpper = staffID.toUpperCase();

    const navigate = useNavigate();
    const handlelogoutSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };
    
    return (
        <div className="containerhod">
            <div className='home-header'>
                <h1>WELCOME, {staffIDUpper} [HOD]</h1>
                <button className='logout-button' onClick={handlelogoutSubmit}>Logout <LogOut style={{marginLeft: '6px'}} /></button>
            </div>
            <main>
                <div className="hod-appraisal-header">
                    <h2>Pending Appraisals:</h2>
                </div>
                <div className='hod-table-container'>
                    <HodHomeTable HOD_ID={staffID}/>
                </div>
            </main>
        </div>
    );
}

export default HodHome;
