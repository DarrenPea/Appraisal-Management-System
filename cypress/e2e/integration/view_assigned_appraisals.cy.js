describe('Employee Home - View Assigned Appraisals', () => {
	beforeEach(() => {
	  // Login as an employee before each test
	  cy.visit('/')
	  cy.get('#username').type('E001')
	  cy.get('#password').type('password123')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to employee home page
	  cy.url().should('include', '/employee')
	})
  
	it('displays the employee name and role correctly', () => {
	  cy.get('.home-header h1').should('contain', 'WELCOME,')
	  cy.get('.home-header h1').should('contain', 'JOHN DOE')
	  cy.get('.home-header h1').should('contain', '[EMPLOYEE]')
	})
  
	it('displays the "Pending Appraisals" header', () => {
	  cy.get('.employee-appraisal-header h2').should('contain', 'Pending Appraisals')
	})
  
	it('displays the appraisal table when appraisals are available', () => {
	  // This test assumes there are appraisals to display
	  // Headers
	  cy.get('.employee-table').should('be.visible')
	  cy.get('.employee-table th').should('have.length', 6) // Verify all columns are present
	  cy.get('.employee-table th').eq(0).should('contain', 'Name')
	  cy.get('.employee-table th').eq(1).should('contain', 'Department')
	  cy.get('.employee-table th').eq(2).should('contain', 'Purpose')
	  cy.get('.employee-table th').eq(3).should('contain', 'Due Date')
	  cy.get('.employee-table th').eq(4).should('contain', 'Status')

	  // Data
	  cy.get('.employee-table-row').should('have.length.at.least', 1) // Ensure at least one row is present
	  cy.get('.employee-table-row').first().within(() => {
		// Check structure
		cy.get('td').should('have.length', 6);
			
		// Check data types/formats
		cy.get('td').eq(0).should('not.be.empty'); // Employee Name
		cy.get('td').eq(1).should('not.be.empty'); // Department
		cy.get('td').eq(2).invoke('text').then((text) => {	// Purpose
		  expect(text).to.match(/Yearly|Confirmational/);
		});
		cy.get('td').eq(3).invoke('text').then((text) => {  // Due Date format
		  expect(text).to.match(/^\d{4}-\d{2}-\d{2}$/);
		});
		cy.get('td').eq(4).invoke('text').then((text) => {  // Status
		  expect(text).to.match(/Pending|Completed/);
		});
			
		// Check for 'Fill up' button
		cy.get('td').eq(5).find('.employee-fill-up-btn')
		  .should('be.visible')
		  .and('contain', 'Fill up')
	  });
	})
  
	it('displays "No actions are needed" when no appraisals are due', () => {
	  // This test assumes there might be cases with no appraisals
	  cy.get('.employee-table').should('not.exist')
	  cy.get('.no-actions').should('be.visible')
	  cy.get('.no-actions p').should('contain', 'No actions are needed at this time.')
	})
  
	it('allows filling up a pending appraisal', () => {
	  cy.get('.employee-table-row').first().within(() => {
		cy.get('.employee-status-pending').should('contain', 'Pending')
		cy.get('.employee-fill-up-btn').should('not.be.disabled').click()
	  })
  
	  // Check if it navigates to the form page
	  cy.url().should('include', '/form')
	})
  
	it('allows logging out and logging into a user with overdue form to check highlighted appraisal', () => {
	  // Logout
	  cy.get('.logout-button').click()
	  cy.url().should('not.include', '/employee')
	  cy.url().should('eq', Cypress.config().baseUrl + '/')
      
	  // Login as an employee with overdue form
	  cy.get('#username').type('E005')
	  cy.get('#password').type('password654')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.employee-table-row').first().should('have.class', 'overdue')
	})

	it('logging into a user with no recent forms', () => {
		// Logout
		cy.get('.logout-button').click()
		cy.url().should('not.include', '/employee')
		cy.url().should('eq', Cypress.config().baseUrl + '/')

		// Login as an employee with no recent forms (no forms due this month and the previous month)
		cy.get('#username').type('E006')
		cy.get('#password').type('password987')
		cy.get('button[type="submit"]').click()
	
		cy.get('.no-actions').should('be.visible')
		cy.get('.no-actions p').should('contain', 'No actions are needed at this time.')
	})
  })

