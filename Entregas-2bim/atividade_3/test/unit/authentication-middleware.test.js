'use strict'

const { expect } = require('chai')
const sandbox = require('sinon').createSandbox()

const serverest = require('./support/serverest')
const { fakeReq, fakeRes, corpoDaResposta } = require('./support/express')

// Unidade testada
const middleware = serverest('middlewares/authentication-middleware')
// Dependências que serão substituídas
const authService = serverest('services/auth-service')
const usuariosService = serverest('services/usuarios-service')

describe('authentication-middleware', () => {
  const tokenDecodificado = { email: 'admin@qa.com', password: 'teste' }
  const cabecalhoValido = { authorization: 'Bearer header.payload.assinatura' }

  afterEach(() => sandbox.restore())

  describe('checkAdm', () => {
    it('CT01 - deve liberar a rota (next) quando o token é válido e o usuário é administrador', async () => {
      // Stubs: controlam o retorno das dependências sem JWT real e sem banco de dados
      sandbox.stub(authService, 'verifyToken').returns(tokenDecodificado)
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'u1', ...tokenDecodificado })
      sandbox.stub(usuariosService, 'usuarioEhAdministrador').resolves(true)
      const next = sandbox.spy() // Spy: observa se o middleware chamou o próximo handler
      const res = fakeRes(sandbox)

      await middleware.checkAdm(fakeReq({ headers: cabecalhoValido }), res, next)

      sandbox.assert.calledOnce(next)
      sandbox.assert.notCalled(res.status)
    })

    it('CT02 - deve responder 403 quando o token é válido mas o usuário não é administrador', async () => {
      sandbox.stub(authService, 'verifyToken').returns(tokenDecodificado)
      sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'u1', ...tokenDecodificado })
      const ehAdmin = sandbox.stub(usuariosService, 'usuarioEhAdministrador').resolves(false)
      const next = sandbox.spy()
      const res = fakeRes(sandbox)

      await middleware.checkAdm(fakeReq({ headers: cabecalhoValido }), res, next)

      sandbox.assert.calledOnceWithExactly(res.status, 403)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Rota exclusiva para administradores' })
      sandbox.assert.notCalled(next)
      // A verificação de perfil recebe exatamente o conteúdo decodificado do token
      sandbox.assert.calledOnceWithExactly(ehAdmin, tokenDecodificado)
    })
  })

  describe('checkToken', () => {
    it('CT03 - deve responder 401 sem nem decodificar o token quando o esquema não é "Bearer"', async () => {
      const verifyToken = sandbox.spy(authService, 'verifyToken')
      const existeUsuario = sandbox.spy(usuariosService, 'existeUsuario')
      const next = sandbox.spy()
      const res = fakeRes(sandbox)

      // Há um token depois do espaço; o que está errado é apenas o esquema ("Basic" em vez de "Bearer")
      await middleware.checkToken(fakeReq({ headers: { authorization: 'Basic header.payload.assinatura' } }), res, next)

      sandbox.assert.calledOnceWithExactly(res.status, 401)
      expect(corpoDaResposta(res)).to.deep.equal({
        message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
      })
      sandbox.assert.notCalled(next)
      // Spies mostram que o middleware interrompe a validação antes de usar as dependências
      sandbox.assert.notCalled(verifyToken)
      sandbox.assert.notCalled(existeUsuario)
    })

    it('CT04 - deve responder 401 quando o token é válido mas o usuário do token não existe mais', async () => {
      sandbox.stub(authService, 'verifyToken').returns(tokenDecodificado)
      const existeUsuario = sandbox.stub(usuariosService, 'existeUsuario').resolves(null)
      const next = sandbox.spy()
      const res = fakeRes(sandbox)

      await middleware.checkToken(fakeReq({ headers: cabecalhoValido }), res, next)

      sandbox.assert.calledOnceWithExactly(res.status, 401)
      sandbox.assert.notCalled(next)
      // A busca do usuário usa e-mail e senha vindos do token
      sandbox.assert.calledOnceWithExactly(existeUsuario, tokenDecodificado)
    })
  })
})
