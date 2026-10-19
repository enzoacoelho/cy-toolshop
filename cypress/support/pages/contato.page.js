class ContatoPage { 
    //elementos
       get nome() {return cy.get('[data-test="first-name"]')}
       get sobrenome() {return cy.get('[data-test="last-name"]')}
       get email() {return cy.get('[data-test="email"]')}
       get assunto() {return cy.get('[data-test="subject"]')}
       get mensagem() {return cy.get('[data-test="message"]')}
       get anexo() {return cy.get('[data-test="attachment"]')}
       get botaoEnviar() {return cy.get('[data-test="contact-submit"]')}
       

    //alertas
    get alerta() {return cy.get('.alert')}
    get alertaNome() {return cy.get('[data-test="first-name-error"]')}
    get alertaSobrenome() {return cy.get('[data-test="last-name-error"]')}
    get alertaEmail() {return cy.get('[data-test="email-error"]')}
    get alertaAssunto() {return cy.get('[data-test="subject-error"]')}
    get alertaMensagem() {return cy.get('[data-test="message-error"]')}
    get alertaAnexo() {return cy.get('[data-test="attachment-error"]')}

    //mensagens
    mensagens = {
        nomeObrigatorio: 'First name is required',
        sobrenomeObrigatorio:'Last name is required',
        emailObrigatorio:'Email is required',
        emailInvalido:'Email format is invalid',
        assuntoObrigatorio:'Subject is required',
        mensagemObrigatoria:'Message is required',
        mensagemTamanhoMaximo:'The message field must not be greater than 250 characters.',
        mensagemTamanhoMinimo:'Message must be minimal 50 characters',
        anexoInvalido:'File should be empty.',
        sucessoEnvio:'Thanks for your message! We will contact you shortly.'
    }

    //ações
    visit(){
        cy.visit('contact')
    }

    preencherContato(nome, sobrenome, email, assunto, mensagem, anexo = ''){
        this.nome.type(nome)
        this.sobrenome.type(sobrenome)
        this.email.type(email)
        this.assunto.select(assunto)
        this.mensagem.type(mensagem)
        if(anexo){
            this.anexo.selectFile(anexo)
        }
    }
}

export default new ContatoPage()