describe('HOD Home - View Assigned Appraisals', () => {
	beforeEach(() => {
	  // Login as a HOD before each test
	  cy.visit('/')
	  cy.get('#username').type('M001')
	  cy.get('#password').type('hodpw123')
	  cy.get('button[type="submit"]').click()
  
	  // Wait for navigation to HOD home page
	  cy.url().should('include', '/hod')
	})
  
	it('displays the HOD name and role correctly', () => {
	  cy.get('.home-header h1').should('contain', 'WELCOME,')
	  cy.get('.home-header h1').should('contain', 'TOM TAN')
	  cy.get('.home-header h1').should('contain', '[HOD]')
	})
  
	it('displays the "Pending Appraisals" header', () => {
	  cy.get('.hod-appraisal-header h2').should('contain', 'Pending Appraisals')
	})
  
	it('displays the appraisal table when appraisals are available', () => {
	  // This test assumes there are appraisals to display
	  // Headers
	  cy.get('.hod-table').should('be.visible')
	  cy.get('.hod-table th').should('have.length', 8) // Verify all columns are present
	  cy.get('.hod-table th').eq(0).should('contain', 'Employee Name')
	  cy.get('.hod-table th').eq(1).should('contain', 'Department')
	  cy.get('.hod-table th').eq(2).should('contain', 'Purpose')
	  cy.get('.hod-table th').eq(3).should('contain', 'Due Date')
	  cy.get('.hod-table th').eq(4).should('contain', 'Employee Status')
	  cy.get('.hod-table th').eq(5).should('contain', 'Status')
	  cy.get('.hod-table th').eq(6).should('contain', 'Employee Data')

	  // Data
	  cy.get('.hod-table-row').should('have.length.at.least', 1) // Ensure at least one row is present
	  cy.get('.hod-table-row').first().within(() => {
		// Check structure
		cy.get('td').should('have.length', 8);
			
		// Check data types/formats
		cy.get('td').eq(0).should('not.be.empty'); // Employee Name
		cy.get('td').eq(1).should('not.be.empty'); // Department
		cy.get('td').eq(2).invoke('text').then((text) => {	// Purpose
		  expect(text).to.match(/Yearly|Confirmational/);
		});
		cy.get('td').eq(3).invoke('text').then((text) => {  // Due Date format
		  expect(text).to.match(/^\d{4}-\d{2}-\d{2}$/);
		});
		cy.get('td').eq(4).invoke('text').then((text) => {  // Employee Status
		  expect(text).to.match(/Pending|Completed/);
		});
		cy.get('td').eq(5).invoke('text').then((text) => {  // Status
		  expect(text).to.match(/Pending|Completed/);
		});
			
		// Check for 'View' button (modal trigger)
		cy.get('td').eq(6).find('.hod-view-btn')
		  .should('be.visible')
		  .and('contain', 'View')

		// Check for 'Fill up' button
		cy.get('td').eq(7).find('.hod-fill-up-btn')
		  .should('be.visible')
		  .and('contain', 'Fill up')
	  });
	})
  
	it('allows viewing employee details', () => {
	  cy.get('.hod-view-btn').first().click()
  	  cy.get('.modal').should('be.visible')
	  // Add more assertions for the modal content
	  cy.get('.modal .modal-close-button').click()
      cy.get('.modal').should('not.exist')
	})
  
	it('allows filling up a pending appraisal when employee has submitted', () => {
	  cy.get('.hod-table-row').each($row => {
		const $employeeStatus = $row.find('.hod-employee-status-submitted')
		const $hodStatus = $row.find('.hod-status-pending')
	    if ($employeeStatus.length && $hodStatus.length) {
		  cy.wrap($row).find('.hod-fill-up-btn').should('not.be.disabled').click()
		  cy.url().should('include', '/form')
		  return false // Break the loop
		}
	  })
	})
  
	it('disables "Fill up" button when HOD has already submitted', () => {
		cy.get('.hod-table-row').each($row => {
		  if ($row.find('.hod-status-submitted').length > 0) {
			cy.wrap($row).find('.hod-fill-up-btn').should('be.disabled')
		  }
		})
	})
  
	it('disables "Fill up" button when employee has not submitted', () => {
	  cy.get('.hod-table-row').each($row => {
	    if ($row.find('.hod-employee-status-pending').length > 0) {
		  cy.wrap($row).find('.hod-fill-up-btn').should('be.disabled')
		}
	  })
	})
  
	it('highlights overdue appraisals', () => {
	  cy.get('.hod-table-row.overdue').should('exist')
	})

	it('sorts appraisals with overdue first', () => {
	  cy.get('.hod-table-row').first().should('have.class', 'overdue')
	})
  
	it('allows logging out', () => {
	  // Logout
	  cy.get('.logout-button').click()
	  cy.url().should('not.include', '/hod')
	  cy.url().should('eq', Cypress.config().baseUrl + '/')
	})
  })