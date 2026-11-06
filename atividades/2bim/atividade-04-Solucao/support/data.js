const crypto = require('crypto');

const uid = () => `${Date.now()}${crypto.randomBytes(3).toString('hex')}`;

function gerarUsuario({ administrador = false } = {}) {
  const id = uid();
  return {
    nome: `Usuario ${id}`,
    email: `user_${id}@teste.com`,
    password: 'Senha@123',
    administrador,
  };
}

function gerarProduto() {
  const id = uid();
  return {
    nome: `Produto ${id}`,
    preco: '150',
    descricao: `Descricao do produto ${id}`,
    quantidade: '10',
  };
}

module.exports = { gerarUsuario, gerarProduto };