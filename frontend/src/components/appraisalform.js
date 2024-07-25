import React, { useEffect, useState } from "react";
import '../css/style_appraisalform.css'
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AppraisalForm() {
	const {state} = useLocation();
	const {formID, staffID, role, employeeName, department, type, staffName, employeeID} = state;
	const navigate = useNavigate();

	const [modalVisible, setModalVisible] = useState(false);
	const [details, setDetails] = useState({});
	
	const [formData, setFormData] = useState({
		formID,
		A1: '',
		A2_1: '',
		A2_2: '',
		A2_3: '',
		A2_4: '',
		A2_5: '',
		A2_6: '',
		A2_7: '',
		A2_8: '',
		A3_1: '',
		CommentsA3_1: '',
		A3_2: '',
		CommentsA3_2: '',
		A3_3: '',
		CommentsA3_3: '',
		A3_4: '',
		CommentsA3_4: '',
		A3_5: '',
		CommentsA3_5: '',
		A3_6: '',
		CommentsA3_6: '',
		A3_7: '',
		CommentsA3_7: '',
		A3_8: '',
		CommentsA3_8: '',
		A3_9: '',
		CommentsA3_9: '',
		A3_10: '',
		CommentsA3_10: '',
		A3_11: '',
		CommentsA3_11: '',
		A3_12: '',
		CommentsA3_12: '',
		A3_13: '',
		CommentsA3_13: '',
		A3_14: '',
		CommentsA3_14: '',
		A3_15: '',
		CommentsA3_15: '',
		A3_16: '',
		CommentsA3_16: '',
		A3_17: '',
		CommentsA3_17: '',
		A3_18: '',
		CommentsA3_18: '',
		A3_19: '',
		CommentsA3_19: '',
		A3_20: '',
		CommentsA3_20: '',
		overallRating: '',
		B: ''
	})

	useEffect(() => {
		// fetch employee details like KPI based on employee ID
		const fetchDetails = async() => {
			try {
				const responseDetails = await axios.post('http://localhost:3000/employee/details', {employeeID});
				const responseDetailsData = responseDetails.data[0];

				const details = {
					jobFunction: responseDetailsData.jobFunction,
					KPI: responseDetailsData.KPI,
					disciplinary: responseDetailsData.disciplinaryRecord,
					attendanceRecords: responseDetailsData.attendanceRecord
				};
				setDetails(details);
			} catch (error) {
				console.error('Error fetching data', error);
			}
		}

		// fetch form based on ID
		const fetchOriginalForm = async() => {
			try {
				const originalFormResponse = await axios.post('http://localhost:3000/form/retrieve', { formID });
				const originalFormResponseData = originalFormResponse.data[0];

				const replaceNullWithEmptyString = (data) => {
					const result = {};
					for (const key in data) {
						if (data[key] === null) {
							result[key] = "";
						} else {
							result[key] = data[key];
						}
					}
					return result;
				};

				const cleanedForm = replaceNullWithEmptyString(originalFormResponseData);

				const originalForm = {
					formID,
					A1: cleanedForm.A1,
					A2_1: cleanedForm.A2_1,
					A2_2: cleanedForm.A2_2,
					A2_3: cleanedForm.A2_3,
					A2_4: cleanedForm.A2_4,
					A2_5: cleanedForm.A2_5,
					A2_6: cleanedForm.A2_6,
					A2_7: cleanedForm.A2_7,
					A2_8: cleanedForm.A2_8,
					A3_1: cleanedForm.A3_1,
					CommentsA3_1: cleanedForm.CommentsA3_1,
					A3_2: cleanedForm.A3_2,
					CommentsA3_2: cleanedForm.CommentsA3_2,
					A3_3: cleanedForm.A3_3,
					CommentsA3_3: cleanedForm.CommentsA3_3,
					A3_4: cleanedForm.A3_4,
					CommentsA3_4: cleanedForm.CommentsA3_4,
					A3_5: cleanedForm.A3_5,
					CommentsA3_5: cleanedForm.CommentsA3_5,
					A3_6: cleanedForm.A3_6,
					CommentsA3_6: cleanedForm.CommentsA3_6,
					A3_7: cleanedForm.A3_7,
					CommentsA3_7: cleanedForm.CommentsA3_7,
					A3_8: cleanedForm.A3_8,
					CommentsA3_8: cleanedForm.CommentsA3_8,
					A3_9: cleanedForm.A3_9,
					CommentsA3_9: cleanedForm.CommentsA3_9,
					A3_10: cleanedForm.A3_10,
					CommentsA3_10: cleanedForm.CommentsA3_10,
					A3_11: cleanedForm.A3_11,
					CommentsA3_11: cleanedForm.CommentsA3_11,
					A3_12: cleanedForm.A3_12,
					CommentsA3_12: cleanedForm.CommentsA3_12,
					A3_13: cleanedForm.A3_13,
					CommentsA3_13: cleanedForm.CommentsA3_13,
					A3_14: cleanedForm.A3_14,
					CommentsA3_14: cleanedForm.CommentsA3_14,
					A3_15: cleanedForm.A3_15,
					CommentsA3_15: cleanedForm.CommentsA3_15,
					A3_16: cleanedForm.A3_16,
					CommentsA3_16: cleanedForm.CommentsA3_16,
					A3_17: cleanedForm.A3_17,
					CommentsA3_17: cleanedForm.CommentsA3_17,
					A3_18: cleanedForm.A3_18,
					CommentsA3_18: cleanedForm.CommentsA3_18,
					A3_19: cleanedForm.A3_19,
					CommentsA3_19: cleanedForm.CommentsA3_19,
					A3_20: cleanedForm.A3_20,
					CommentsA3_20: cleanedForm.CommentsA3_20,
					overallRating: cleanedForm.overallRating,
					B: cleanedForm.B
				};
				setFormData(originalForm);
			} catch (error) {
				console.log('Error fetching data', error);
			}
		};
		
		if(role === 'hod') {
			fetchDetails();
		}
		fetchOriginalForm();

	}, [formID, employeeID, role]);

	// handle changes in form data
	const handleAppraisalFormChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        if (name.startsWith('A3_') && name !== 'commentsA3_') {
            const ratings = Object.keys(updatedFormData)
                .filter(key => key.startsWith('A3_') && !key.startsWith('comments'))
                .map(key => parseInt(updatedFormData[key], 10) || 0);

            const total = ratings.reduce((acc, curr) => acc + curr, 0);
            const overallScore = (total / ratings.length).toFixed(2);

            updatedFormData.overallRating = overallScore;
        }

        setFormData(updatedFormData);
    };

	// handles 'OK' button for HR, lead back to home
	const handleAppraisalOK = (e) => {
		e.preventDefault();
		navigate('/hr', {state: {staffID, name: staffName}});
	}

	// handles 'Submit' button for employee and HOD + post form data
	const handleAppraisalSubmit = (e) => {
		e.preventDefault();

		if (window.confirm("Are you sure you want to submit the appraisal form?")) {
			if(role === 'employee') {
				axios.post('http://localhost:3000/form/employee/submit', formData)
				.then(setModalVisible(true));
			}
			if(role === 'hod') {
				axios.post('http://localhost:3000/form/hod/submit', formData)
				.then(setModalVisible(true));
			}
        }
	}

	// handles 'OK' button for employee and HOD, lead back to home
	const handleConfirm = () => {
        setModalVisible(false);

		if(role === 'employee') {
			navigate('/employee', {state: {staffID, name: staffName}});
		}
		if(role === 'hod') {
			navigate('/hod', {state: {staffID, name: staffName}});
		}
    };

	// closes 'Form Submitted' modal
	const handleCloseModal = () => {
        setModalVisible(false);
    };

	// questions for A2 section
	const a2Labels = [
		"A2.1 Elaborate if the past year been good/bad/satisfactory for you:",
		"A2.2 What do you consider to be your most important achievements of the past months/years:",
		"A2.3 What elements of your job do you find most difficult and challenging:",
		"A2.4 What do you consider to be your most important goal and objective for next year:",
		"A2.5 What recommendable action could be taken by you and/or your boss to improve your performance in your current function:",
		"A2.6 What kind of work do you like to doing in one/three/five years' time:",
		"A2.7 What kind of training/experience would develop your strength which will benefit you and your work in the next year?:",
		"A2.8 List the objectives you set out to achieve in the past 12 months (or the period covered by this appraisal) with the measures or standards agreed - against each comment on achievement or otherwise, with reasons where appropriate. Score the performance against each objective as per below Section A3 rating:"
	]

	// aspects to be rated for A3 section
	const ratingLabels = [
		"Corporate Responsibility & Ethics",
		"Job/Technical Knowledge",
		"Time Management",
		"Planning, Budgeting and Forecasting",
		"Reporting & Administrative Skills",
		"Delegation Skills",
		"Problem Solving & Decision Making",
		"Meeting Deadlines/Commitments",
		"Work Creativity",
		"Team-working and Developing Others",
		"Work Initiative",
		"Energy, Determination and Work-Rate",
		"Work Responsibility",
		"Steadiness under Pressure",
		"Leadership and Integrity",
		"Adaptability, Flexibility and Mobility",
		"IT/Equipment/Machinery Skill",
		"Communication Skills",
		"Personal Appearance and image",
		"Attendance/Punctuality"
	]

	return (
		<div className="appraisal-body">
			<div className="appraisal-form-page">

				<header>
					<h1>Appraisal Form ID: {formData.formID}</h1>
				</header>
				{role === 'employee' && (
				<div className="appraisal-employee-details">
					<h3>Name: {employeeName}</h3>
					<h3>Department: {department}</h3>
				</div>
				)}
				{role === 'hr' && (
				<div className="appraisal-employee-details">
					<h3>Name: {employeeName}</h3>
					<div className="appraisal-employee-finer">
						<h4>Department: {department}</h4>
						<h4>Purpose: {type}</h4>
					</div>
				</div>
				)}
				{role === 'hod' && (
				<div className="appraisal-employee-details">
					<h2>Employee Details</h2>
					<h3>Employee Name: {employeeName}</h3>
					<div className="appraisal-employee-finer">
						<h4>Department: {department}</h4>
						<h4>Purpose: {type}</h4>
					</div>
					
					{/* display employee's details */}
					<table className="appraisal-employee-details-table">
						<thead>
							<tr>
								<th className="appraisal-job">Job Function</th>
								<th className="appraisal-kpi">KPI</th>
								<th className="appraisal-disciplinary">Disciplinary Record</th>
								<th className="appraisal-attendance">Attendance Record</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{details.jobFunction}</td>
								<td>{details.KPI}</td>
								<td>{details.disciplinary}</td>
								<td>{details.attendanceRecords}</td>
							</tr>
						</tbody>
					</table>
				</div>
				)}


				<main>
					<div className="appraisal-form-container">
						{/* creating a form */}
						<form className="appraisal-form" id="appraisal-form" onSubmit={handleAppraisalSubmit}>

							{/* A1 section */}
							<h3>A1 Role & Responsibilities</h3>

							{/* employee to fill up A1 */}
							{role === 'employee' && (
								<>
								<label htmlFor="A1">A1 Elaborate your understanding of your primary role and responsibilities:</label>
								<textarea id="A1" name="A1" rows="5" value={formData.A1} onChange={handleAppraisalFormChange} required></textarea>
								</>
							)}
							{/* HOD and HR to view employee's response */}
							{(role === 'hod' || role === 'hr') && (
								<>
								<label htmlFor="A1">A1 Elaborate your understanding of your primary role and responsibilities:</label>
								<p className="employee_section_a1" id="A1" name="A1">{formData.A1}</p>
								</>
							)}

							{/* A2 section */}
							<h3>A2 Discussion</h3>
							{/* employee to fill up A2 */}
							{role === 'employee' && (
								<>
								{['A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8'].map((field, index) => (
									<div key={index} className="appraisal-a2-div">
										<label htmlFor={field}>{a2Labels[index]}</label>
										<textarea id={field} name={field} rows="5" value={formData[field]} onChange={handleAppraisalFormChange} required></textarea>
									</div>
								))}
								</>
							)}
							{/* HOD and HR to view employee's response */}
							{(role === 'hod' || role === 'hr') && (
								<>
								{['A2_1', 'A2_2', 'A2_3', 'A2_4', 'A2_5', 'A2_6', 'A2_7', 'A2_8'].map((field, index) => (
									<div key={index} className="appraisal-a2-div">
										<label htmlFor={field}>{a2Labels[index]}</label>
										<p className="employee_section_a2" id={field} name={field}>{formData[field]}</p>
									</div>
								))}
								</>
							)}

							{/* A3 section */}
							<h3>A3 Evaluating your own capability:</h3>
							<h4>Score your own capability or knowledge in the following areas in terms of your current function requirements. If appropriate provide evidence to the appraisal to support your assessment</h4>
							<h5>1 = Poor | 2 = Fair | 3 = Satisfactory | 4 = Good | 5 = Excellent</h5>

							<div className="rating-section">
								{/* employee to rate themselves on various aspects from a scale of 1 to 5 */}
								{role === 'employee' && (
									<>
									{Array.from({ length: ratingLabels.length }, (_, index) => {
										const field = `A3_${index + 1}`;
										return (
											<div key={index} className="rating-row">
												<label className="rating-label">{ratingLabels[index]}</label>
												<div className="rating-options">
													{[1, 2, 3, 4, 5].map(value => (
														<label key={value}>
															<input type="radio" name={field} value={value} onChange={handleAppraisalFormChange} required />
															<span>{value}</span>
														</label>
													))}
												</div>
											</div>
										);
									})}
									</>
								)}
								{/* HOD to view employee's response and can choose to leave comments on the individual aspects */}
								{(role === 'hod') && (
									<>
									{Array.from({ length: ratingLabels.length }, (_, index) => {
										const field = `CommentsA3_${index + 1}`;

										return (
											<div key={index} className="rating-row-nonemployee">
												<div className="individual-rating-nonemployee">
													<p>{ratingLabels[index]}: {formData[`A3_${index + 1}`]}</p>
												</div>
												<textarea className='individual-rating-input' id={field} name={field} rows="2" value={formData[field]} onChange={handleAppraisalFormChange}></textarea>
											</div>
										);
									})}
									</>
								)}
								{/* HR to view employee's response and HOD's comments on the individual aspects */}
								{(role === 'hr') && (
									<>
									{Array.from({ length: ratingLabels.length }, (_, index) => {
										const field = `CommentsA3_${index + 1}`;

										return (
											<div key={index} className="rating-row-nonemployee">
												<div className="individual-rating-nonemployee">
													<p>{ratingLabels[index]}: {formData[`A3_${index + 1}`]}</p>
												</div>
												<p className='individual-rating-text' id={field} name={field} >{formData[field]}</p>
											</div>
										);
									})}
									</>
								)}

								{/* display the cumulative overall score for A3 section */}
								{role === 'employee' && (
								<div className="overall-score">
									<label htmlFor="overallRating">Overall Rating:</label>
									<p className="overallRating">{formData.overallRating === null ? 0 : `${formData.overallRating} / 5`}</p>
								</div>
								)}
								{(role === 'hod' || role === 'hr') && (
								<div className="overall-score-nonemployee">
									<label htmlFor="overallRating">Overall Rating:</label>
									<p className="overallRating">{formData.overallRating === null ? 0 : `${formData.overallRating} / 5`}</p>
								</div>
								)}
							</div>


							{/* evaluation section, not available to employee */}
							{/* HOD can evaluate the employee */}
							{(role === 'hod') && (
								<>
								<h3>Evaluation</h3>
								<label htmlFor="B">Describe the purpose of the appraiser's job function. Review and discuss self-appraisal entries; appraiser's career direction options and wishes. Aprpaiser may like to discuss on specific objectives that will enable the appraisee to reach competence and to meet required performance in cuurent job, or achieve readiness for, the next job level/type, or if no particular next role is identified or sought, to achieve the desired personal growth or experience. These objectives must adhere to the SMARTER rules - specific, measurable, agreed, realistic, time-bound, ethical, recorded. Training and development support maybe discuss to help the appraisee to meet the agreed objectives above. Other issues maybe covered (if any).</label>
								<textarea id='B' name='B' rows="5" value={formData.B} onChange={handleAppraisalFormChange} required></textarea>
								</>
							)}
							{/* HR can view the evaluation left by HOD */}
							{role === 'hr' && (
								<>
								<h3>Evaluation</h3>
								<label htmlFor="b">Describe the purpose of the appraiser's job function. Review and discuss self-appraisal entries; appraiser's career direction options and wishes. Aprpaiser may like to discuss on specific objectives that will enable the appraisee to reach competence and to meet required performance in cuurent job, or achieve readiness for, the next job level/type, or if no particular next role is identified or sought, to achieve the desired personal growth or experience. These objectives must adhere to the SMARTER rules - specific, measurable, agreed, realistic, time-bound, ethical, recorded. Training and development support maybe discuss to help the appraisee to meet the agreed objectives above. Other issues maybe covered (if any).</label>
								<p className='hod-section-b' id='b' name='b'>{formData.B}</p>
								{/* 'OK' button to close the form */}
								<button className="hr-ok-btn" onClick={handleAppraisalOK}>OK</button>
								</>
							)}
							{/* employee and HOD to submit their forms */}
							{(role === 'employee' || role === 'hod') && (
								<button className='appraisal-form-submit-btn' type="submit">Submit</button>
							)}						
						</form>
					</div>
				</main>
			</div>

			{/* modal that shows employee/HOD that they submitted the form */}
			{modalVisible && (
                <div className="modal-confirm-form">
                    <div className="modal-confirm-form-content">
                        <span className="close-confirm-form" onClick={handleCloseModal}>&times;</span>
							<>
							<h2>Form Submitted</h2>
							<h2>Details</h2>
							{role === 'employee' && (
								<p>Name: {employeeName}</p>
							)}
							{(role === 'hod' || role === 'hr') && (
								<p>Employee Name: {employeeName}</p>
							)}
							<p>Department: {department}</p>
							<p>Purpose: {type}</p>
							</>
						{/* 'OK' button to close the form */}
                        <button className="close-confirm-form-btn" onClick={handleConfirm}>OK</button>
                    </div>
                </div>
            )}

		</div>
	);
}

export default AppraisalForm;