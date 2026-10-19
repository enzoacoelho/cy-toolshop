///<reference types="cypress"/>

import cadastroPage from '../../support/pages/cadastro.page';
import { faker } from '@faker-js/faker'

describe('Cadastro', () => {

    beforeEach('', () => {
        cadastroPage.visit();
    })

    it('Cadastro e login válidos com sucesso', () => {
        const email = faker.internet.email();
        const telefone = faker.phone.number().replace(/\D/g, '');
        cadastroPage.preencherCadastro('John', 'Doe', '1990-01-01', 'Brazil', '86210044', '74', telefone, email, 'OscarBrasil01@3');
        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cy.wait(1000)

        cy.url().should('not.contain', 'register')
        cy.url().should('contain', 'login')

        cy.login(email, 'OscarBrasil01@3')

        cy.url().should('not.contain', 'login')
        cy.url().should('contain', 'account')
        cy.get('[data-test="nav-menu"]').should('contain', 'John Doe')
    })

    it('Não deve permitir cadastro com e-mail já cadastrado', () => {
        const email = 'customer@practicesoftwaretesting.com';
        const telefone = faker.phone.number().replace(/\D/g, '');
        cadastroPage.preencherCadastro('John', 'Doe', '1990-01-01', 'Brazil', '86210044', '74', telefone, email, 'OscarBrasil01@3');
        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cy.wait(1000)
        cy.url().should('contain', 'register')
        cadastroPage.alerta.should('contain', cadastroPage.mensagens.emailExistente)

    })

    it('Não deve permitir cadastro com campos obrigatórios vazios', () => {
        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cy.wait(1000)

        cadastroPage.alertaNome.should('contain', cadastroPage.mensagens.nomeObrigatorio)
        cadastroPage.alertaSobrenome.should('contain', cadastroPage.mensagens.sobrenomeObrigatorio)
        cadastroPage.alertaNascimento.should('contain', cadastroPage.mensagens.nascimentoInvalido)
        cadastroPage.alertaNascimento.should('contain', cadastroPage.mensagens.nascimentoObrigatorio)
        cadastroPage.alertaPais.should('contain', cadastroPage.mensagens.paisObrigatorio)
        cadastroPage.alertaCep.should('contain', cadastroPage.mensagens.cepObrigatorio)
        cadastroPage.alertaNumeroCasa.should('contain', cadastroPage.mensagens.numeroCasaObrigatorio)
        cadastroPage.alertaRua.should('contain', cadastroPage.mensagens.ruaObrigatoria)
        cadastroPage.alertaCidade.should('contain', cadastroPage.mensagens.cidadeObrigatoria)
        cadastroPage.alertaEstado.should('contain', cadastroPage.mensagens.estadoObrigatorio)
        cadastroPage.alertaTelefone.should('contain', cadastroPage.mensagens.telefoneObrigatorio)
        cadastroPage.alertaEmail.should('contain', cadastroPage.mensagens.emailObrigatorio)
        cadastroPage.alertaSenha.should('contain', cadastroPage.mensagens.senhaObrigatoria)        

        cy.url().should('contain', 'register')

    })

    it('Validação de formato de campos (E-mail, Data, Telefone e CEP)', () => {
        cadastroPage.email.type('emailinvalido_.com')
        cadastroPage.nascimento.type('2099-01-01')
        cadastroPage.telefone.type('abc123')
        cadastroPage.cep.type('XYZ-000')

        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cadastroPage.alertaEmail.should('contain', cadastroPage.mensagens.emailInvalido)
        cadastroPage.alertaNascimento.should('contain', cadastroPage.mensagens.nascimentoInvalido)
        cadastroPage.alertaTelefone.should('contain', cadastroPage.mensagens.telefoneInvalido)
        cadastroPage.cep.should('contain', cadastroPage.mensagens.cepInvalido)
    })

    it('Não deve cadastrar com senha abaixo do nível forte', () => {
        const email = faker.internet.email();
        const telefone = faker.phone.number().replace(/\D/g, '');

        cadastroPage.preencherCadastro('John', 'Doe', '1990-01-01', 'Brazil', '86210044', '74', telefone, email, 'Abcdefgh');

        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cadastroPage.regraOitoCaracteres.should('have.class', 'text-success')
        cadastroPage.regraMaiusculaMinuscula.should('have.class', 'text-success')
        cadastroPage.regraNumero.should('not.have.class', 'text-success')
        cadastroPage.regraSimbolo.should('not.have.class', 'text-success')

        cy.url().should('contain', 'register')
    })

    it('Validação de limite mínimo de caracteres de senha', () => {
        const email = faker.internet.email();
        const telefone = faker.phone.number().replace(/\D/g, '');

        cadastroPage.preencherCadastro('John', 'Doe', '1990-01-01', 'Brazil', '86210044', '74', telefone, email, 'Abcdefg');

        cadastroPage.botaoCadastrar.click();
        cadastroPage.botaoCadastrar.click();

        cadastroPage.regraOitoCaracteres.should('not.have.class', 'text-success')
        cadastroPage.regraMaiusculaMinuscula.should('have.class', 'text-success')
        cadastroPage.regraNumero.should('not.have.class', 'text-success')
        cadastroPage.regraSimbolo.should('not.have.class', 'text-success')

        cadastroPage.alertaSenha.should('contain', cadastroPage.mensagens.senhaMinCaracteres)

        cy.url().should('contain', 'register')
    })

    it('Barra de força deve atualizar em tempo real a cada mudança de senha', () => {
        const senhas = [
            { valor: 'abc', classe: 'weak' },
            { valor: 'Abcdefg1', classe: 'moderate' },
            { valor: 'Abcdefg1@', classe: 'strong' },
            { valor: 'Abcdefg1@xyz!', classe: 'very-strong' },
        ]

        senhas.forEach(({ valor, classe }) => {
            cadastroPage.senha.clear().type(valor)
            cy.get('.strength-bar .fill').should('have.class', classe)
        })
    })
})