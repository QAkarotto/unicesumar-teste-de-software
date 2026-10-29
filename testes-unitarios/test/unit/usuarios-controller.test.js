const chai = require('chai')
const sandbox = require('sinon').createSandbox()

const controller = require('serverest/src/controllers/usuarios-controller')
const usuariosService = require('serverest/src/services/usuarios-service')
const carrinhosService = require('serverest/src/services/carrinhos-service')
const constant = require('serverest/src/utils/constants')

const criarRespostaFake = require('./helpers/resposta-fake')

describe('usuariosController', () => {
  afterEach(() => sandbox.restore())

  describe('getOne', () => {
    it('[stub] deve responder 200 com o usuário retornado pelo service', async () => {
      const usuario = { 
        _id: 'abc123', 
        nome: 'Fulano', 
        email: 'fulano@qa.com', 
        password: 'teste', 
        administrador: 'true' 
      }
      sandbox.stub(usuariosService, 'getOne').resolves(usuario)
      const req = { params: { id: 'abc123' } }
      const res = criarRespostaFake(sandbox)

      await controller.getOne(req, res)

      sandbox.assert.calledOnceWithExactly(res.status, 200)
      sandbox.assert.calledOnceWithExactly(res.send, usuario)
    })

    it('[stub] deve responder 400 quando o service não encontra o usuário (cenário alternativo)', async () => {
      sandbox.stub(usuariosService, 'getOne').resolves(null)
      const req = { params: { id: 'inexistente' } }
      const res = criarRespostaFake(sandbox)

      await controller.getOne(req, res)

      sandbox.assert.calledOnceWithExactly(res.status, 400)
      sandbox.assert.calledOnceWithExactly(res.json, { message: constant.USER_NOT_FOUND })
    })
  })

  describe('post', () => {
    it('[stub + spy] deve consultar o e-mail informado e cadastrar o usuário com o body recebido', async () => {
      const body = { nome: 'Beltrano', email: 'beltrano@qa.com', password: 'teste', administrador: 'false' }
      sandbox.stub(usuariosService, 'existeUsuario').resolves(null)
      sandbox.stub(usuariosService, 'createUser').resolves({ ...body, _id: 'novoId' })
      const req = { body }
      const res = criarRespostaFake(sandbox)

      await controller.post(req, res)

      sandbox.assert.calledOnceWithExactly(usuariosService.existeUsuario, { email: 'beltrano@qa.com' })
      sandbox.assert.calledOnceWithExactly(usuariosService.createUser, body)
      sandbox.assert.calledOnceWithExactly(res.status, 201)
      chai.assert.deepEqual(res.send.firstCall.args[0], { message: constant.POST_SUCCESS, _id: 'novoId' })
    })

    it('[stub] deve responder 400 e não cadastrar quando o e-mail já está em uso (cenário de erro)', async () => {
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'existente', email: 'repetido@qa.com' })
      const createUser = sandbox.stub(usuariosService, 'createUser')
      const req = { body: { nome: 'Ciclano', email: 'repetido@qa.com', password: 'teste', administrador: 'true' } }
      const res = criarRespostaFake(sandbox)

      await controller.post(req, res)

      sandbox.assert.calledOnceWithExactly(res.status, 400)
      sandbox.assert.calledOnceWithExactly(res.send, { message: constant.EMAIL_ALREADY_USED })
      sandbox.assert.notCalled(createUser)
    })
  })

  describe('delete', () => {
    it('[mock] não deve excluir usuário que possui carrinho cadastrado', async () => {
      const carrinhosMock = sandbox.mock(carrinhosService)
      carrinhosMock.expects('existeCarrinho').once().withExactArgs({ idUsuario: 'usuarioComCarrinho' }).resolves({ _id: 'carrinho1' })
      const usuariosMock = sandbox.mock(usuariosService)
      usuariosMock.expects('deleteById').never()
      const req = { params: { id: 'usuarioComCarrinho' } }
      const res = criarRespostaFake(sandbox)

      await controller.delete(req, res)

      carrinhosMock.verify()
      usuariosMock.verify()
      sandbox.assert.calledOnceWithExactly(res.status, 400)
      sandbox.assert.calledOnceWithExactly(res.send, { message: constant.DELETE_USER_WITH_CART, idCarrinho: 'carrinho1' })
    })
  })
})
