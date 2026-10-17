
import { test, expect } from '@playwright/test';
import { prepararAutenticacao } from '../helpers/auth';
import { cadastrarProduto, excluirProduto, excluirUsuario } from '../helpers/api';

test('cadastrar produto com autenticação', async ({ request }) => {
  const { id: usuarioId, token } = await prepararAutenticacao(request);
  let produtoId: string | undefined;

  try {
    const { produto, id } = await cadastrarProduto(request, token);
    produtoId = id;

    const resposta = await request.get(`/produtos/${id}`);
    const corpo = await resposta.json();

    expect(resposta.status()).toBe(200);
    expect(corpo.nome).toBe(produto.nome);
    expect(corpo.preco).toBe(produto.preco);
    expect(corpo.descricao).toBe(produto.descricao);
    expect(corpo.quantidade).toBe(produto.quantidade);
  } finally {
    if (produtoId) {
      await excluirProduto(request, produtoId, token);
    }
    await excluirUsuario(request, usuarioId);
  }
});

test('impedir cadastro de produto sem autenticação', async ({ request }) => {
  const resposta = await request.post('/produtos', {
    data: {
      nome: 'Produto sem autorização',
      preco: 100,
      descricao: 'Teste de acesso',
      quantidade: 5
    }
  });

  expect(resposta.status()).toBe(401);
  expect((await resposta.json()).message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
});
