import contatoPage from "../../support/pages/contato.page"

import { faker } from '@faker-js/faker';

describe('Contato', () => {

    let mensagemValida = 'Mensagem de teste com mais de 50 caracteres para passar na validação do formulário de contato.';
    let mensagemInvalida = 'Mensagem de teste com menos de 50 caracteres.';
    let mensagemInvalidaMax = faker.lorem.sentence().padEnd(251, 'x');

    beforeEach('', () => {
        contatoPage.visit();
    })

    it('Enviar mensagem de contato com sucesso', () => {
        contatoPage.preencherContato('John', 'Doe', 'teste@gmail.com', 'Payments', mensagemValida)
        contatoPage.botaoEnviar.click();

        cy.wait(1000)
        contatoPage.alerta.should('contain', contatoPage.mensagens.sucessoEnvio)
    })

    it('Bloqueio de envio com campos obrigatórios vazios', () => {
        contatoPage.botaoEnviar.click();

        cy.wait(1000)
        contatoPage.alertaNome.should('contain', contatoPage.mensagens.nomeObrigatorio)
        contatoPage.alertaSobrenome.should('contain', contatoPage.mensagens.sobrenomeObrigatorio)
        contatoPage.alertaEmail.should('contain', contatoPage.mensagens.emailObrigatorio)
        contatoPage.alertaAssunto.should('contain', contatoPage.mensagens.assuntoObrigatorio)
        contatoPage.alertaMensagem.should('contain', contatoPage.mensagens.mensagemObrigatoria)
    })

    it('Bloqueio de envio com mensagem com caracteres abaixo do mínimo', () => {
        contatoPage.preencherContato('John', 'Doe', 'teste@gmail.com', 'Payments', mensagemInvalida)
        contatoPage.botaoEnviar.click();

        cy.wait(1000)       
        contatoPage.alertaMensagem.should('contain', contatoPage.mensagens.mensagemTamanhoMinimo)
    })

    it('Bloqueio de envio com mensagem com caracteres acima do limite máximo', () => {
        contatoPage.preencherContato('John', 'Doe', 'teste@gmail.com', 'Payments', mensagemInvalidaMax)
        contatoPage.botaoEnviar.click();

        cy.wait(1000)       
        contatoPage.alertaMensagem.should('contain', contatoPage.mensagens.mensagemTamanhoMaximo)
    })

    it('Rejeição de anexo em formato inválido', () => {
        const anexoInvalido = 'cypress/fixtures/testepdf.pdf';
        contatoPage.preencherContato('John', 'Doe', 'teste@gmail.com', 'Payments', mensagemValida, anexoInvalido)
        contatoPage.botaoEnviar.click();

        contatoPage.alertaAnexo.should('contain', contatoPage.mensagens.anexoTamanhoMaximo)
    })

    it('Rejeição de anexo válido mas acima do limite de tamanho', () => {
        const anexoInvalido = 'cypress/fixtures/testepdf.pdf';
        contatoPage.preencherContato('John', 'Doe', 'teste@gmail.com', 'Payments', mensagemValida, anexoInvalido)
        contatoPage.botaoEnviar.click();

        contatoPage.alertaAnexo.should('contain', contatoPage.mensagens.anexoInvalido)
    })
})