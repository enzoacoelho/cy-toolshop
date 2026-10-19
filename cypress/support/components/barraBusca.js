class BarraBusca {
    get campo() { return cy.get('[data-test="search-query"]') }
    get botaoBuscar() { return cy.get('[data-test="search-submit"]') }
    get botaoLimpar(){ return cy.get('[data-test="search-reset"]')}

    buscar(termo) {
        this.campo.clear().type(termo)
        this.botaoBuscar.click()
    }

    limparBusca(){
        this.botaoLimpar.click()
    }
}
export default new BarraBusca()