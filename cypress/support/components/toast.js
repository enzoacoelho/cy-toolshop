class Toast {
    get alerta() {
        return cy.get('.toast-message');
    }

    //mensagens
    mensagens = {
        sucessoAddCarrinho: 'Product added to shopping cart.',
        sucessoAddFavorito: 'Product added to favorites',
        erroAddFavorito: 'Unauthorized, can not add product to your favorite list.',
        limiteAddCarrinho: 'You can order at most 99 of this product.',
        removidoCarrinho: 'Product deleted',     
        quantidadeAtualizada: 'Product quantity updated'
    }
}

export default new Toast();