'use strict'

/**
 * Dublês dos objetos do Express usados pelos controllers e middlewares.
 *
 * - req: objeto simples com os dados de entrada do cenário (dummy/fake).
 * - res: status/send/json são stubs que devolvem o próprio res, permitindo o
 *   encadeamento res.status(200).send(...) e registrando como foram chamados.
 */
function fakeReq ({ body = {}, params = {}, query = {}, headers = {} } = {}) {
  return { body, params, query, headers }
}

function fakeRes (sandbox) {
  const res = {}
  res.status = sandbox.stub().returns(res)
  res.send = sandbox.stub().returns(res)
  res.json = sandbox.stub().returns(res)
  return res
}

/** Devolve o corpo enviado na resposta, seja por res.send ou por res.json. */
function corpoDaResposta (res) {
  const chamada = res.send.lastCall || res.json.lastCall
  return chamada ? chamada.args[0] : undefined
}

module.exports = { fakeReq, fakeRes, corpoDaResposta }
