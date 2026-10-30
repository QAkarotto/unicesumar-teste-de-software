import { test, expect, type APIRequestContext } from '@playwright/test';

type UsuarioAutenticado = { id: string; token: string };

function sufixo() {
  return `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

function novoProduto() {
  return { nome: `Produto ${sufixo()}`, preco: 150, descricao: 'Criado pela suíte de testes', quantidade: 10 };
}

async function criarUsuarioAutenticado(request: APIRequestContext, administrador: 'true' | 'false'): Promise<UsuarioAutenticado> {
  const usuario = { nome: `Usuário ${sufixo()}`, email: `produtos.${sufixo()}@qa.com`, password: 'senha123', administrador };
  const cadastro = await request.post('/usuarios', { data: usuario });
  expect(cadastro.status()).toBe(201);
  const login = await request.post('/login', { data: { email: usuario.email, password: usuario.password } });
  expect(login.status()).toBe(200);
  return { id: (await cadastro.json())._id, token: (await login.json()).authorization };
}

let admin: UsuarioAutenticado | undefined;
let comum: UsuarioAutenticado | undefined;
const produtosCriados: string[] = [];

test.beforeAll(async ({ request }) => {
  admin = await criarUsuarioAutenticado(request, 'true');
  comum = await criarUsuarioAutenticado(request, 'false');
});

// Produtos saem antes dos usuários: a exclusão exige o token de um administrador que ainda exista.
test.afterAll(async ({ request }) => {
  for (const id of produtosCriados) await request.delete(`/produtos/${id}`, { headers: { Authorization: admin!.token } });
  for (const usuario of [admin, comum]) if (usuario) await request.delete(`/usuarios/${usuario.id}`);
});

test('administrador cadastra produto, que fica disponível para consulta', async ({ request }) => {
  const produto = novoProduto();

  const cadastro = await request.post('/produtos', { data: produto, headers: { Authorization: admin!.token } });
  expect(cadastro.status()).toBe(201);
  const corpo = await cadastro.json();
  expect(corpo).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  produtosCriados.push(corpo._id);

  const consulta = await request.get(`/produtos/${corpo._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ ...produto, _id: corpo._id });
});

test('recusa cadastro de produto sem token de acesso', async ({ request }) => {
  const resposta = await request.post('/produtos', { data: novoProduto() });

  expect(resposta.status()).toBe(401);
  expect(await resposta.json()).toEqual({
    message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  });
});

test('somente administradores podem cadastrar produtos', async ({ request }) => {
  const produto = novoProduto();

  const resposta = await request.post('/produtos', { data: produto, headers: { Authorization: comum!.token } });
  expect(resposta.status()).toBe(403);
  expect(await resposta.json()).toEqual({ message: 'Rota exclusiva para administradores' });

  const busca = await request.get('/produtos', { params: { nome: produto.nome } });
  expect(await busca.json()).toEqual({ quantidade: 0, produtos: [] });
});
