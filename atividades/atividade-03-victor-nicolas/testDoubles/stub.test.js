const { expect } = require('chai')
const sinon = require('sinon')

const carrinhosService = require(
  '../../../src/services/carrinhos-service'
)

const produtosService = require(
  '../../../src/services/produtos-service'
)

describe('Teste 04 - Stub', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('Deve retornar produtos com preco usando Stub', async () => {
    // Arrange - preparar os dados
    const produtos = [
      {
        idProduto: '123',
        quantidade: 2
      }
    ]

    // Criar o Stub para simular a resposta
    sinon.stub(
      produtosService,
      'getPrecosUnitariosPorLote'
    ).resolves({
      produtosComPreco: [
        {
          idProduto: '123',
          quantidade: 2,
          precoUnitario: 50
        }
      ]
    })

    // Act - executar a funcao real
    const resultado =
      await carrinhosService.getProdutosComPrecoUnitarioOuErro(
        produtos
      )

    // Assert - verificar o resultado
    expect(resultado.produtosComPrecoUnitario).to.deep.equal([
      {
        idProduto: '123',
        quantidade: 2,
        precoUnitario: 50
      }
    ])
  })
})
