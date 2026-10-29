const { expect } = require('chai')

const montarMensagemDeErroDeSchema = require(
  '../../../src/utils/montarMensagemDeErroDeSchema'
)

describe('Teste 03 - Cenario de erro', () => {
  it('Deve retornar mensagem para email invalido', () => {
    // Arrange - preparar o erro simulado
    const erro = {
      details: {
        body: [
          {
            type: 'string.email',
            context: {
              label: 'email'
            }
          }
        ]
      }
    }

    // Act - executar a funcao real
    const resultado = montarMensagemDeErroDeSchema(erro)

    // Assert - verificar a mensagem
    expect(resultado.email).to.equal(
      'email deve ser um email válido'
    )
  })
})
