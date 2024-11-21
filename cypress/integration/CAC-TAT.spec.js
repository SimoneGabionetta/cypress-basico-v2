/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){ //antes cada teste abrir url
        cy.visit('./src/index.html')
    })

    //teste : verifica titulo
    it('verifica o título da aplicação', function() {
       cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })
    
    //teste: email válido
    it('preenche os campos obrigatorios e envia formulario',function(){
        const longTest = 'testes,teste,testes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,testetestes,teste'
        
        cy.get('#firstName').type('João')//seletor playground cy
        cy.get('#lastName').type('Roberto')
        cy.get('#email').type('jr@teste.com')
        cy.get('#open-text-area').type(longTest, {delay:0})
        //cy.get('button[type="submit"]').click()-cy.contains para texto unico
        cy.contains('button','Enviar').click()//seletor botao tipo submit pelo html

        cy.get('.success').should('be.visible')

    })
    //teste: email invalido
    it('exibe mensagem de erro ao submeter o formulário com email invalido',function(){
         //ação    
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Roberto')
        cy.get('#email').type('jr@teste,com') // email invalido
        cy.get('#open-text-area').type('test')
        //cy.get('button[type="submit"]').click() - 1 forma
        cy.contains('button','Enviar').click()
       
        cy.get('.error').should('be.visible')//verifica mesagem de erro visivel
    })
    
    //(campo telefone só aceita numeros)teste:valida se um campo numerico nao digitado deve fcar vazio
    it('campo telefone continua vazio quando preenchido com valor não numerico',function(){
        cy.get('#phone')
          .type('abcddes') 
          .should('have.value','') //verifica se campo permanece vazio se digitado letras
    })

    //teste:verifica msg de erro
    it('exibe mensagem de erro quando o telefone se torna obrigatório, mas não é preenchido antes do envio do formulário',function(){
          
       cy.get('#firstName').type('João')
       cy.get('#lastName').type('Roberto')
       cy.get('#email').type('jr@teste.com') 
       //cy.get('#phone-checkbox').click() 
       cy.get('#phone-checkbox').check()//check mais semantico
       cy.get('#open-text-area').type('test')
       //cy.get('button[type="submit"]').click()
       cy.contains('button','Enviar').click()

       cy.get('.error').should('be.visible') //verifica se msg esta  visivel

   })
   it('preenche e limpa os campos nome,sobrenome,email,telefone e campo texto',function(){
        cy.get('#firstName')
          .type('João')
          .should('have.value','João')//pega texto x do campo nome, verifica se é x
          .clear()
          .should('have.value','')

        cy.get('#lastName')
          .type('Silva')
          .should('have.value','Silva')//pega texto x do campo nome, verifica se é x
          .clear()
          .should('have.value','')

        cy.get('#email')
          .type('teste@gmail.com')
          .should('have.value','teste@gmail.com')//pega texto x do campo nome, verifica se é x
          .clear()
          .should('have.value','')

        cy.get('#phone')
          .type('123456')
          .should('have.value','123456')//pega texto x do campo nome, verifica se é x
          .clear()
          .should('have.value','')

        cy.get('#open-text-area')
          .type('teste')
          .should('have.value','teste')//pega texto x do campo nome, verifica se é x
          .clear()
          .should('have.value','')      
    })
    //teste: campos vazios
    it('exibe mensagem de erro ao submeter um formulário sem preencher campos obrigatórios',function(){
        cy.contains('button','Enviar').click()
        
        cy.get('.error').should('be.visible')//ver msg erro- mens visivel
       
    })
    it('envia o formulario com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()//comando customizado - +legivel
        //valores('Pedro','email') 
        cy.get('.success').should('be.visible')     
    })
    // 3 formas selecionar opção suspensa
    it('seleciona um produto (youtube) pelo seu texto',function(){
      cy.get('#product')
        .select('youtube')//texto
        .should('have.value','youtube') 

      })
      it('seleciona um produto (Mentoria) pelo seu valor',function(){
        cy.get('#product')
        .select('mentoria')//value="mentoria"
        .should('have.value','mentoria') 

      })
      it('seleciona um produto (Blog) pelo seu indice',function(){
        cy.get('#product')
        .select(1)//pelo indice (0-selecione desabilitado entao 0 nao conta)
        .should('have.value','blog') 

      })
      //verifica valor correto
      it('marca tipo de atendimento "Feedback"',function(){
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value','feedback')

      })
      //cada radio marcado
      it('marca cada tipo de atendimento ',function(){
        cy.get('input[type="radio"]')//seletor pega tds elementos
          .should('have.length',3)//conta qts tem
          .each(function($radio){//passa por cd um dos elementos -função recebe os elementos
            cy.wrap($radio).check()//wrap empacote e manda comando
            cy.wrap($radio).should('be.checked')//verificou que o 3 estava marcado
          })          

      })
      
      it('marca ambos os checkboxes,depois desmarca o ultimo ',function(){
        cy.get('input[type="checkbox"]')//marca tds
          .check()
          .should('be.checked')
          .last()//pega ultimo
          .uncheck()//desmarca
          .should('not.be.checked')//verifica que nao esta checado
          
      })
      
      it('seleciona um arquivo pasta fixture',function(){
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json')
          .should(function($input) {
            //console.log(input)//propriedades
            expect($input[0].files[0].name).to.equal('example.json')
          })
      })

      //simula arrastando arquivo
      it('seleciona um arquivo simulando um drag-and-drop',function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json',{action:'drag-drop'})
        .should(function($input) {
          //console.log(input)//propriedades
          expect($input[0].files[0].name).to.equal('example.json',{action:'drag-drop'})
        })

      })
      it('seleciona um arquivo simulando uma fixture para qual foidada um alias',function(){
        cy.fixture('example.json').as('sampleFile')
        cy .get('input[type="file"]')
           .selectFile('@sampleFile')
           .should(function($input) {            
             expect($input[0].files[0].name).to.equal('example.json')
        
          })
      })

      //links abre outra aba nav
      it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um click',function(){
        cy.get('#privacy a').should('have.attr','target','_blank')

      })
      it('acessa a página de politica de privacidade removendo o targfet e entao clicando no link',function(){
        cy.get('#privacy a')
          .invoke('removeAttr','target')
          .click()
        
        //verificando se o texto dentro politica  esta visivel
        cy.contains('Talking About Testing').should('be.visible') 

      })

      


   
   

    
   

 })
   
   
  

  
    



  