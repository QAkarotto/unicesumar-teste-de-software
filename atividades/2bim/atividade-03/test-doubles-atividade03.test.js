
const chai = require('chai')
const sinon = require('sinon')
const axios = require('axios')

const {
  normalizeVersion,
  fetchLatestRelease
} = require('../../src/utils/github-release')

const RELEASES_URL =
  'https://api.github.com/repos/ServeRest/ServeRest/releases/latest'

describe('Atividade 03 - Test Doubles', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  // Teste 1: comportamento esperado
  it('deve normalizar uma versão com prefixo v', () => {
    chai.expect(normalizeVersion('v1.2.3')).to.equal('1.2.3')
  })

  // Teste 2: cenário alternativo
  it('deve retornar uma string vazia quando a versão for nula', () => {
    chai.expect(normalizeVersion(null)).to.equal('')
  })

  // Teste 3: stub controla a resposta da dependência
  it('deve retornar os dados normalizados da release usando um stub', async () => {
    sandbox.stub(axios, 'get').resolves({
      data: {
        tag_name: 'v2.0.0',
        html_url: 'https://example.com/releases/v2.0.0',
        published_at: '2026-01-01T00:00:00Z'
      }
    })

    const resultado = await fetchLatestRelease()

    chai.expect(resultado).to.deep.equal({
      tag: 'v2.0.0',
      version: '2.0.0',
      url: 'https://example.com/releases/v2.0.0',
      publishedAt: '2026-01-01T00:00:00Z'
    })
  })

  // Teste 4: stub simula uma falha da dependência
  it('deve propagar o erro quando a consulta falhar', async () => {
    sandbox.stub(axios, 'get').rejects(
      new Error('Falha simulada na consulta')
    )

    try {
      await fetchLatestRelease()
      chai.expect.fail('Era esperado que a função propagasse o erro')
    } catch (erro) {
      chai.expect(erro.message).to.equal('Falha simulada na consulta')
    }
  })

  // Teste 5: spy observa a chamada e seus argumentos
  it('deve consultar a URL correta com as opções esperadas', async () => {
    const observador = sinon.spy()

    sandbox.stub(axios, 'get').callsFake(async (...argumentos) => {
      observador(...argumentos)

      return {
        data: {
          tag_name: 'v3.0.0',
          html_url: 'https://example.com/releases/v3.0.0'
        }
      }
    })

    await fetchLatestRelease()

    sinon.assert.calledOnce(observador)
    sinon.assert.calledWith(
      observador,
      RELEASES_URL,
      sinon.match({
        timeout: 4000,
        headers: {
          'User-Agent': 'ServeRest'
        }
      })
    )
  })

  // Teste 6: mock verifica uma interação obrigatória
  it('deve chamar axios.get exatamente uma vez conforme o esperado', async () => {
    const axiosMock = sandbox.mock(axios)

    axiosMock
      .expects('get')
      .once()
      .withArgs(
        RELEASES_URL,
        sinon.match({ timeout: 4000 })
      )
      .returns(Promise.resolve({
        data: {
          tag_name: 'v4.0.0',
          html_url: 'https://example.com/releases/v4.0.0'
        }
      }))

    const resultado = await fetchLatestRelease()

    chai.expect(resultado.version).to.equal('4.0.0')
    axiosMock.verify()
  })
})
