describe('Central de Atendimento ao Cliente TAT', () => {

  const THREE_SECONDS_IN_MILISECONDS = 3000

  beforeEach(function() {
    cy.visit('./src/index.html')
  })

  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function() {
    const longText = 'TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT TEST TEXT'

    cy.clock()

    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail.com')
    cy.get('#firstName').type('David')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button','Enviar').click() 
    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {

    cy.clock()

    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail,com')
    cy.get('#firstName').type('David')
    cy.get('#open-text-area').type('Test')
    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.error').should('not.be.visible')
  })

  Cypress._.times(3,function(){
    it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
      cy.get('#phone')
        .type('abcdefghij')
        .should('have.value', '')
    })
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){

    cy.clock()

    cy.get('#firstName').type('David')
    cy.get('#lastName').type('Celani')
    cy.get('#email').type('davidcelani@mail.com')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type('Test')
    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.error').should('not.be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName').type('David').should('have.value','David').clear().should('have.value','')
    cy.get('#lastName').type('Celani').should('have.value','Celani').clear().should('have.value','')
    cy.get('#email').type('davidcelani@mail.com').should('have.value','davidcelani@mail.com').clear().should('have.value','')
    cy.get('#phone').type('09876543').should('have.value','09876543').clear().should('have.value','')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){

    cy.clock()

    cy.contains('button','Enviar').click() 
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.error').should('not.be.visible')
  })

  it('envia o formulário com sucesso usando um comando customizado', function(){

    cy.clock()

    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.success').should('not.be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', function(){
    cy.get('select').select('YouTube').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', function(){
    cy.get('select').select('mentoria').should('have.value','mentoria')
  })

  it('seleciona um produto (Blog) por seu indice', function(){
    cy.get('select').select(1).should('have.value','blog')
  })

  it('marca o tipo de atendimento "Feedback"', function(){
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value','feedback')
  })

  it('marca cada tipo de atendimento', function(){
    cy.get('input[type="radio"]').should('have.length', 3)
      .each(function($radio){
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o ultimo', function(){
    cy.get('input[type="checkbox"]').check().should('be.checked')
      .last().uncheck().should('not.be.checked')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){

    cy.clock()

    cy.get('input[type="checkbox"]').last().check()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MILISECONDS)

    cy.get('.error').should('not.be.visible')
  })

  it('seleciona um arquivo da pasta fixtures', function(){
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('#file-upload').should('not.have.value')
      .selectFile('./cypress/fixtures/example.json').should(function($input){
        //console.log($input)
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando drag-and-drop', function(){
    cy.get('#file-upload').should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}).should(function($input){
        //console.log($input)
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
    cy.fixture("example.json").as('sampleFile')
    cy.get('#file-upload').selectFile('@sampleFile').should(function($input){
      //console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function(){
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a área de texto usando o comando invoke', function(){
    const longText = Cypress._.repeat('0123456789', 20)
    cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
  })

  it('faz uma requisição HTTP', function(){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response){
        const {status, statusText, body} = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it('exibe o gato', function(){
    cy.get('#cat').invoke('show').should('be.visible').invoke('hide').should('not.be.visible')
    cy.get('#title').invoke('text', 'CAT TAT')
    cy.get('#subtitle').invoke('text', 'Eu S2 gatos.')
  })

})