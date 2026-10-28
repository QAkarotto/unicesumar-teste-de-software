const chai = require('chai')
const sinon = require('sinon')

const sandbox = sinon.createSandbox()

const service = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')

describe('carrinhosService', () => {
  afterEach(() => sandbox.restore())

  // TESTE 1 — Comportamento esperado
  it('precoTotal - Deve calcular corretamente o preço total dos produtos', async () => {
    const produtos = [
      {
        idProduto: '12345678',
        quantidade: 1,
        precoUnitario: 10
      },
      {
        idProduto: '87654321',
        quantidade: 5,
        precoUnitario: 20
      },
      {
        idProduto: 'abc45678',
        quantidade: 11,
        precoUnitario: 2
      }
    ]

    const precoTotal = await service.precoTotal(produtos)

    chai.assert.equal(precoTotal, 132)
  })

  // TESTE 2 — Stub
  it('quantidadeTotal - Deve calcular a quantidade e utilizar a atualização em lote', async () => {
    const produtos = [
      {
        idProduto: '12345678',
        quantidade: 3,
        precoUnitario: 10
      },
      {
        idProduto: '87654321',
        quantidade: 105,
        precoUnitario: 20
      },
      {
        idProduto: 'abc45678',
        quantidade: 11,
        precoUnitario: 2
      }
    ]

    sandbox.stub(produtosService, 'updateQuantidadePorLote').resolves({})

    const quantidadeTotal = await service.quantidadeTotal(produtos)

    chai.assert.equal(quantidadeTotal, 119)
    sandbox.assert.calledOnce(produtosService.updateQuantidadePorLote)
  })

  // TESTE 3 — Cenário alternativo
  it('precoTotal - Deve retornar zero quando a lista de produtos estiver vazia', async () => {
    const precoTotal = await service.precoTotal([])

    chai.assert.equal(precoTotal, 0)
  })

  // TESTE 4 — Cenário de erro
  it('getProdutosComPrecoUnitarioOuErro - Deve propagar o erro retornado pelo serviço de produtos', async () => {
    const produtos = [
      {
        idProduto: 'produto-inexistente',
        quantidade: 1
      }
    ]

    const erroEsperado = {
      message: 'Produto não encontrado',
      item: {
        idProduto: 'produto-inexistente'
      },
      index: 0
    }

    sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({
        error: erroEsperado
      })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.exists(resultado.error)
    chai.assert.equal(resultado.error.message, 'Produto não encontrado')
    chai.assert.equal(resultado.error.item.idProduto, 'produto-inexistente')
    chai.assert.equal(resultado.error.item.index, 0)

    sandbox.assert.calledOnceWithExactly(
      produtosService.getPrecosUnitariosPorLote,
      produtos
    )
  })

  // TESTE 5 — Spy
  it('concluiCompra - Deve chamar deleteById com o identificador do carrinho', async () => {
    const carrinho = {
      _id: 'carrinho-inexistente'
    }

    const spy = sandbox.spy(service, 'deleteById')

    await service.concluiCompra(carrinho)

    sandbox.assert.calledOnceWithExactly(
      spy,
      'carrinho-inexistente'
    )
  })

  // TESTE 6 — Mock
  it('reabasteceEstoque - Deve solicitar a restauração do estoque com os produtos do carrinho', async () => {
    const produtos = [
      {
        idProduto: '12345678',
        quantidade: 2
      },
      {
        idProduto: '87654321',
        quantidade: 3
      }
    ]

    const mock = sandbox.mock(produtosService)

    mock
      .expects('restoreQuantidadePorLote')
      .once()
      .withExactArgs(produtos)
      .resolves({})

    await service.reabasteceEstoque(produtos)

    mock.verify()
  })
})
