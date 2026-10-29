const chai = require('chai')
const sandbox = require('sinon').createSandbox()

const { checkToken, checkAdm } = require('../../src/middlewares/authentication-middleware')
const authService = require('../../src/services/auth-service')
const usuariosService = require('../../src/services/usuarios-service')
const constant = require('../../src/utils/constants')

const credenciais = { email: 'ana@qa.com', password: 'senha123' }
const tokenFalso = 'Bearer token.de.teste'

// Doubles de req/res/next criados a cada teste (testes independentes)
function criarReq (authorization) {
  return { headers: authorization === undefined ? {} : { authorization } }
}

function criarRes () {
  const res = {}
  res.status = sandbox.stub().returns(res) // stub: permite encadear .status().send()
  res.send = sandbox.spy() // spy: apenas observa o que foi enviado
  return res
}

describe('authentication-middleware', () => {
  afterEach(() => sandbox.restore())

  describe('checkToken', () => {
    // Unidade: checkToken | Dependências substituídas: authService.verifyToken e usuariosService.existeUsuario | Double: stub
    it('comportamento esperado - chama next() quando o token é válido e o usuário existe', async () => {
      sandbox.stub(authService, 'verifyToken').returns(credenciais)
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'abc123' })
      const res = criarRes()
      const next = sandbox.spy()

      await checkToken(criarReq(tokenFalso), res, next)

      sandbox.assert.calledOnce(next)
      sandbox.assert.notCalled(res.status)
    })

    // Cenário alternativo: sem header, nem consulta o banco
    it('cenário alternativo - responde 401 e não consulta o banco quando não há Authorization', async () => {
      const existeUsuario = sandbox.stub(usuariosService, 'existeUsuario')
      const res = criarRes()
      const next = sandbox.spy()

      await checkToken(criarReq(), res, next)

      sandbox.assert.calledWith(res.status, 401)
      sandbox.assert.calledWith(res.send, { message: constant.INVALID_TOKEN })
      sandbox.assert.notCalled(next)
      sandbox.assert.notCalled(existeUsuario)
    })

    // Cenário de erro: dependência falha
    it('cenário de erro - propaga a falha do banco e não chama next()', async () => {
      sandbox.stub(authService, 'verifyToken').returns(credenciais)
      sandbox.stub(usuariosService, 'existeUsuario').rejects(new Error('falha no banco'))
      const res = criarRes()
      const next = sandbox.spy()

      let erro
      try {
        await checkToken(criarReq(tokenFalso), res, next)
      } catch (e) {
        erro = e
      }

      chai.expect(erro.message).to.equal('falha no banco')
      sandbox.assert.notCalled(next)
      sandbox.assert.notCalled(res.status)
    })

    // Spy: observa argumentos mantendo o comportamento real do JWT
    it('spy - verifica o token recebido e as credenciais usadas na consulta ao usuário', async () => {
      const token = `Bearer ${authService.createToken(credenciais)}`
      const verifySpy = sandbox.spy(authService, 'verifyToken') // sem stub: executa o real
      const existeUsuario = sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'abc123' })
      const next = sandbox.spy()

      await checkToken(criarReq(token), criarRes(), next)

      sandbox.assert.calledWith(verifySpy, token)
      sandbox.assert.calledWith(existeUsuario, credenciais)
      sandbox.assert.calledOnce(next)
    })
  })

  describe('checkAdm', () => {
    // Stub controlando o retorno: usuário comum
    it('responde 403 quando o usuário não é administrador', async () => {
      sandbox.stub(authService, 'verifyToken').returns(credenciais)
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'abc123' })
      sandbox.stub(usuariosService, 'usuarioEhAdministrador').resolves(false)
      const res = criarRes()
      const next = sandbox.spy()

      await checkAdm(criarReq(tokenFalso), res, next)

      sandbox.assert.calledWith(res.status, 403)
      sandbox.assert.calledWith(res.send, { message: constant.REQUIRED_ADMIN })
      sandbox.assert.notCalled(next)
    })

    // Mock: a consulta de administrador faz parte do comportamento esperado
    it('mock - consulta o perfil do usuário com as credenciais do token e libera o acesso do administrador', async () => {
      sandbox.stub(authService, 'verifyToken').returns(credenciais)
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'abc123' })
      const mock = sandbox.mock(usuariosService)
      mock.expects('usuarioEhAdministrador').once().withExactArgs(credenciais).resolves(true)
      const next = sandbox.spy()

      await checkAdm(criarReq(tokenFalso), criarRes(), next)

      mock.verify() // falha se não foi chamado exatamente 1 vez com esses argumentos
      sandbox.assert.calledOnce(next)
    })

    // Mock negativo: interação que NÃO pode acontecer
    it('mock - não consulta o perfil de administrador quando o token é inválido', async () => {
      const mock = sandbox.mock(usuariosService)
      mock.expects('usuarioEhAdministrador').never()
      const res = criarRes()
      const next = sandbox.spy()

      await checkAdm(criarReq(), res, next)

      mock.verify()
      sandbox.assert.calledWith(res.status, 401)
      sandbox.assert.notCalled(next)
    })
  })
})