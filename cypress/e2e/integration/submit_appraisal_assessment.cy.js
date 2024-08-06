describe('AppraisalForm Submit Functionality for HOD', () => {
	it('should submit the form when the Submit button is clicked', () => {
	  // Login as a HOD before each test
	  cy.visit('/')
	  cy.get('#username').type('M003')
	  cy.get('#password').type('hodpw3')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to hod home page
	  cy.url().should('include', '/hod')

	  // Click on the 'Fill Up' button
	  cy.get('.hod-table-row').first().within(() => {
		cy.get('.hod-status-pending').should('contain', 'Pending')
		cy.get('.hod-fill-up-btn').should('not.be.disabled').click()
	  })
  
	  // Check if it navigates to the form page
	  cy.url().should('include', '/form')
  
	  // Wait for the form to load
	  cy.get('.appraisal-form').should('be.visible');

	  // Fill out form fields
	  for (let i = 1; i <= 20; i++) {
		cy.get(`#CommentsA3_${i}`).type('test');
	  }
	  cy.get(`#B`).type('test');

	  // Click the Submit button
	  cy.get('.appraisal-form-submit-btn').click();
  
	  // Confirm the submit action
	  cy.on('window:confirm', () => true);
  
	  // Check if the toast notification appears
	  cy.contains('Form submitted!', { timeout: 10000 }).should('be.visible');

	  // Check modal
	  cy.get('.modal-confirm-form', {timeout: 10000}).should('be.visible');
	  cy.get('.modal-confirm-form-content').should('be.visible');

	  cy.get('.modal-confirm-form-content').within(() => {
		cy.contains('h2', 'Details').should('be.visible');
		cy.contains('p', `Employee Name: `).should('be.visible');
		cy.contains('p', `Department: `).should('be.visible');
		cy.contains('p', `Purpose: `).should('be.visible');
		cy.get('.close-confirm-form-btn').should('be.visible').and('contain', 'OK');
	  });

	  // Close modal
	  cy.get('.close-confirm-form-btn').click();
  
	  // Verify navigation
	  cy.url().should('include', '/hod');
	
	  // Ensure status is updated to 'Completed' and 'Fill up' button is disabled
	  cy.get('.hod-table-row').first().within(() => {
		cy.get('.hod-status-submitted').should('contain', 'Submitted')
		cy.get('.hod-fill-up-btn').should('be.disabled')
	  })
	});
});