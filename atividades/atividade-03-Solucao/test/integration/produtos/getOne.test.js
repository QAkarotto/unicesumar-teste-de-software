const chai = require('chai')

const rotaProdutos = '/produtos'
const utils = require('../utils')

describe(`${rotaProdutos}/:id GET`, () => {
  it('Busca um produto específico', async () => {
    const { email, password } = await utils.cadastrarUsuario({ administrador: 'true' })
    const { authorization } = await utils.login(email, password)
    const produto = await utils.cadastrarProduto({ authorization })

    const { body } = await request.get(`${rotaProdutos}/${produto._id}`).expect(200)

    chai.assert.deepEqual(body, produto)
  })

  it('Nenhum produto encontrado', async () => {
    const { body } = await request.get(`${rotaProdutos}/zl1aduaaaaaaafiF`).expect(400)
    chai.assert.deepEqual(body, {
      message: 'Produto não encontrado'
    })
  })

  it('Bad request - Deve retornar erro ao enviar Id que não consista de 16 caracteres alfanuméricos', async () => {
    const { body } = await request.get(`${rotaProdutos}/:_id`).expect(400)
    chai.assert.deepEqual(body, {
      id: 'id deve ter exatamente 16 caracteres alfanuméricos'
    })
  })
})
