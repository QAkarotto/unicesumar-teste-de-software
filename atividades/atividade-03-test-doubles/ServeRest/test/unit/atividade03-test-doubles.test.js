
'use strict'

const chai = require('chai')
const sinon = require('sinon')

const service = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')

describe('Atividade 03 - Test Doubles - Luiz e Jefferson', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('01 - Deve calcular o preço total corretamente', async () => {
    const produtos = [
      { idProduto: '1', precoUnitario: 10, quantidade: 2 },
      { idProduto: '2', precoUnitario: 20, quantidade: 3 }
    ]

    const resultado = await service.precoTotal(produtos)

    chai.assert.equal(resultado, 80)
  })

  it('02 - Deve retornar zero para carrinho vazio', async () => {
    const resultado = await service.precoTotal([])

    chai.assert.equal(resultado, 0)
  })

  it('03 - Deve identificar produtos duplicados', () => {
    const produtos = [
      { idProduto: '123' },
      { idProduto: '123' }
    ]

    const resultado = service.extrairProdutosDuplicados(produtos)

    chai.assert.deepEqual(resultado, ['123'])
  })

  it('04 - Stub: deve controlar o retorno da consulta de preços', async () => {
    const produtos = [{ idProduto: '123', quantidade: 2 }]

    const stub = sandbox.stub(
      produtosService,
      'getPrecosUnitariosPorLote'
    ).resolves({
      produtosComPreco: [
        { idProduto: '123', quantidade: 2, precoUnitario: 50 }
      ]
    })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.equal(
      resultado.produtosComPrecoUnitario[0].precoUnitario,
      50
    )

    sandbox.assert.calledOnceWithExactly(stub, produtos)
  })

  it('05 - Deve retornar erro controlado pela dependência', async () => {
    const produtos = [{ idProduto: 'inexistente', quantidade: 1 }]

    sandbox.stub(
      produtosService,
      'getPrecosUnitariosPorLote'
    ).resolves({
      error: {
        index: 0,
        item: produtos[0],
        message: 'Produto não encontrado'
      }
    })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.equal(resultado.error.index, 0)
    chai.assert.equal(
      resultado.error.message,
      'Produto não encontrado'
    )
    chai.assert.equal(resultado.error.item.index, 0)
  })

  it('06 - Spy: deve observar a chamada de atualização de estoque', async () => {
    const produtos = [
      { idProduto: '123', quantidade: 3 }
    ]

    const spy = sandbox.spy()
    sandbox.stub(
      produtosService,
      'updateQuantidadePorLote'
    ).callsFake(spy)

    const resultado = await service.quantidadeTotal(produtos)

    chai.assert.equal(resultado, 3)
    sandbox.assert.calledOnceWithExactly(spy, produtos)
  })

  it('07 - Mock: deve exigir a restauração do estoque', async () => {
    const produtos = [
      { idProduto: '123', quantidade: 2 }
    ]

    const mock = sandbox.mock(produtosService)

    mock.expects('restoreQuantidadePorLote')
      .once()
      .withExactArgs(produtos)
      .resolves()

    await service.reabasteceEstoque(produtos)

    mock.verify()
  })

  it('08 - Deve propagar erro na atualização do estoque', async () => {
    const produtos = [
      { idProduto: '123', quantidade: 2 }
    ]

    sandbox.stub(
      produtosService,
      'updateQuantidadePorLote'
    ).rejects(new Error('Falha ao atualizar estoque'))

    try {
      await service.quantidadeTotal(produtos)
      chai.assert.fail('Era esperado um erro')
    } catch (error) {
      chai.assert.equal(
        error.message,
        'Falha ao atualizar estoque'
      )
    }
  })
})
