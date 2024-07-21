document.addEventListener('DOMContentLoaded', () => {
    const appraisal_employee = [
        { name: 'Sarah Lee', type: 'Yearly', dueDate: '11/1/24', status: 'Pending' },
    ];

    const appraisalTable_employee = document.getElementById('appraisalTable-employee');

    appraisal_employee.forEach(appraisal => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${appraisal.name}</td>
            <td>${appraisal.type}</td>
            <td>${appraisal.dueDate}</td>
            <td class="${appraisal.status === 'Pending' ? 'status-pending' : 'status-submitted'}">${appraisal.status}</td>
            <td>
                <button class="fill-up-btn" 
                        data-name="${appraisal.name}" 
                        data-type="${appraisal.type}" 
                        data-dueDate="${appraisal.dueDate}" 
                        ${appraisal.status === 'Submitted' ? 'disabled' : ''}>Fill up</button>
            </td>
        `;

        appraisalTable_employee.appendChild(row);
    });

    // Event delegation: attach the event listener to the table body
    appraisalTable_employee.addEventListener('click', function(event) {
        if (event.target.classList.contains('fill-up-btn')) {
            const name = event.target.getAttribute('data-name');
            const type = event.target.getAttribute('data-type');
            const dueDate = event.target.getAttribute('data-dueDate');

            document.getElementById('employeeName').value = name;
            document.getElementById('appraisalType').value = type;
            document.getElementById('appraisalDate').value = dueDate;

            document.getElementById('appraisalForm').classList.add('active');
        }
    });

    document.getElementById('appraisalFormForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Here you would typically handle form submission to the server

        // Get the form values
        const employeeName = document.getElementById('employeeName').value;
        const appraisalType = document.getElementById('appraisalType').value;
        const appraisalDate = document.getElementById('appraisalDate').value;
        const appraisalTime = document.getElementById('appraisalTime').value;

        // Show a confirmation popup with the details
        alert(`You have successfully added your appointment!\n\nEmployee Name: ${employeeName}\nAppraisal Type: ${appraisalType}\nAppraisal Date: ${appraisalDate}\nAppraisal Time: ${appraisalTime}`);
        
        // Hide the form and the pending appraisal row
        document.getElementById('appraisalForm').classList.remove('active');
        document.getElementById('appraisalFormForm').reset();
        document.getElementById('appraisalTable').style.display = 'none';
        
        // Show the no actions message
        document.getElementById('noActionsMessage').classList.add('active');
    });
});
