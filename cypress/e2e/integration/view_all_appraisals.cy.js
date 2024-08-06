describe('HR Home - View All Appraisals', () => {
	beforeEach(() => {
	  // Login as a HR before each test
	  cy.visit('/')
	  cy.get('#username').type('H001')
	  cy.get('#password').type('hodpass123')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to HR home page
	  cy.url().should('include', '/hr')
	})
  
	it('displays the HR name and role correctly', () => {
	  cy.get('.home-header h1').should('contain', 'WELCOME,')
	  cy.get('.home-header h1').should('contain', 'MICHAEL SCOTT')
	  cy.get('.home-header h1').should('contain', '[HR]')
	})
  
	it('displays the "Pending Appraisals" header', () => {
	  cy.get('.hr-appraisal-header h2').should('contain', 'Pending Appraisals')
	})
  
	it('displays the appraisal table when appraisals are available', () => {
	  // This test assumes there are appraisals to display
	  // Headers
	  cy.get('.hr-table').should('be.visible')
	  cy.get('.hr-table th').should('have.length', 7) // Verify all columns are present

	  const headers = ['Employee Name', 'Department', 'Purpose', 'Due Date', 'Staff Status', 'HOD Status', ''];
	  headers.forEach((header, index) => {
		cy.get('.hr-table th').eq(index).should('contain', header);
	  });

	  // Data
	  cy.get('.hr-table-row').should('have.length.at.least', 1) // Ensure at least one row is present
	  cy.get('.hr-table-row').its('length').then((rowCount) => {
		// Decide how many rows to sample (e.g., up to 5 or 10% of total)
		const samplesToCheck = Math.min(5, Math.ceil(rowCount * 0.1));
		
		// Check sampled rows
		for(let i = 0; i < samplesToCheck; i++) {
		  cy.get('.hr-table-row').eq(i).within(() => {
			// Check structure
			cy.get('td').should('have.length', 7);
				
			// Check data types/formats
			cy.get('td').eq(0).should('not.be.empty'); // Employee Name
			cy.get('td').eq(1).should('not.be.empty'); // Department
			cy.get('td').eq(2).invoke('text').then((text) => {	// Purpose
				expect(text).to.match(/Yearly|Confirmational/);
			  });
			  cy.get('td').eq(3).invoke('text').then((text) => {  // Due Date format
				expect(text).to.match(/^\d{4}-\d{2}-\d{2}$/);
			  });
			  cy.get('td').eq(4).invoke('text').then((text) => {  // Staff Status
				expect(text).to.match(/Pending|Completed/);
			  });
			  cy.get('td').eq(5).invoke('text').then((text) => {  // HOD Status
				expect(text).to.match(/Pending|Completed/);
			  });
				
			// Check 'View' button
			cy.get('td').eq(6).find('.hr-view-btn')
			.should('be.visible')
			.and('contain', 'View');
		  });
	    }
	  });
	})
  
	it('allows viewing of appraisal', () => {
	  cy.get('.hr-table-row').each($row => {
		cy.wrap($row).find('.hr-view-btn').should('not.be.disabled').click()
		cy.url().should('include', '/form')
		
		// Check 'OK' button
		cy.get('.hr-ok-btn').scrollIntoView().should('be.visible').and('contain', 'OK')
		cy.get('.hr-ok-btn').scrollIntoView().click()
		cy.url().should('include', '/hr')
		return false // Break the loop
	  })
	})
  
	it('highlights overdue appraisals', () => {
	  cy.get('.hr-table-row.overdue').should('exist')
	})

	it('sorts appraisals with overdue first', () => {
	  cy.get('.hr-table-row').first().should('have.class', 'overdue')
	})
  
	it('allows logging out', () => {
	  // Logout
	  cy.get('.logout-button').click()
	  cy.url().should('not.include', '/hr')
	  cy.url().should('eq', Cypress.config().baseUrl + '/')
	})
  })