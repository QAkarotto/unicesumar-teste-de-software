const API_URL = 'https://serverest.dev';

/** Sufixo único por chamada, evita conflitos entre execuções e workers. */
function sufixoUnico() {
  return `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

function gerarUsuario({ administrador = false } = {}) {
  const id = sufixoUnico();
  return {
    nome: `Usuario ${id}`,
    email: `qa.${id}@teste.com`,
    password: `Senha@${id.slice(-6)}`,
    administrador,
  };
}

function gerarProduto() {
  const id = sufixoUnico();
  return {
    nome: `Produto ${id}`,
    preco: '149',
    descricao: `Descricao do produto ${id}`,
    quantidade: '25',
  };
}

module.exports = { API_URL, gerarUsuario, gerarProduto };
