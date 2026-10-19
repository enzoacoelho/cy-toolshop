class ProdutoPage { 
    //elementos
    get nome () { return cy.get('[data-test="product-name"]')}
    get categoria () {return cy.get('[aria-label="category"]')}
    get marca () { return cy.get('[aria-label="brand"]')}
    get cor() {return cy.get('[data-test="co2-rating-badge"]')}
    get imagem(){return cy.get('.figure-img')}
    get descricao(){return cy.get('[data-test="product-description"]')}

    get addCarrinho () {return cy.get('[data-test="add-to-cart"]')}
    get favotirar(){return cy.get('[data-test="add-to-favorites"]')}
    get compararPrecos () {return cy.get('[data-test="add-to-compare"]')}

    get diminuirQuantidade() {return cy.get('[data-test="decrease-quantity"]')}
    get aumentarQuantidade(){return cy.get('[data-test="increase-quantity"]')}
    get quantidade(){return cy.get('[data-test="quantity"]')}


    

    //ações
    addicionarAoCarrinho(){
        this.addCarrinho.click()
    }

    aumentarQuantidade(){
        this.aumentarQuantidade.click()
    }

    diminuirQuantidade(){
        this.diminuirQuantidade.click()
    }
}

export default new ProdutoPage()