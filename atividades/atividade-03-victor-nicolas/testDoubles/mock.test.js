const sinon = require('sinon')

const carrinhosService = require(
  '../../../src/services/carrinhos-service'
)

describe('Teste 06 - Mock', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('Deve excluir o carrinho ao concluir a compra', async () => {
    // Arrange - preparar os dados
    const carrinho = {
      _id: '123',
      produtos: [
        {
          idProduto: '456',
          quantidade: 2
        }
      ]
    }

    // Criar o Mock
    const mock = sinon.mock(carrinhosService)

    // Definir a interacao esperada
    mock.expects('deleteById')
      .once()
      .withExactArgs('123')
      .resolves()

    // Act - executar a funcao real
    await carrinhosService.concluiCompra(carrinho)

    // Assert - verificar as expectativas
    mock.verify()
  })
})
