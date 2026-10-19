class CadastroPage {

    //elementos
    get nome() {return cy.get('[data-test="first-name"]')}
    get sobrenome() {return cy.get('[data-test="last-name"]')}
    get nascimento() {return cy.get('[data-test="dob"]')}
    get pais() {return cy.get('[data-test="country"]')}
    get cep () {return cy.get('[data-test="postal_code"]')}
    get numeroCasa() {return cy.get('[data-test="house_number"]')}
    get rua() {return cy.get('[data-test="street"]')}
    get cidade () {return cy.get('[data-test="city"]')}
    get estado() {return cy.get('[data-test="state"]')}
    get telefone() {return cy.get('[data-test="phone"]')}
    get email () {return cy.get('[data-test="email"]')}
    get senha() {return cy.get('[data-test="password"]')}
    get botaoCadastrar() {return cy.get('[data-test="register-submit"]')}

    //elementos de requisitos de senha
    get regraOitoCaracteres() { return cy.contains('li', 'Be at least 8 characters long') }
    get regraMaiusculaMinuscula() { return cy.contains('li', 'Contain both uppercase and lowercase letters') }
    get regraNumero() { return cy.contains('li', 'Include at least one number') }
    get regraSimbolo() { return cy.contains('li', 'Have at least one special symbol') }
    get barraForca() { return cy.get('.strength-bar .fill') }
    get rotuloAtivo() { return cy.get('.strength-labels .active') }

    //elementos de alerta
    get alerta() {return cy.get('[data-test="register-error"]')}
    get alertaNome() {return cy.get('[data-test="first-name-error"]')}
    get alertaSobrenome() {return cy.get('[data-test="last-name-error"]')}
    get alertaNascimento() {return cy.get('[data-test="dob-error"]')}
    get alertaPais() {return cy.get('[data-test="country-error"]')}
    get alertaCep() {return cy.get('[data-test="postal_code-error"]')}
    get alertaNumeroCasa() {return cy.get('[data-test="house_number-error"]')}
    get alertaRua() {return cy.get('[data-test="street-error"]')}   
    get alertaCidade() {return cy.get('[data-test="city-error"]')}
    get alertaEstado() {return cy.get('[data-test="state-error"]')} 
    get alertaTelefone() {return cy.get('[data-test="phone-error"]')}
    get alertaEmail() {return cy.get('[data-test="email-error"]')}
    get alertaSenha() {return cy.get('[data-test="password-error"]')}


    //mensagens
    mensagens = {        
        nomeObrigatorio: 'First name is required',
        sobrenomeObrigatorio:'Last name is required',
        nascimentoInvalido:'Please enter a valid date in YYYY-MM-DD format.',
        nascimentoObrigatorio: 'Date of Birth is required',
        paisObrigatorio:'Country is required',
        cepObrigatorio:'Postcode is required',
        cepInvalido:'Please enter a valid Post Code',
        numeroCasaObrigatorio:'House number is required',
        ruaObrigatoria:'Street is required',
        cidadeObrigatoria:'City is required',
        estadoObrigatorio:'State is required',
        telefoneObrigatorio:'Phone is required.',
        telefoneInvalido:'Only numbers are allowed.',
        emailObrigatorio:'Email is required',
        emailInvalido:'Email format is invalid',
        emailExistente: 'A customer with this email address already exists.',
        senhaObrigatoria:'Password is required',
        senhaMinCaracteres:'Password must be minimal 8 characters long.',
        senhaInvalida:'Password can not include invalid characters.'
    }

    visit(){
        cy.visit('auth/register')
    }

    preencherCadastro(nome, sobrenome, nascimento, pais, cep, numeroCasa, telefone, email, senha){
        this.nome.type(nome)
        this.sobrenome.type(sobrenome)
        this.nascimento.type(nascimento)
        this.pais.select(pais)
        this.cep.type(cep)
        this.numeroCasa.type(numeroCasa)
        this.telefone.type(telefone)
        this.email.type(email)
        this.senha.type(senha)
    }
}

export default new CadastroPage()