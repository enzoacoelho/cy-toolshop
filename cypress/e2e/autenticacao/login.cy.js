///<reference types="cypress"/>

import loginPage from '../../support/pages/login.page';

describe ('Login', () => {

    let email  
    let senha

    beforeEach ('', () => {
        loginPage.visit()
    })    

    it('Deve fazer login com credenciais válidas com sucesso', () => {
        cy.fixture('users').then((dados) =>{
            email = dados.email
            senha = dados.senha

            cy.login(email, senha)           

            cy.url().should('not.contain', 'login')
            cy.url().should('contain', 'account')
        })
    })

    it('Não deve fazer login com campos vazios', () => {
        loginPage.campoEmail.clear()
        loginPage.campoSenha.clear()
        loginPage.botaoLogin.click()
  
        cy.url().should('contain', 'login')
        loginPage.alertaEmail.should('contain', 'Email is required')
        loginPage.alertaSenha.should('contain', 'Password is required')        
    })

    it('Não deve fazer login com campos preenchidos apenas com espaços colados', () => {
        loginPage.preencherLogin('ㅤㅤㅤㅤㅤㅤㅤㅤㅤ', 'ㅤㅤㅤㅤㅤㅤㅤ')
        loginPage.botaoLogin.click()

        cy.url().should('contain', 'login')
        loginPage.alertaEmail.should('contain', 'Email format is invalid')  
    })

    it('Não deve fazer login com espaços antes/depois de credenciais válidas', () => {
        loginPage.preencherLogin('ㅤㅤㅤㅤㅤㅤㅤㅤㅤcustomer@practicesoftwaretesting.com', 'ㅤㅤㅤㅤㅤㅤㅤwelcome01')
        loginPage.botaoLogin.click()

        cy.url().should('contain', 'login')
        loginPage.alertaEmail.should('contain', 'Email format is invalid')       
    })

    it('Não deve fazer login com e-mail não cadastrado', () => {
        loginPage.preencherLogin('custome222r@practicesoftwaretesting.com', 'welcome01')
        loginPage.botaoLogin.click()

        cy.url().should('contain', 'login')
        loginPage.alertaErro.should('contain', 'Invalid email or password')       
    })

    it('Acessar link "Cadastre-se" a partir do login', () => {
        loginPage.cadastrar.click()
        cy.url().should('contain', 'register')
    })

    it('Acessar link "Esqueceu a senha" a partir do login', () => {
        loginPage.redefinirSenha.click()
        cy.url().should('contain', 'forgot-password')        
    })

    it('Ícone de mostrar/esconder senha deve estar funcionando', () => {
        loginPage.campoSenha
        .type('teste_visibilidade')
        .should('have.attr', 'type', 'password')

        loginPage.visibilidadeSenha.click()
        loginPage.campoSenha.should('have.attr', 'type', 'text')

        loginPage.visibilidadeSenha.click()
        loginPage.campoSenha.should('have.attr', 'type', 'password')        
    })

    it('Deve fazer logout com sucesso', () => {
        cy.fixture('users').then((dados) =>{
            email = dados.email
            senha = dados.senha

            cy.login(email, senha)
            cy.url().should('not.contain', 'login')
            cy.url().should('contain', 'account')
        })

        cy.logout()
        cy.url().should('not.contain', 'account')
        cy.url().should('contain', 'login')
    })
})