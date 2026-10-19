class CheckoutPage {

    //elementos da página de checkout
    get etapas() {
        return cy.get('.steps-4');
    }

    get botaoContinuarComprando() {
        return cy.get('[data-test="continue-shopping"]');
    }

    get botaoAvancar() {
        return cy.get('[data-test="proceed-1"]');
    }

    // --- Etapa 1: Carrinho ---
    get tituloProduto() {
        return cy.get('[data-test="product-title"]');
    }

    get quantidadeProduto() {
        return cy.get('[data-test="product-quantity"]');
    }

    get botaoRemoverProduto() {
        return cy.get('tbody tr').first().find('.btn-danger');
    }

    get valorProduto() {
        return cy.get('[data-test="product-price"]');
    }

    get valorTotal() {
        return cy.get('[data-test="cart-total"]');
    }

    definirQuantidade(valor) {
        this.quantidadeProduto.clear().type(String(valor)).blur();
    }


    // --- Etapa 2: Sign in ---
    // ...

    // --- Etapa 3: Billing address ---
    // ...

    // --- Etapa 4: Payment ---
    // ...
}

export default new CheckoutPage();