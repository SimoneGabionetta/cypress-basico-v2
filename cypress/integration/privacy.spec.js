Cypress._.times(5, function(){ //bl sera executado 5x
    it.only('testa a página da politica de privacidade de forma independente',function(){
        cy.visit('./src/privacy.html')
    
        cy.contains('Talking About Testing').should('be.visible')
    })
    
})