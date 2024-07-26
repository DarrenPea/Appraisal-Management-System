import React from 'react';
import HodHomeTable from './hodhometable';
import '../css/style_hod.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function HodHome() {
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
        <div className='hodhome-body'>
            <div className="containerhod">
                <div className='home-header'>
                    <h1>WELCOME, {nameUpper} [HOD]</h1>
                    <button className='logout-button' onClick={handlelogoutSubmit}>Logout <LogOut style={{marginLeft: '6px'}} /></button>
                </div>
                <main>
                    <div className="hod-appraisal-header">
                        <h2>Pending Appraisals</h2>
                    </div>
                    <div className='hod-table-container'>
                        {/* displaying table based on forms assigned to employees under the HOD  */}
                        <HodHomeTable HOD_ID={staffID} name={name} />
                    </div>
                </main>
            </div>
        </div>
        
    );
}

export default HodHome;
