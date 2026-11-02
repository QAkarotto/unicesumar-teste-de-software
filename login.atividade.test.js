const sinon = require('sinon')
const { expect } = require('chai')

const loginController = require('../../src/controllers/login-controller')
const usuariosService = require('../../src/services/usuarios-service')
const authService = require('../../src/services/auth-service')
const constant = require('../../src/utils/constants')

describe('Atividade 03: Testes Unitários do Login (Test Doubles)', () => {
  let req, res

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  it('Deve realizar login com sucesso e retornar status 200 (Comportamento esperado + Stub)', async () => {
    req.body = { email: 'teste@qa.com', password: '123' }
    sinon.stub(usuariosService, 'existeUsuario').resolves(true)
    sinon.stub(authService, 'createToken').returns('token-falso')

    await loginController.post(req, res)

    expect(res.status.calledWith(200)).to.equal(true)
    expect(res.send.calledWithMatch({ message: constant.LOGIN_SUCCESS })).to.equal(true)
  })

  it('Deve falhar ao tentar logar com credenciais inválidas (Cenário Alternativo)', async () => {
    req.body = { email: 'invalido@qa.com', password: 'errado' }
    sinon.stub(usuariosService, 'existeUsuario').resolves(false)

    await loginController.post(req, res)

    expect(res.status.calledWith(401)).to.equal(true)
    expect(res.send.calledWithMatch({ message: constant.LOGIN_FAIL })).to.equal(true)
  })

  it('Deve lançar uma exceção se o serviço de usuários falhar (Cenário de Erro)', async () => {
    req.body = { email: 'erro@qa.com', password: '123' }
    const erroSimulado = new Error('Falha no banco de dados')
    sinon.stub(usuariosService, 'existeUsuario').rejects(erroSimulado)

    try {
      await loginController.post(req, res)
      expect.fail('Deveria ter lançado um erro')
    } catch (error) {
      expect(error.message).to.equal('Falha no banco de dados')
    }
  })

  it('Deve garantir que o serviço de token seja chamado com os dados do request (Spy)', async () => {
    req.body = { email: 'spy@qa.com', password: '123' }
    sinon.stub(usuariosService, 'existeUsuario').resolves(true)
    const tokenSpy = sinon.spy(authService, 'createToken')

    await loginController.post(req, res)

    expect(tokenSpy.calledOnce).to.equal(true)
    expect(tokenSpy.calledWith(req.body)).to.equal(true)
  })

  it('Deve verificar se a função existeUsuario foi chamada com os dados exatos (Spy)', async () => {
    req.body = { email: 'verificacao@qa.com', password: 'senha123' }
    const buscaSpy = sinon.stub(usuariosService, 'existeUsuario').resolves(false)

    await loginController.post(req, res)

    expect(buscaSpy.calledOnce).to.equal(true)
    expect(buscaSpy.calledWith(req.body)).to.equal(true)
  })

  it('Deve validar a interação exata com a resposta em caso de falha (Mock)', async () => {
    req.body = { email: 'mock@qa.com', password: '123' }
    sinon.stub(usuariosService, 'existeUsuario').resolves(false)

    res = {
      status: sinon.stub().returnsThis(),
      send: function () {}
    }

    const resMock = sinon.mock(res)
    resMock.expects('send').once().withArgs({ message: constant.LOGIN_FAIL })

    await loginController.post(req, res)

    resMock.verify()
  })
})
