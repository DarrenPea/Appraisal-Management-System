import React, { useState, useEffect, useRef } from "react";
import '../css/modal.css'
import { X } from 'lucide-react';
import axios from "axios";

function Modal({ onClose, employeeID, employeeName }) {
	const modalRef = useRef();
	const [data, setData] = useState({});

	// close modal
	const closeModal = (e) => {
		if(modalRef.current === e.target) {
			onClose();
		}
	};

	useEffect(() => {
		// fetch employee's details like KPI using employeeID
		const fetchData = async() => {
			try {
				const response = await axios.post('http://localhost:3000/employee/details', {employeeID});
				const responseData = response.data[0];
				
				const details = {
					jobFunction: responseData.jobFunction,
					KPI: responseData.KPI,
					disciplinary: responseData.disciplinaryRecord,
					attendanceRecords: responseData.attendanceRecord
				};
				setData(details);
			} catch (error) {
				console.error('Error fetching data', error);
			}
		};

		fetchData();
	}, [employeeID]);

	return (
		<div ref={modalRef} role='dialog' onClick={closeModal} className="modal">
			<div className="modal-content">
				{/* 'X' button to close the modal */}
				<button className="modal-close-button" onClick={onClose}><X size={20}/></button>
				<div>
					<p className="modal-employee-name">{employeeName}</p>
					{/* table to display employee's details */}
					<table className='hod-modal-table'>
						<tbody>
							<tr>
								<td className="hod-modal-title">Job Function</td>
								<td className="hod-modal-detail">{data.jobFunction}</td>
							</tr>
							<tr>
								<td className="hod-modal-title">KPI</td>
								<td className="hod-modal-detail">{data.KPI}</td>
							</tr>
							<tr>
								<td className="hod-modal-title">Disciplinary Record</td>
								<td className="hod-modal-detail">{data.disciplinary}</td>
							</tr>
							<tr>
								<td className="hod-modal-title">Attendence Record</td>
								<td className="hod-modal-detail">{data.attendanceRecords}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default Modal