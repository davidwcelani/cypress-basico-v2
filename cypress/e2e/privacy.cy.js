describe('Política de Privacidade', () => {

    beforeEach(function() {
        cy.visit('./src/privacy.html')
    })

    it.only('testa a página de política de privacidade de forma independente', function(){
        cy.contains('Talking About Testing').should('be.visible')
    })

})