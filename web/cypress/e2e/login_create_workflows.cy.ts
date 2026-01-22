/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
    }
  }
}

export {}

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')

  cy.get('input[id=email]').type(username)

  cy.get('input[id=password]').type(`${password}{enter}`, { log: false })

  cy.url().should('include', '/')

  // our auth cookie should be present
  // cy.getCookie('session').should('exist')

})

it('login with wrong credentials', function () {
  cy.login('wrong_id', 'wrong_password')
  cy.url().should('include', '/login')
})

it('login and test if workflows are visible', function () {
  const NEXT_ID = Cypress.env('NEXT_ID') || 'no id found'
  const NEXT_PW = Cypress.env('NEXT_PW') || 'no password found'

  cy.login(NEXT_ID, NEXT_PW)

  cy.wait(1000)
  cy.visit('/workflows')
  cy.contains('My Workflows').should('be.visible')

  cy.visit('/publics')
  cy.contains('Public Workflows').should('be.visible')
})