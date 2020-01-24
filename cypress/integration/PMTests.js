describe('navigate to a project', () => {
  const login = () => {
    cy.visit('/login')
    cy.get('[test-id=login-email]').type('bridgerrhammond@gmail.com')
    cy.get('[test-id=login-password]').type('password')
    cy.get('[test-id=login-button]').click().wait(500)
  }

  const logout = () => {
    cy.get('[test-id=logout-button]').click().wait(500)
  }

  before(() => {
    login()
  })
  after(() => {
    logout()
  })

  // just ignore the random XHR errors in Cypress, they're fine!

  it('Inputs correct information on New Project', () => {
    cy.get('[test-id=new-project]').click().wait(200)
    cy.get('[test-id=project_name]').click().type('Cypress Project Name').wait(200)
    cy.get('[test-id=project_name]').should('have.value', 'Cypress Project Name').wait(200)
    cy.get('[test-id=project_desc]').click().type('Cypress Project Desc').wait(200)
    cy.get('[test-id=project_desc]').should('have.value', 'Cypress Project Desc').wait(200)
    cy.get('[test-id=project_deadline]').click().type('2020-01-25').wait(200)
    cy.get('[test-id=project_deadline]').should('have.value', '2020-01-25').wait(200)
    // unable to test due to custom/React classes being used
    // cy.get('[test-id=prject_man') 
  })
  it('Opens project correctly', () => {
    cy.get('[test-id=dash-header]').click().wait(200)
    cy.get('[test-id=project-link]')
      .first()
      .click()
      cy.get('[test-id=projectContainer]')
      .invoke('attr', 'test-data')
      .then(projId => {
        cy.url().should('include', projId)
      })
  })
  it('Allows PM to add Task' , () => {
    cy.get('[test-id=add-task]').click().wait(200)
    cy.get('[test-id=task-name]').click().type('testing')
    cy.get('[test-id=task-name]').should('have.value', 'testing')
  })
})
