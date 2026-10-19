import homePage from '../../support/pages/home.page';
import produtoPage from '../../support/pages/produto.page';
import navbar from '../../support/components/navBar';
import checkoutPage from '../../support/pages/checkout.page';
import toast from '../../support/components/toast';

const paraNumero = (texto) => parseFloat(texto.replace(/[^0-9.]/g, ''));


describe('Carrinho de Compras', () => {

    beforeEach(() => {
        cy.visit('/auth/login');
        cy.fixture('users').then((usuarios) => {
            cy.login(usuarios.userValido.email, usuarios.userValido.senha);
        });

        cy.wait(5000)

        cy.url().should('include', '/account');
        navbar.linkHome.click();
    });

    it('Adicionar produto ao carrinho', () => {
        homePage.cardsProduto.first().click();
        produtoPage.quantidade.should('have.value', '1');

        produtoPage.nome.should('be.visible').and('not.have.text', '');
        produtoPage.nome.invoke('text').as('nomeProduto');

        produtoPage.addicionarAoCarrinho();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

        navbar.quantidadeCarrinho.should('contain', '1');
        navbar.abrirCarrinho();

        cy.get('@nomeProduto').then((nomeProduto) => {
            checkoutPage.tituloProduto.should('contain', nomeProduto.trim());
        });

    });

    it('Adição de produto com quantidade inicial customizada', () => {
        homePage.cardsProduto.first().click();
        produtoPage.quantidade.type('{selectall}3');
        produtoPage.quantidade.should('have.value', '3');
        produtoPage.addicionarAoCarrinho();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

        navbar.quantidadeCarrinho.should('contain', '3');
        navbar.abrirCarrinho();
        navbar.quantidadeCarrinho.should('contain', '3');
    });

    it('Alteração e recálculo de quantidade de item no carrinho', () => {
        homePage.cardsProduto.first().click();
        produtoPage.addicionarAoCarrinho();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

        navbar.abrirCarrinho();

        checkoutPage.quantidadeProduto.should('have.value', '1');

        // guarda o total com quantidade 1
        checkoutPage.valorTotal.should('not.have.text', '');
        checkoutPage.valorTotal.invoke('text').then((texto) => {
            cy.wrap(paraNumero(texto)).as('totalBase');
        });

        // quantidade 5 -> total deve ser base x 5
        checkoutPage.definirQuantidade(5);
        checkoutPage.quantidadeProduto.should('have.value', '5');

        cy.get('@totalBase').then((totalBase) => {
            checkoutPage.valorTotal.should(($el) => {
                expect(paraNumero($el.text())).to.be.closeTo(totalBase * 5, 0.01);
            });
        });

        // quantidade 2 -> total deve ser base x 2
        checkoutPage.definirQuantidade(2);
        checkoutPage.quantidadeProduto.should('have.value', '2');

        cy.get('@totalBase').then((totalBase) => {
            checkoutPage.valorTotal.should(($el) => {
                expect(paraNumero($el.text())).to.be.closeTo(totalBase * 2, 0.01);
            });
        });
    });

    it('Remove produto do carrinho', () => {
        homePage.cardsProduto.first().click();
        produtoPage.addicionarAoCarrinho();


        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);
        navbar.abrirCarrinho();

        cy.url().should('include', '/checkout');
        checkoutPage.tituloProduto.should('be.visible').and('not.have.text', '');
        checkoutPage.botaoRemoverProduto.click();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.removidoCarrinho);

    })

    it('QA-CAR-05 - Análise do valor limite da quantidade de produto', () => {
        homePage.cardsProduto.first().click();
        produtoPage.nome.should('be.visible').and('not.have.text', '');

        // Passo 1: quantidade 0 -> mantém o mínimo de 1
        produtoPage.quantidade.type('{selectall}0').blur();
        produtoPage.quantidade.should('have.value', '1');

        // Passo 2: quantidade 100 -> limita em 99 e exibe alerta
        produtoPage.quantidade.type('{selectall}100').blur();
        produtoPage.quantidade.should('have.value', '99');
        toast.alerta.should('be.visible');
        toast.alerta.should('contain', toast.mensagens.limiteAddCarrinho);

        // Passo 3: quantidade 99 -> adiciona ao carrinho sem erro
        produtoPage.quantidade.type('{selectall}99').blur();
        produtoPage.quantidade.should('have.value', '99');
        produtoPage.addicionarAoCarrinho();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

        // Passo 4: carrinho com uma linha, quantidade 99 e total = 99x unitário
        navbar.abrirCarrinho();
        cy.url().should('include', '/checkout');

        checkoutPage.tituloProduto.should('have.length', 1);
        checkoutPage.quantidadeProduto.should('have.value', '99');

        checkoutPage.valorProduto.invoke('text').then((textoPreco) => {
            const precoUnitario = paraNumero(textoPreco);

            checkoutPage.valorTotal.should(($el) => {
                expect(paraNumero($el.text())).to.be.closeTo(precoUnitario * 99, 0.01);
            });
        });
    });

    it('QA-CAR-06 - Análise do valor limite da quantidade de produto dentro do carrinho', () => {

        homePage.cardsProduto.first().click();
        produtoPage.nome.should('be.visible').and('not.have.text', '');
        produtoPage.addicionarAoCarrinho();
        toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

        // Passo 1: acessar o carrinho
        navbar.abrirCarrinho();
        cy.url().should('include', '/checkout');
        checkoutPage.quantidadeProduto.should('have.value', '1');

        // guarda o preço unitário para o passo 5
        checkoutPage.valorProduto.invoke('text').then((texto) => {
            cy.wrap(paraNumero(texto)).as('precoUnitario');
        });

        // Passo 2: apagar o campo -> volta para 1
        checkoutPage.quantidadeProduto.clear().blur();
        checkoutPage.quantidadeProduto.should('have.value', '1');
        toast.alerta.should('be.visible').and('not.contain', toast.mensagens.quantidadeAtualizada); // BUG

        // Passo 3: 00 -> reverte para 1, sem toast de sucesso
        checkoutPage.quantidadeProduto.clear().type('00').blur();
        checkoutPage.quantidadeProduto.should('have.value', '1');
        toast.alerta.should('be.visible').and('not.contain', toast.mensagens.quantidadeAtualizada); // BUG

        // Passo 4: 100 -> alerta de limite 99, sem toast de sucesso
        checkoutPage.quantidadeProduto.clear().type('100').blur();
        checkoutPage.quantidadeProduto.should('have.value', '1');
        toast.alerta.should('contain', toast.mensagens.limiteAddCarrinho);
        toast.alerta.should('not.contain', toast.mensagens.quantidadeAtualizada); // BUG

        // Passo 5: 99 -> aceita e total = 99x unitário
        checkoutPage.quantidadeProduto.clear().type('99').blur();
        checkoutPage.quantidadeProduto.should('have.value', '99');

        cy.get('@precoUnitario').then((preco) => {
            checkoutPage.valorTotal.should(($el) => {
                expect(paraNumero($el.text())).to.be.closeTo(preco * 99, 0.01);
            });
        });
    });

