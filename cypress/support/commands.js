Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail.com')
    cy.get('#firstName').type('David')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button','Enviar').click() 
})