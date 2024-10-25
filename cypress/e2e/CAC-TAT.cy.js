describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(function() {
    cy.visit('./src/index.html')
  })

  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function() {
    const longText = 'TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT'
    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail.com')
    cy.get('#firstName').type('David')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button','Enviar').click() 
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail,com')
    cy.get('#firstName').type('David')
    cy.get('#open-text-area').type('Test')
    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
    cy.get('#phone')
      .type('abcdefghij')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
    cy.get('#firstName').type('David')
    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail.com')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type('Test')
    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName').type('David').should('have.value','David').clear().should('have.value','')
    cy.get('#lastName').type('Celani').should('have.value','Celani').clear().should('have.value','')
    cy.get('#email').type('davidcelani@mail.com').should('have.value','davidcelani@mail.com').clear().should('have.value','')
    cy.get('#phone').type('09876543').should('have.value','09876543').clear().should('have.value','')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')
  })

  it('envia o formulário com sucesso usando um comando customizado', function(){
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })

})