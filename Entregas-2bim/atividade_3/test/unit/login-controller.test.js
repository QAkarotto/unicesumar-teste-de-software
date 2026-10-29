'use strict'

const { expect } = require('chai')
const sandbox = require('sinon').createSandbox()

const serverest = require('./support/serverest')
const { fakeReq, fakeRes, corpoDaResposta } = require('./support/express')

// Unidade testada
const loginController = serverest('controllers/login-controller')
// Dependências que serão substituídas
const authService = serverest('services/auth-service')
const usuariosService = serverest('services/usuarios-service')

describe('login-controller', () => {
  const credenciais = { email: 'fulano@qa.com', password: 'teste' }

  afterEach(() => sandbox.restore())

  it('CT05 - deve responder 200 com o token gerado prefixado por "Bearer" quando as credenciais existem', async () => {
    // Stub: o usuário "existe" sem consultar o banco
    sandbox.stub(usuariosService, 'existeUsuario').resolves({ _id: 'u1', ...credenciais })
    // Stub: retorno previsível no lugar de um JWT real (que muda a cada execução)
    const createToken = sandbox.stub(authService, 'createToken').returns('token.gerado.fake')
    const res = fakeRes(sandbox)

    await loginController.post(fakeReq({ body: credenciais }), res)

    sandbox.assert.calledOnceWithExactly(res.status, 200)
    expect(corpoDaResposta(res)).to.deep.equal({
      message: 'Login realizado com sucesso',
      authorization: 'Bearer token.gerado.fake'
    })
    // O token é gerado a partir das credenciais recebidas na requisição
    sandbox.assert.calledOnceWithExactly(createToken, credenciais)
  })

  it('CT06 - deve responder 401 e não gerar token quando as credenciais não existem', async () => {
    sandbox.stub(usuariosService, 'existeUsuario').resolves(null)
    const createToken = sandbox.spy(authService, 'createToken')
    const res = fakeRes(sandbox)

    await loginController.post(fakeReq({ body: credenciais }), res)

    sandbox.assert.calledOnceWithExactly(res.status, 401)
    expect(corpoDaResposta(res)).to.deep.equal({ message: 'Email e/ou senha inválidos' })
    expect(corpoDaResposta(res)).to.not.have.property('authorization')
    sandbox.assert.notCalled(createToken)
  })
})
