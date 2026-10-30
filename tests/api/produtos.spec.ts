import { test, expect } from '../fixtures/api.fixture';
import { novoProduto } from '../data/factories';
import { autorizacao } from '../helpers/auth';

test('administrador cadastra produto, que fica disponível para consulta', async ({ request, admin, limpeza }) => {
  const produto = novoProduto();

  const cadastro = await request.post('/produtos', { data: produto, headers: autorizacao(admin.token) });
  expect(cadastro.status()).toBe(201);
  const corpo = await cadastro.json();
  expect(corpo).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  limpeza.produto(corpo._id, admin.token);

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

test('somente administradores podem cadastrar produtos', async ({ request, cliente }) => {
  const produto = novoProduto();

  const resposta = await request.post('/produtos', { data: produto, headers: autorizacao(cliente.token) });
  expect(resposta.status()).toBe(403);
  expect(await resposta.json()).toEqual({ message: 'Rota exclusiva para administradores' });

  const busca = await request.get('/produtos', { params: { nome: produto.nome } });
  expect(await busca.json()).toEqual({ quantidade: 0, produtos: [] });
});

test('não permite cadastrar dois produtos com o mesmo nome', async ({ request, admin, criarProduto }) => {
  const existente = await criarProduto();

  const repetido = await request.post('/produtos', {
    data: novoProduto({ nome: existente.nome }),
    headers: autorizacao(admin.token),
  });
  expect(repetido.status()).toBe(400);
  expect(await repetido.json()).toEqual({ message: 'Já existe produto com esse nome' });

  const busca = await request.get('/produtos', { params: { nome: existente.nome } });
  expect(await busca.json()).toEqual({ quantidade: 1, produtos: [existente] });
});
