import barraBusca from '../components/barraBusca'
import filtros from '../components/filtros'

class HomePage {
    barraBusca = barraBusca
    filtros = filtros

    get listaProdutos(){ return cy.get('.col-md-9 > .container')}
    get precosProduto() { return cy.get('[data-test="product-price"]') }
    get nomesProdutos(){return cy.get('[data-test="product-name"]')}
    get cardsProduto() { return cy.get('[data-test^="product-"]') }

 


    visitar() { 
        cy.visit('/') 
    }
}
export default new HomePage()