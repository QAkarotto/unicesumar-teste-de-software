const sandbox = require('sinon').createSandbox()
const middleware = require('serverest/src/middlewares/authentication-middleware')
const authService = require('serverest/src/services/auth-service')
const constant = require('serverest/src/utils/constants')

const criarRespostaFake = require('./helpers/resposta-fake')

describe('authenticationMiddleware', () => {
  afterEach(() => sandbox.restore())

  describe('checkToken', () => {
    it('[spy] deve responder 401 sem consultar o token quando o header não tem o prefixo Bearer', async () => {
      const verifyToken = sandbox.spy(authService, 'verifyToken')
      const next = sandbox.spy()
      const req = { headers: { authorization: 'token-sem-bearer' } }
      const res = criarRespostaFake(sandbox)

      await middleware.checkToken(req, res, next)

      sandbox.assert.notCalled(next)
      sandbox.assert.notCalled(verifyToken)
      sandbox.assert.calledOnceWithExactly(res.status, 401)
      sandbox.assert.calledOnceWithExactly(res.send, { message: constant.INVALID_TOKEN })
    })
  })
})
