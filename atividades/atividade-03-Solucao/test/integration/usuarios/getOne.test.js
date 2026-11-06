const chai = require('chai')
const constants = require('../../../src/utils/constants')

const rotaUsuarios = '/usuarios'
const utils = require('../utils')

describe(`${rotaUsuarios}/:id GET`, () => {
  it('Param - Busca um usuário', async () => {
    const usuario = await utils.cadastrarUsuario()
    const { body } = await request.get(`${rotaUsuarios}/${usuario._id}`).expect(200)

    chai.assert.deepEqual(body, {
      nome: usuario.nome,
      email: usuario.email,
      password: usuario.password,
      administrador: usuario.administrador,
      _id: usuario._id
    })
  })

  it('Param - Nenhum usuário encontrado', async () => {
    const { body } = await request.get(`${rotaUsuarios}/zl1aduaaaaaaafiF`).expect(400)
    chai.assert.deepEqual(body, {
      message: constants.USER_NOT_FOUND
    })
  })

  it('Bad request - Deve retornar erro ao enviar Id que não consista de 16 caracteres alfanuméricos', async () => {
    const { body } = await request.get(`${rotaUsuarios}/:_id`).expect(400)
    chai.assert.deepEqual(body, {
      id: 'id deve ter exatamente 16 caracteres alfanuméricos'
    })
  })
})
