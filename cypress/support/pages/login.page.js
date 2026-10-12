class LoginPage {
    //Mapeamento elementos 
    get campoEmail () { return cy.get('[data-test="email"]')}
    get campoSenha () { return cy.get('[data-test="password"]')}
    get botaoLogin() { return cy.get('[data-test="login-submit"]')}
    get visibilidadeSenha () {return cy.get('.input-group-append > .btn')}

    get cadastrar() { return cy.get('[data-test="register-link"]')}
    get redefinirSenha() {return cy.get('[data-test="forgot-password-link"]')}
   

    //Mapeamento elementos - alertas/mensagens
    get alertaEmail () {return cy.get('[data-test="email-error"] > div')}
    get alertaSenha () {return cy.get('[data-test="password-error"] > div')}
    get alertaErro () {return cy.get('.help-block')}

    visit() {
        cy.visit('auth/login')
    }

    preencherLogin (email, senha) {
        this.campoEmail.type(email)
        this.campoSenha.type(senha)
    }
}

export default new LoginPage()