it('QA-CAR-07 - Persistência dos itens do carrinho pós-autenticação', () => {
    // Passo 2: adiciona um item
    homePage.cardsProduto.should('have.length.greaterThan', 0, { timeout: 20000 });
    homePage.cardsProduto.first().click();

    produtoPage.nome.should('be.visible').and('not.have.text', '');
    produtoPage.nome.invoke('text').as('nomeProduto');

    produtoPage.addicionarAoCarrinho();
    cy.get('.toast-message', { timeout: 20000 })
        .should('be.visible')
        .and('contain', toast.mensagens.sucessoAddCarrinho);
    navbar.quantidadeCarrinho.should('contain', '1');

    // Passo 3: logout
    navbar.fazerLogout();
    navbar.linkSignIn.should('be.visible');

    // Passo 4: novo login
    cy.visit('/auth/login');
    cy.fixture('users').then(({ userValido }) => {
        cy.login(userValido.email, userValido.senha);
    });
    cy.url({ timeout: 20000 }).should('include', '/account');

    // Passo 5: item continua no carrinho
    navbar.iconeCarrinho.click();
    cy.url().should('include', '/checkout');

    cy.get('@nomeProduto').then((nome) => {
        checkoutPage.tituloProduto.should('have.length', 1).and('contain', nome.trim());
    });
    checkoutPage.quantidadeProduto.should('have.value', '1');
});

