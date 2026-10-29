const sandbox = require('sinon').createSandbox()
const controller = require('serverest/src/controllers/login-controller')
const usuariosService = require('serverest/src/services/usuarios-service')
const authService = require('serverest/src/services/auth-service')
const constant = require('serverest/src/utils/constants')

const criarRespostaFake = require('./helpers/resposta-fake')

describe('loginController', () => {
  afterEach(() => sandbox.restore())

  it('[mock] deve validar as credenciais e gerar o token a partir delas, retornando-o com prefixo Bearer', async () => {
    const credenciais = { email: 'fulano@qa.com', password: 'teste' }
    const usuariosMock = sandbox.mock(usuariosService)
    usuariosMock.expects('existeUsuario').once().withExactArgs(credenciais).resolves({ _id: 'abc123', ...credenciais })
    const authMock = sandbox.mock(authService)
    authMock.expects('createToken').once().withExactArgs(credenciais).returns('token-falso')
    const req = { body: credenciais }
    const res = criarRespostaFake(sandbox)

    await controller.post(req, res)

    usuariosMock.verify()
    authMock.verify()
    sandbox.assert.calledOnceWithExactly(res.status, 200)
    sandbox.assert.calledOnceWithExactly(res.send, { message: constant.LOGIN_SUCCESS, authorization: 'Bearer token-falso' })
  })

  it('[spy] deve responder 401 e não gerar token quando as credenciais são inválidas (cenário de erro)', async () => {
    sandbox.stub(usuariosService, 'existeUsuario').resolves(null)
    const createToken = sandbox.spy(authService, 'createToken')
    const req = { body: { email: 'fulano@qa.com', password: 'senhaErrada' } }
    const res = criarRespostaFake(sandbox)

    await controller.post(req, res)

    sandbox.assert.notCalled(createToken)
    sandbox.assert.calledOnceWithExactly(res.status, 401)
    sandbox.assert.calledOnceWithExactly(res.send, { message: constant.LOGIN_FAIL })
  })
})
