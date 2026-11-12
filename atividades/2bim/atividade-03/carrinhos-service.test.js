
const chai = require('chai')
const sinon = require('sinon')

const service = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')

describe('carrinhosService', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  // Teste 1: comportamento esperado
  it('precoTotal - deve calcular o preço total dos produtos', async () => {
    const produtos = [
      { idProduto: '12345678', quantidade: 1, precoUnitario: 10 },
      { idProduto: '87654321', quantidade: 5, precoUnitario: 20 },
      { idProduto: 'abc45678', quantidade: 11, precoUnitario: 2 }
    ]

    const resultado = await service.precoTotal(produtos)

    chai.expect(resultado).to.equal(132)
  })

  // Teste 2: stub controla a dependência
  it('quantidadeTotal - deve calcular a quantidade e atualizar o estoque', async () => {
    const produtos = [
      { idProduto: '12345678', quantidade: 3, precoUnitario: 10 },
      { idProduto: '87654321', quantidade: 105, precoUnitario: 20 },
      { idProduto: 'abc45678', quantidade: 11, precoUnitario: 2 }
    ]

    const atualizacao = sandbox
      .stub(produtosService, 'updateQuantidadePorLote')
      .resolves({})

    const resultado = await service.quantidadeTotal(produtos)

    chai.expect(resultado).to.equal(119)
    sinon.assert.calledOnceWithExactly(atualizacao, produtos)
  })

  // Teste 3: cenário alternativo
it('extrairProdutosDuplicados - deve retornar os IDs duplicados', () => {
  const produtos = [
    { idProduto: 'produto1' },
    { idProduto: 'produto1' },
    { idProduto: 'produto2' }
  ]

  const resultado = service.extrairProdutosDuplicados(produtos)

  chai.expect(resultado).to.deep.equal(['produto1'])
})

  // Teste 4: cenário sem duplicados
  it('extrairProdutosDuplicados - deve retornar uma lista vazia sem duplicados', () => {
    const produtos = [
      { idProduto: 'produto1' },
      { idProduto: 'produto2' },
      { idProduto: 'produto3' }
    ]

    const resultado = service.extrairProdutosDuplicados(produtos)

    chai.expect(resultado).to.deep.equal([])
  })

  // Teste 5: stub simula o retorno da consulta de preços
  it('getProdutosComPrecoUnitarioOuErro - deve retornar os preços encontrados', async () => {
    const produtos = [{ idProduto: 'produto1', quantidade: 2 }]
    const produtosComPreco = [
      { idProduto: 'produto1', precoUnitario: 10 }
    ]

    sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ produtosComPreco, error: null })

    const resultado =
      await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.expect(resultado).to.deep.equal({
      produtosComPrecoUnitario: produtosComPreco
    })
  })

  // Teste 6: cenário de erro
  it('getProdutosComPrecoUnitarioOuErro - deve retornar o erro da consulta', async () => {
    const produtos = [{ idProduto: 'produto1', quantidade: 2 }]
    const erroSimulado = {
      message: 'Produto não encontrado',
      index: 0,
      item: { idProduto: 'produto1' }
    }

    sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({
        produtosComPreco: [],
        error: erroSimulado
      })

    const resultado =
      await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.expect(resultado).to.deep.equal({
      error: {
        message: 'Produto não encontrado',
        index: 0,
        item: { idProduto: 'produto1', index: 0 }
      }
    })
  })

  // Teste 7: spy observa a chamada de exclusão
  it('concluiCompra - deve solicitar a exclusão do carrinho', async () => {
    const observador = sinon.spy()

    sandbox.stub(service, 'deleteById').callsFake(async (id) => {
      observador(id)
    })

    await service.concluiCompra({ _id: 'carrinho123' })

    sinon.assert.calledOnceWithExactly(observador, 'carrinho123')
  })

  // Teste 8: mock verifica as interações esperadas
  it('removeCarrinho - deve reabastecer o estoque e excluir o carrinho', async () => {
    const produtos = [{ idProduto: 'produto1', quantidade: 2 }]
    const carrinho = { _id: 'carrinho123', produtos }

    const mock = sandbox.mock(service)

    mock.expects('reabasteceEstoque')
      .once()
      .withArgs(produtos)

    mock.expects('deleteById')
      .once()
      .withArgs('carrinho123')

    await service.removeCarrinho(carrinho)

    mock.verify()
  })
})
