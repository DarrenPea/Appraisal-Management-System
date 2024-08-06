describe('AppraisalForm Submit Functionality for Employee', () => {
	it('should submit the form when the Submit button is clicked', () => {
	  // Login as an employee before each test
	  cy.visit('/')
	  cy.get('#username').type('E004')
	  cy.get('#password').type('password321')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to employee home page
	  cy.url().should('include', '/employee')

	  // Click on the 'Fill Up' button
	  cy.get('.employee-table-row').first().within(() => {
		cy.get('.employee-status-pending').should('contain', 'Pending')
		cy.get('.employee-fill-up-btn').should('not.be.disabled').click()
	  })
  
	  // Check if it navigates to the form page
	  cy.url().should('include', '/form')
  
	  // Wait for the form to load
	  cy.get('.appraisal-form').should('be.visible');

	  // Fill out form fields
	  cy.get('#A1').type('This is my primary role and responsibilities');
	  for (let i = 1; i <= 8; i++) {
		cy.get(`#A2_${i}`).type('Test comment');
	  }
	  for (let i = 1; i <= 20; i++) {
		cy.get(`input[name="A3_${i}"][value="4"]`).check();
	  }
  
	  // Check overall rating
	  cy.get('.overallRating').should('contain', '4.00');

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
		cy.contains('p', `Name: `).should('be.visible');
		cy.contains('p', `Department: `).should('be.visible');
		cy.contains('p', `Purpose: `).should('be.visible');
		cy.get('.close-confirm-form-btn').should('be.visible').and('contain', 'OK');
	  });

	  // Close modal
	  cy.get('.close-confirm-form-btn').click();

	  // Verify navigation
	  cy.url().should('include', '/employee');
	
	  // Ensure status is updated to 'Submitted' and 'Fill up' button is disabled
	  cy.get('.employee-table-row').first().within(() => {
		cy.get('.employee-status-submitted').should('contain', 'Submitted')
		cy.get('.employee-fill-up-btn').should('be.disabled')
	  })
	});
});