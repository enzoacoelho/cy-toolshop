class Filtros {

    //elementos
    categoria(nome) {
        return cy
            .contains('fieldset label', new RegExp(`^\\s*${nome}\\s*$`))
            .find('input[type="checkbox"][name="category_id"]')
    }

    get sliderMin() { return cy.get('.ngx-slider-pointer-min') }
    get sliderMax() { return cy.get('.ngx-slider-pointer-max') }

    //ações
    filtrarCategoria(nome) {
        this.categoria(nome).check()
    }

    removerCategoria(nome) {
        this.categoria(nome).uncheck()
    }

    ajustarPrecoMaximo(passos) {
        this.sliderMax.focus().type('{leftarrow}'.repeat(passos))
    }

    ajustarPrecoMinimo(passos) {
        this.sliderMin.focus().type('{rightarrow}'.repeat(passos))
    }

}
export default new Filtros()