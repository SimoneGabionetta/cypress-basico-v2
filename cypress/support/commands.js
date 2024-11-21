Cypress.Commands.add('fillMandatoryFieldsAndSubmit',function(){
    
    cy.get('#firstName').type('João')//seletor playground cy
    cy.get('#lastName').type('Roberto')
    cy.get('#email').type('jr@teste.com')
    cy.get('#open-text-area').type('test')
    //cy.get('button[type="submit"]').click()
    cy.contains('button','Enviar').click()

    cy.get('.success').should('be.visible')
})