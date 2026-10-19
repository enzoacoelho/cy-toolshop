///<reference types="cypress"/>

import homePage from '../../support/pages/home.page'

describe('Busca e Filtros', () => {
    beforeEach('', () =>{
        cy.visit('')

    })

    it('Deve filtrar produtos pelo preço máximo', () => {
        homePage.filtros.ajustarPrecoMaximo(50)

        homePage.filtros.sliderMax.should('have.attr', 'aria-valuenow', '50')

        homePage.precosProduto.should(($precos) => {
            $precos.each((posicao, elementoPreco) => {
                const preco = parseFloat(elementoPreco.innerText.replace('$', ''))
                expect(preco).to.be.at.most(50)
            })
        })
    })

    it('Deve filtrar produtos pelo preço mínimo', () => {
        homePage.filtros.ajustarPrecoMinimo(50)

        homePage.filtros.sliderMin.should('have.attr', 'aria-valuenow', '51')

        homePage.precosProduto.should(($precos) => {
            $precos.each((posicao, elementoPreco) => {
                const preco = parseFloat(elementoPreco.innerText.replace('$', ''))
                expect(preco).to.be.at.least(51)
            })
        })
    })

    it('Deve filtrar produtos por categorias', () => {
        homePage.filtros.filtrarCategoria('Hammer')

        homePage.nomesProdutos.should('have.length.greaterThan', 0)
        homePage.nomesProdutos.should((nomes) => {
            nomes.each((posicao, nomeProduto)=>{
                expect(nomeProduto.innerText).to.match(/hammer/i)
            })
        })

        homePage.filtros.removerCategoria('Hammer')

        homePage.filtros.filtrarCategoria('Sander')
        homePage.nomesProdutos.should('have.length.greaterThan', 0)
        homePage.nomesProdutos.should((nomes) => {
            nomes.each((posicao, nomeProduto)=>{
                expect(nomeProduto.innerText).to.match(/sander/i)
            })
        })
    })
    
    it.only('Busca por produto inexistente no catálogo', () => {
        homePage.barraBusca.buscar('xyzxyz123');
        cy.wait(200)

        homePage.nomesProdutos.should('have.length', 0)
        cy.contains('There are no products found').should('be.visible')


    })

    it('Tratamento de Caracteres Especiais (XSS e SQL Injection) na Busca (Segurança)', () => {
        const alerta = cy.stub().as('alerta')
        cy.on('window:alert', alerta)

        homePage.barraBusca.buscar('<script>alert(1)</script>')

        cy.get('@alerta').should('not.have.been.called')
        cy.contains('Something went wrong').should('not.exist')
        homePage.nomesProdutos.should('have.length', 0)

        homePage.barraBusca.buscar("' OR 1=1 --")

        homePage.nomesProdutos.should('have.length', 0)
        cy.contains(/sql|syntax|exception|stack trace/i).should('not.exist')

    })

    it('Deve restaurar o Catálogo via Limpeza de Filtros', () => {
        homePage.cardsProduto.its('length').then((qtdInicial) => {
            homePage.filtros.filtrarCategoria('Hammer')
            homePage.nomesProdutos.should('have.length.greaterThan', 0)
            homePage.nomesProdutos.should((nomes) => {
                nomes.each((posicao, nomeProduto)=>{
                    expect(nomeProduto.innerText).to.match(/hammer/i)
                })
            })

            homePage.filtros.ajustarPrecoMaximo(50)
            homePage.filtros.sliderMax.should('have.attr', 'aria-valuenow', '50')
            homePage.precosProduto.should(($precos) => {
                $precos.each((posicao, elementoPreco) => {
                    const preco = parseFloat(elementoPreco.innerText.replace('$', ''))
                    expect(preco).to.be.at.most(50)
                })
            })

            homePage.barraBusca.limparBusca()
            homePage.filtros.categoria('Hammer').should('not.be.checked')
            homePage.filtros.sliderMax.should('have.attr', 'aria-valuenow', '100')
        })
    })

    
})