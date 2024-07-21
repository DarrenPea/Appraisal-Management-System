document.addEventListener('DOMContentLoaded', () => {
    const appraisals = [
        { name: 'Sarah Lee', type: 'Yearly', dueDate: '11/1/24', status: 'Pending' },
        { name: 'Lebron James', type: 'Confirmation', dueDate: '12/2/24', status: 'Submitted' },
        { name: 'Freddy', type: 'Yearly', dueDate: '13/2/24', status: 'Submitted' },
        { name: 'Father Loh', type: 'Yearly', dueDate: '14/2/24', status: 'Pending' }
    ];

    const appraisalList = document.getElementById('appraisal-list');

    appraisals.forEach(appraisal => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${appraisal.name}</td>
            <td>${appraisal.type}</td>
            <td>${appraisal.dueDate}</td>
            <td class="${appraisal.status === 'Pending' ? 'status-pending' : 'status-submitted'}">${appraisal.status}</td>
            <td>
                <button class="fill-up-btn" ${appraisal.status === 'Submitted' ? 'disabled' : ''}>Fill up</button>
            </td>
        `;

        appraisalList.appendChild(row);
    });
});
