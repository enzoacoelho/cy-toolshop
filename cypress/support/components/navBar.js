class NavbarComponent {
    get linkHome() {
        return cy.get('[data-test="nav-home"]');
    }

    get menuCategorias() {
        return cy.get('[data-test="nav-categories"]');
    }

    get linkContato() {
        return cy.get('[data-test="nav-contact"]');
    }

    get linkSignIn() {
        return cy.get('[data-test="nav-sign-in"]');
    }

    get iconeCarrinho() {
        return cy.get('[data-test="nav-cart"]');
    }

    get quantidadeCarrinho() {
        return cy.get('[data-test="cart-quantity"]');
    }

    get menuUsuario() {
    return cy.get('[data-test="nav-menu"]');
}

    get linkSair() {
        return cy.get('[data-test="nav-sign-out"]');
    }

    fazerLogout() {
        this.menuUsuario.click();
        this.linkSair.click();
    }

    abrirCarrinho() {
        this.iconeCarrinho.click();
    }
}

export default new NavbarComponent();