describe('Employee Details Modal', () => {
	beforeEach(() => {
	  // Login as an HOD before each test
	  cy.visit('/')
	  cy.get('#username').type('M001')
	  cy.get('#password').type('hodpw123')
	  cy.get('button[type="submit"]').click()
	  cy.url().should('include', '/hod')
	})
  
	it('opens the modal when clicking the View button', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.modal').should('be.visible')
	})
  
	it('displays correct employee name in the modal', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.modal-employee-name').should('be.visible')
	  cy.get('.modal-employee-name').invoke('text').should('not.be.empty')
	  cy.get('.modal-employee-name').should('contain', 'Tony Lee')
	})
  
	it('displays employee details in the modal', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.hod-modal-table').should('be.visible')
	  cy.get('.hod-modal-table tr').should('have.length', 4)
	  
	  cy.get('.hod-modal-table tr').eq(0).within(() => {
		cy.get('.hod-modal-title').should('contain', 'Job Function')
		cy.get('.hod-modal-detail').invoke('text').should('not.be.empty')
		cy.get('.hod-modal-detail').should('contain', 'Ensure servers are up and running')
	  })
  
	  cy.get('.hod-modal-table tr').eq(1).within(() => {
		cy.get('.hod-modal-title').should('contain', 'KPI')
		cy.get('.hod-modal-detail').invoke('text').should('not.be.empty')
		cy.get('.hod-modal-detail').should('contain', '3.90')
	  })
  
	  cy.get('.hod-modal-table tr').eq(2).within(() => {
		cy.get('.hod-modal-title').should('contain', 'Disciplinary Record')
		cy.get('.hod-modal-detail').invoke('text').should('not.be.empty')
		cy.get('.hod-modal-detail').should('contain', 'Minor')
	  })
  
	  cy.get('.hod-modal-table tr').eq(3).within(() => {
		cy.get('.hod-modal-title').should('contain', 'Attendence Record')
		cy.get('.hod-modal-detail').invoke('text').should('not.be.empty')
		cy.get('.hod-modal-detail').should('contain', 'Good')
	  })
	})
  
	it('closes the modal when clicking the close button', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.modal').should('be.visible')
	  cy.get('.modal-close-button').click()
	  cy.get('.modal').should('not.exist')
	})
  
	it('closes the modal when clicking outside the modal content', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.modal').should('be.visible')
	  cy.get('.modal').click('topLeft') // Click outside the modal content
	  cy.get('.modal').should('not.exist')
	})
  
	it('does not close the modal when clicking inside the modal content', () => {
	  cy.get('.hod-view-btn').first().click()
	  cy.get('.modal').should('be.visible')
	  cy.get('.modal-content').click('center')
	  cy.get('.modal').should('be.visible')
	})
  
	it('fetches employee details from the server', () => {
	  cy.intercept('POST', 'http://localhost:3000/employee/details').as('getEmployeeDetails')
	  cy.get('.hod-view-btn').first().click()
	  cy.wait('@getEmployeeDetails').its('response.statusCode').should('eq', 200)
	})
  })