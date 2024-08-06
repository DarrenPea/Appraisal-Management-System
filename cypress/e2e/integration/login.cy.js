describe('Login Page', () => {
	beforeEach(() => {
	  // Visit the login page before each test
	  cy.visit('/') // Adjust this URL to match your app's login page route
	})
  
	it('displays the login form', () => {
	  cy.get('#loginForm').should('be.visible')
	  cy.get('#username').should('be.visible')
	  cy.get('#password').should('be.visible')
	  cy.get('button[type="submit"]').should('be.visible').and('contain', 'Log in')
	})
  
	it('shows an error for non-existent username', () => {
	  cy.get('#username').type('nonexistentuser')
	  cy.get('#password').type('anypassword')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.Toastify__toast--error').should('be.visible').and('contain', 'Wrong username!')
	})
  
	it('shows an error for incorrect password', () => {
	  cy.get('#username').type('E001')
	  cy.get('#password').type('wrongpassword')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.Toastify__toast--error').should('be.visible').and('contain', 'Wrong password!')
	})
  
	it('successfully logs in as HR and redirects', () => {
	  cy.get('#username').type('H001')
	  cy.get('#password').type('hodpass123')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.Toastify__toast--success').should('be.visible').and('contain', 'Login successful!')
	  cy.url().should('include', '/hr')
	})
  
	it('successfully logs in as Employee and redirects', () => {
	  cy.get('#username').type('E001')
	  cy.get('#password').type('password123')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.Toastify__toast--success').should('be.visible').and('contain', 'Login successful!')
	  cy.url().should('include', '/employee')
	})
  
	it('successfully logs in as HOD and redirects', () => {
	  cy.get('#username').type('M001')
	  cy.get('#password').type('hodpw123')
	  cy.get('button[type="submit"]').click()
  
	  cy.get('.Toastify__toast--success').should('be.visible').and('contain', 'Login successful!')
	  cy.url().should('include', '/hod')
	})
  })