it('QA-CAR-07 - Persistência dos itens do carrinho pós-autenticação', () => {
    // Passo 2: adiciona um item
    homePage.cardsProduto.first().click();
    produtoPage.nome.should('be.visible').and('not.have.text', '');
    produtoPage.nome.invoke('text').as('nomeProduto');
    produtoPage.addicionarAoCarrinho();
    toast.alerta.should('be.visible').and('contain', toast.mensagens.sucessoAddCarrinho);

    // Passo 3: logout
    navbar.fazerLogout();
    navbar.linkSignIn.should('be.visible');

    // Passo 4: novo login
    cy.visit('/auth/login');
    cy.fixture('users').then(({ userValido }) => {
        cy.login(userValido.email, userValido.senha);
    });

    // Passo 5: item continua no carrinho
    navbar.iconeCarrinho.click();
    cy.url().should('include', '/checkout');

    cy.get('@nomeProduto').then((nome) => {
        checkoutPage.tituloProduto.should('have.length', 1).and('contain', nome.trim());
    });
    checkoutPage.quantidadeProduto.should('have.value', '1');
});

it('QA-CAR-08 - Agrupamento/soma de itens no carrinho', () => {
    // Passo 1: Produto A duas vezes
    homePage.cardsProduto.should('have.length.greaterThan', 1);
    homePage.cardsProduto.eq(0).click();
    produtoPage.nome.should('be.visible').and('not.have.text', '');
    produtoPage.nome.invoke('text').then((t) => cy.wrap(t.trim()).as('nomeA'));

    produtoPage.addicionarAoCarrinho();
    navbar.quantidadeCarrinho.should('have.text', '1');
    produtoPage.addicionarAoCarrinho();
    navbar.quantidadeCarrinho.should('have.text', '2');

    // Passo 2: uma linha, quantidade 2
    navbar.iconeCarrinho.click();
    checkoutPage.tituloProduto.should('have.length', 1);
    checkoutPage.quantidadeProduto.should('have.value', '2');

    // Passo 3: Produto B (diferente do A)
    navbar.linkHome.click();
    homePage.cardsProduto.should('have.length.greaterThan', 1);
    cy.get('@nomeA').then((nomeA) => {
        cy.contains('[data-test="product-name"]', new RegExp(`^(?!\\s*${nomeA}\\s*$)`))
            .first()
            .click();
    });
    produtoPage.nome.should('be.visible').and('not.have.text', '');
    produtoPage.addicionarAoCarrinho();
    navbar.quantidadeCarrinho.should('have.text', '3');

    // Passo 4: duas linhas e total = soma dos subtotais
    navbar.iconeCarrinho.click();
    checkoutPage.tituloProduto.should('have.length', 2);
    checkoutPage.quantidadeProduto.eq(0).should('have.value', '2');
    checkoutPage.quantidadeProduto.eq(1).should('have.value', '1');

    cy.get('tbody tr td:nth-child(4)').then(($subtotais) => {
        const soma = [...$subtotais]
            .slice(0, 2)
            .reduce((acc, el) => acc + paraNumero(el.innerText), 0);

        checkoutPage.valorTotal.should(($el) => {
            expect(paraNumero($el.text())).to.be.closeTo(soma, 0.01);
        });
    });
});



})