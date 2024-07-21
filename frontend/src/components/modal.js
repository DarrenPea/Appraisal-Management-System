import React, { useState, useEffect, useRef } from "react";
import '../css/modal.css'
import { X } from 'lucide-react';

function Modal({ onClose, employeeID, employeeName }) {
	const modalRef = useRef();
	const closeModal = (e) => {
		if(modalRef.current === e.target) {
			onClose();
		}
	};

	// const [data, setData] = useState({});

	// useEffect(() => {
	// 	const fetchData = async() => {
	// 		try {
	// 			const response = await axios.post('http://localhost:3000/employee/details', {employeeID});
	// 			const responseData = response.data;

	// 			const details = responseData.map( (item) => ({
	// 				jobFunction,
	// 				KPI,
	// 				disciplinary: item.disciplinaryRecord,
	// 				attendanceRecords: item.attendanceRecord
	// 			}));
	// 			setData(details);
	// 		} catch (error) {
	// 			console.error('Error fetching data', error);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);


	const data = { jobFunction: 'HR', KPI: '100%', disciplinary: '0', attendanceRecords: '100%' };


	return (
		<div ref={modalRef} onClick={closeModal} className="modal">
			<div className="modal-content">
				<button className="modal-close-button" onClick={onClose}><X size={20}/></button>
				<div>
					<p className="modal-employee-name">{employeeName}</p>
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
								<td className="hod-modal-title">Disciplinary Records</td>
								<td className="hod-modal-detail">{data.disciplinary}</td>
							</tr>
							<tr>
								<td className="hod-modal-title">Attendence Records</td>
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