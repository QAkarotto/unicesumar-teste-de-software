module.exports = function criarRespostaFake (sandbox) {
  const res = {}
  res.status = sandbox.stub().returns(res)
  res.send = sandbox.spy()
  res.json = sandbox.spy()
  return res
}
