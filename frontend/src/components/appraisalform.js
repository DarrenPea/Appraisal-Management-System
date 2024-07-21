import React, { useState } from "react";
import '../css/style_appraisalform.css'
import { useLocation, useNavigate } from "react-router-dom";

function AppraisalForm() {
	const {state} = useLocation();
	const {formID, staffID, role} = state;
	const navigate = useNavigate();

	const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
	
	const [formData, setFormData] = useState({
		// add employeename and stuff for modal to display
		formID,
		a1: 'sdfdsfsdgdsg',
		a2_1: 'sdfdsfsdgdsg',
		a2_2: '',
		a2_3: '',
		a2_4: '',
		a2_5: 'dws',
		a2_6: '',
		a2_7: '',
		a2_8: '',
		a3_1: '',
		commentsA3_1: '',
		a3_2: '',
		commentsA3_2: '',
		a3_3: '3',
		commentsA3_3: '',
		a3_4: '1',
		commentsA3_4: '',
		a3_5: '',
		commentsA3_5: '',
		a3_6: '',
		commentsA3_6: '',
		a3_7: '',
		commentsA3_7: '',
		a3_8: '',
		commentsA3_8: '',
		a3_9: '',
		commentsA3_9: '',
		a3_10: '',
		commentsA3_10: '',
		a3_11: '',
		commentsA3_11: '',
		a3_12: '',
		commentsA3_12: '',
		a3_13: '',
		commentsA3_13: '',
		a3_14: '',
		commentsA3_14: '',
		a3_15: '',
		commentsA3_15: '',
		a3_16: '',
		commentsA3_16: '',
		a3_17: '',
		commentsA3_17: '',
		a3_18: '',
		commentsA3_18: '',
		a3_19: '',
		commentsA3_19: '',
		a3_20: '',
		commentsA3_20: '',
		overallRating: '',
		b: 'so im the hod'
	})

	const handleAppraisalFormChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        if (name.startsWith('a3_') && name !== 'commentsA3_') {
            const ratings = Object.keys(updatedFormData)
                .filter(key => key.startsWith('a3_') && !key.startsWith('comments'))
                .map(key => parseInt(updatedFormData[key], 10) || 0);

            const total = ratings.reduce((acc, curr) => acc + curr, 0);
            const overallScore = (total / ratings.length).toFixed(2);

            updatedFormData.overallRating = overallScore;
        }

        setFormData(updatedFormData);
    };

	const handleAppraisalSubmit = (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure you want to submit the appraisal form?")) {
            setModalVisible(true);
        }
    };
	

	// const handleAppraisalSubmit = (e) => {
	// 	e.preventDefault();



	// 	navigate('/form', { state: { formID , role: "hod"} });

	


	// 	// call axios here to post answers
	// }


	const handleConfirm = () => {
        setModalVisible(false);
        setIsSubmitted(true);


		// checking
		console.log(formData);

		navigate(`/${role}`, {state: {staffID}});

        // call axios here to post answers
		
        // axios.post('/api/submitForm', formData)
        //     .then(response => {
        //         console.log("Form submitted successfully:", response);

        //         // Reset form data
        //         setFormData({
        //             formID: formID || '',
        //             a1: "",
        //             a2_1: "",
        //             a2_2: "",
        //             a2_3: "",
        //             a2_4: "",
        //             a2_5: "",
        //             a2_6: "",
        //             a2_7: "",
        //             a2_8: ""
        //         });

        //         // Redirect to EmployeeHome with state indicating update
        //         navigate('/employee', { state: { updated: true, formID: formData.formID } });
        //     })
        //     .catch(error => {
        //         console.error("Error submitting form:", error);
        //     });
    };

	const handleCloseModal = () => {
        setModalVisible(false);
    };


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
					<h1>Appraisal Form</h1>
					<h2>{formData.formID} (to check)</h2>
				</header>
				<main>
					<div className="appraisal-form-container">
						<form className="appraisal-form" id="appraisal-form" onSubmit={handleAppraisalSubmit}>

							<h3>A1 Role & Responsibilities</h3>
							{role === 'employee' && (
								<>
								<label htmlFor="a1">A1 Elaborate your understanding of your primary role and responsibilities:</label>
								<textarea id="a1" name="a1" rows="5" value={formData.a1} onChange={handleAppraisalFormChange} required></textarea>
								</>
							)}
							{(role === 'hod' || role === 'hr') && (
								<>
								<label htmlFor="a1">A1 Elaborate your understanding of your primary role and responsibilities:</label>
								<p className="employee_section_a1" id="a1" name="a1">{formData.a1}</p>
								</>
							)}

							<h3>A2 Discussion</h3>
							{role === 'employee' && (
								<>
								{['a2_1', 'a2_2', 'a2_3', 'a2_4', 'a2_5', 'a2_6', 'a2_7', 'a2_8'].map((field, index) => (
									<div key={index} className="appraisal-a2-div">
										<label htmlFor={field}>{a2Labels[index]}</label>
										<textarea id={field} name={field} rows="5" value={formData[field]} onChange={handleAppraisalFormChange} required></textarea>
									</div>
								))}
								</>
							)}
							{(role === 'hod' || role === 'hr') && (
								<>
								{['a2_1', 'a2_2', 'a2_3', 'a2_4', 'a2_5', 'a2_6', 'a2_7', 'a2_8'].map((field, index) => (
									<div key={index} className="appraisal-a2-div">
										<label htmlFor={field}>{a2Labels[index]}</label>
										<p className="employee_section_a2" id={field} name={field}>{formData[field]}</p>
									</div>
								))}
								</>
							)}
								
								
							{/* <label htmlFor="a2_1">A2.1 Elaborate if the past year been good/bad/satisfactory for you:</label>
							<textarea id="a2_1" name="a2_1" rows="5" required></textarea>

							<label htmlFor="a2_2">A2.2 What do you consider to be your most important achievements of the past months/years:</label>
							<textarea id="a2_2" name="a2_2" rows="5" required></textarea>

							<label htmlFor="a2_3">A2.3 What elements of your job do you find most difficult and challenging:</label>
							<textarea id="a2_3" name="a2_3" rows="5" required></textarea>

							<label htmlFor="a2_4">A2.4 What do you consider to be your most important goal and objective for next year:</label>
							<textarea id="a2_4" name="a2_4" rows="5" required></textarea>

							<label htmlFor="a2_5">A2.5 What recommendable action could be taken by you and/or your boss to improve your performance in your current function:</label>
							<textarea id="a2_5" name="a2_5" rows="5" required></textarea>

							<label htmlFor="a2_6">A2.6 What kind of work do you like to doing in one/three/five years' time:</label>
							<textarea id="a2_6" name="a2_6" rows="5" required></textarea>

							<label htmlFor="a2_7">A2.7 What kind of training/experience would develop your strength which will benefit you and your work in the next year?: </label>
							<textarea id="a2_7" name="a2_7" rows="5" required></textarea>
							
							<label htmlFor="a2_8">A2.8 List the objectives you set out to achieve in the past 12 months (or the period covered by this appraisal) with the measures or standards agreed - against each comment on achievement or otherwise, with reasons where appropriate. Score the performance against each objective as per below Section A3 rating:</label>
							<textarea id="a2_8" name="a2_8" rows="5" required></textarea> */}


							<h3>A3 Evaluating your own capability:</h3>
							<h4>Score your own capability or knowledge in the following areas in terms of your current function requirements. If appropriate provide evidence to the appraisal to support your assessment</h4>
							<h5>1 = Poor | 2 = Fair | 3 = Satisfactory | 4 = Good | 5 = Excellent</h5>

							<div className="rating-section">
								{role === 'employee' && (
									<>
									{Array.from({ length: ratingLabels.length }, (_, index) => {
										const field = `a3_${index + 1}`;
										
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
								{(role === 'hod' || role === 'hr') && (
									<>
									{/* {Array.from({ length: ratingLabels.length }, (_, index) => {
										const field = `a3_${index + 1}`;
										
										return ( */}
											<div className="rating-row-nonemployee">
												<table className="rating-table-view">
												<tbody>
												{['a3_1', 'a3_2', 'a3_3', 'a3_4', 'a3_5', 'a3_6', 'a3_7', 'a3_8', 'a3_9', 'a3_10', 'a3_11', 'a3_12', 'a3_13', 'a3_14', 'a3_15'].map((field, index) => (
													<tr key={field}>
														<td className="rating-label-view">{ratingLabels[index]}</td>
														<td className="rating-answer-view">{formData[field]}</td>


														{/* <label htmlFor={field}>{a2Labels[index]}</label>
														<text className="employee_section_a2" id={field} name={field}>{formData[field]}</text> */}
													</tr>
												))}
													{/* <tr>
														<td className="rating-label-view">Job Function</td>
														<td className="rating-answer-view">{data.jobFunction}</td>
													</tr>
													<tr>
														<td className="rating-label-view">KPI</td>
														<td className="rating-answer-view">{data.KPI}</td>
													</tr>
													<tr>
														<td className="rating-label-view">Disciplinary Records</td>
														<td className="rating-answer-view">{data.disciplinary}</td>
													</tr>
													<tr>
														<td className="rating-label-view">Attendence Records</td>
														<td className="rating-answer-view">{data.attendanceRecords}</td>
													</tr> */}
												</tbody>
												</table>
												{/* <label className="rating-label">{ratingLabels[index]}</label>
												<text className="employee_section_a3" id={field} name={field}>{formData[field]}</text> */}
											</div>
										{/* ); */}
									{/* })} */}
									</>
								)}

								
								
								{/* <div className="rating-row">
									<label htmlFor="a3_1" className="rating-label">Corporate Responsibility & Ethics</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_1" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_1" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_1" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_1" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_1" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_2" className="rating-label">Job/Technical Knowledge</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_2" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_2" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_2" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_2" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_2" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>
								
								<div className="rating-row">
									<label htmlFor="a3_3" className="rating-label">Time Management</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_3" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_3" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_3" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_3" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_3" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_4" className="rating-label">Planning, Budgeting and Forecasting</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_4" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_4" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_4" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_4" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_4" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_5" className="rating-label">Reporting & Administrative Skills</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_5" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_5" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_5" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_5" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_5" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_6" className="rating-label">Delegation Skills</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_6" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_6" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_6" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_6" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_6" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_7" className="rating-label">Problem Solving & Decision Making</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_7" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_7" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_7" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_7" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_7" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_8" className="rating-label">Meeting Deadlines/Commitments</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_8" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_8" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_8" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_8" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_8" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_9" className="rating-label">Work Creativity</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_9" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_9" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_9" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_9" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_9" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_10" className="rating-label">Team-working and Developing Others</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_10" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_10" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_10" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_10" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_10" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_11" className="rating-label">Work Initiative</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_11" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_11" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_11" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_11" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_11" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_12" className="rating-label">Energy, Determination and Work-Rate</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_12" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_12" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_12" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_12" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_12" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_13" className="rating-label">Work Responsibility</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_13" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_13" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_13" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_13" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_13" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_14" className="rating-label">Steadiness under Pressure</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_14" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_14" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_14" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_14" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_14" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_15" className="rating-label">Leadership and Integrity</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_15" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_15" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_15" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_15" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_15" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_16" className="rating-label">Adaptability, Flexibility and Mobility</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_16" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_16" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_16" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_16" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_16" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_17" className="rating-label">IT/Equipment/Machinery Skill</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_17" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_17" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_17" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_17" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_17" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_18" className="rating-label">Communication Skills</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_18" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_18" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_18" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_18" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_18" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_19" className="rating-label">Personal Appearance and image</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_19" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_19" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_19" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_19" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_19" value="5" />
											<span>5</span>
										</label>
									</div>
								</div>

								<div className="rating-row">
									<label htmlFor="a3_20" className="rating-label">Attendance/Punctuality</label>
									<div className="rating-options">
										<label>
											<input type="radio" name="a3_20" value="1" required /> 
											<span>1</span>
										</label>
										<label>
											<input type="radio" name="a3_20" value="2" />
											<span>2</span>
										</label>
										<label>
											<input type="radio" name="a3_20" value="3" />
											<span>3</span>
										</label>
										<label>
											<input type="radio" name="a3_20" value="4" />
											<span>4</span>
										</label>
										<label>
											<input type="radio" name="a3_20" value="5" />
											<span>5</span>
										</label>
									</div>
								</div> */}

								<div className="overall-score">
                                    <label htmlFor="overallRating">Overall Rating:</label>
                                    <p className="overallRating">{`${formData.overallRating} / 5`}</p>
                                </div>
								
							</div>

							
							{(role === 'hod') && (
								<>
								<h3>Evaluation</h3>
								<label htmlFor="b">Describe the purpose of the appraiser's job function. Review and discuss self-appraisal entries; appraiser's career direction options and wishes. Aprpaiser may like to discuss on specific objectives that will enable the appraisee to reach competence and to meet required performance in cuurent job, or achieve readiness for, the next job level/type, or if no particular next role is identified or sought, to achieve the desired personal growth or experience. These objectives must adhere to the SMARTER rules - specific, measurable, agreed, realistic, time-bound, ethical, recorded. Training and development support maybe discuss to help the appraisee to meet the agreed objectives above. Other issues maybe covered (if any).</label>
								<textarea id='b' name='b' rows="5" value={formData.b} onChange={handleAppraisalFormChange} required></textarea>
								</>
							)}

							{role === 'hr' && (
								<>
								<h3>Evaluation</h3>
								<label htmlFor="b">Describe the purpose of the appraiser's job function. Review and discuss self-appraisal entries; appraiser's career direction options and wishes. Aprpaiser may like to discuss on specific objectives that will enable the appraisee to reach competence and to meet required performance in cuurent job, or achieve readiness for, the next job level/type, or if no particular next role is identified or sought, to achieve the desired personal growth or experience. These objectives must adhere to the SMARTER rules - specific, measurable, agreed, realistic, time-bound, ethical, recorded. Training and development support maybe discuss to help the appraisee to meet the agreed objectives above. Other issues maybe covered (if any).</label>
								<p className='hod-section-b' id='b' name='b'>{formData.b}</p>
								
								<button className="hr-ok-btn" type="submit">OK</button>
								</>
							)}
							{(role === 'employee' || role === 'hod') && (
								<button type="submit">Submit</button>
							)}						</form>
					</div>
				</main>
			</div>

			{modalVisible && (
                <div className="modal-confirm-form">
                    <div className="modal-confirm-form-content">
                        <span className="close-confirm-form" onClick={handleCloseModal}>&times;</span>
                        <h2>Submission Details</h2>
                        <p>Employee Name: amy</p>
                        <p>Employee ID: j123</p>
                        <p>Appraisal Date: 123123</p>
                        <p>Position: 123</p>
                        <p>Appraisal Type: dsfyear</p>
                        <button className="close-confirm-form-btn" onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            )}

		</div>
	);
}

export default AppraisalForm;