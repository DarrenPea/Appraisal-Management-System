describe('AppraisalForm Save Functionality for Employee', () => {
	beforeEach(() => {
	  // Login as an employee before each test
	  cy.visit('/')
	  cy.get('#username').type('E002')
	  cy.get('#password').type('password456')
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
	});

	it('should not save the form when Save is cancelled', () => {
	  // Fill out some form fields
	  cy.get('#A1').type('This is my primary role and responsibilities');
	
	  // Click the Save button
	  cy.get('.appraisal-form-save-btn').click();
	
	  // Cancel the save action
	  cy.on('window:confirm', () => false);
	
	  // Check that we're still on the same page
	  cy.url().should('include', '/form');
	
      // Verify that the form data is still there
	  cy.get('#A1').should('have.value', 'This is my primary role and responsibilities');
	});
  
	it('should save the form when the Save button is clicked', () => {
	  // Fill out form fields
	  cy.get('#A1').type('This is my primary role and responsibilities');
	  for (let i = 1; i <= 8; i++) {
		cy.get(`#A2_${i}`).type('Test comment');
	  }
  
	  // Click the Save button
	  cy.get('.appraisal-form-save-btn').click();
  
	  // Confirm the save action
	  cy.on('window:confirm', () => true);
  
	  // Check if the toast notification appears
	  cy.contains('Form saved!', { timeout: 10000 }).should('be.visible');
  
	  // Verify navigation
	  cy.url().should('include', '/employee');
	
	  // Click on the 'Fill Up' button again
	  cy.get('.employee-table-row').first().within(() => {
		cy.get('.employee-status-pending').should('contain', 'Pending')
		cy.get('.employee-fill-up-btn').should('not.be.disabled').click()
	  })
  
	  // Check if it navigates to the form page
	  cy.url().should('include', '/form')
  
	  // Wait for the form to load
	  cy.get('.appraisal-form').should('be.visible');

	  // Verify that the form data is still there
	  cy.get('#A1').should('have.value', 'This is my primary role and responsibilities');
	  for (let i = 1; i <= 8; i++) {
		cy.get(`#A2_${i}`).should('have.value', 'Test comment');
	  }
	});
});

describe('AppraisalForm Save Functionality for HOD', () => {
	beforeEach(() => {
	  // Login as an HOD before each test
	  cy.visit('/')
	  cy.get('#username').type('M002')
	  cy.get('#password').type('hodpw2')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to HOD home page
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
	});

	it('should have employee data pre-filled', () => {
	  // Verify that the form data is pre-filled
	  cy.get('#A1').should('have.text', 'test');
	  for (let i = 1; i <= 8; i++) {
		cy.get(`#A2_${i}`).should('have.text', 'test');
	  }
	  for (let i = 1; i <= 20; i++) {
		cy.get(`.rating-row-nonemployee`)
		  .eq(i - 1)
		  .find('.individual-rating-nonemployee p')
		  .should('contain', '4');
	  }

	  // Check overall rating
	  cy.get('.overall-score-nonemployee .overallRating')
	    .should('contain', '4 / 5');
	});

	it('should not save the form when Save is cancelled', () => {
	  // Fill out some form fields
	  cy.get('#CommentsA3_1').type('test');
	
	  // Click the Save button
	  cy.get('.appraisal-form-save-btn').click();
	
	  // Cancel the save action
	  cy.on('window:confirm', () => false);
	
	  // Check that we're still on the same page
	  cy.url().should('include', '/form');
	
      // Verify that the form data is still there
	  cy.get('#CommentsA3_1').should('have.value', 'test');
	});
  
	it('should save the form when the Save button is clicked', () => {
	  // Fill out form fields
	  for (let i = 1; i <= 20; i++) {
		cy.get(`#CommentsA3_${i}`).type('test');
	  }
	  cy.get(`#B`).type('test');
  
	  // Click the Save button
	  cy.get('.appraisal-form-save-btn').click();
  
	  // Confirm the save action
	  cy.on('window:confirm', () => true);
  
	  // Check if the toast notification appears
	  cy.contains('Form saved!', { timeout: 10000 }).should('be.visible');
  
	  // Verify navigation
	  cy.url().should('include', '/hod');
	
	  // Click on the 'Fill Up' button again
	  cy.get('.hod-table-row').first().within(() => {
		cy.get('.hod-status-pending').should('contain', 'Pending')
		cy.get('.hod-fill-up-btn').should('not.be.disabled').click()
	  })
  
	  // Check if it navigates to the form page
	  cy.url().should('include', '/form')
  
	  // Wait for the form to load
	  cy.get('.appraisal-form').should('be.visible');

	  // Verify that the form data is still there
	  for (let i = 1; i <= 8; i++) {
		cy.get(`#CommentsA3_${i}`).should('have.value', 'test');
	  }
	  cy.get(`#B`).should('have.value', 'test');
	});
});