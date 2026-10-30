import { test, expect } from '@playwright/test';

const usuario = {
  nome: 'Usuário Login',
  email: `login.${Date.now()}${Math.floor(Math.random() * 1e6)}@qa.com`,
  password: 'senha123',
  administrador: 'false',
};
let usuarioId: string | undefined;

test.beforeAll(async ({ request }) => {
  const cadastro = await request.post('/usuarios', { data: usuario });
  expect(cadastro.status()).toBe(201);
  usuarioId = (await cadastro.json())._id;
});

test.afterAll(async ({ request }) => {
  if (usuarioId) await request.delete(`/usuarios/${usuarioId}`);
});

test('autentica com credenciais válidas e devolve um token Bearer', async ({ request }) => {
  const resposta = await request.post('/login', { data: { email: usuario.email, password: usuario.password } });

  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual({
    message: 'Login realizado com sucesso',
    authorization: expect.stringMatching(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/),
  });
});

test('recusa senha incorreta sem devolver token', async ({ request }) => {
  const resposta = await request.post('/login', { data: { email: usuario.email, password: 'senha-errada' } });

  expect(resposta.status()).toBe(401);
  expect(await resposta.json()).toEqual({ message: 'Email e/ou senha inválidos' });
});

test('exige e-mail e senha no corpo da requisição', async ({ request }) => {
  const resposta = await request.post('/login', { data: {} });

  expect(resposta.status()).toBe(400);
  expect(await resposta.json()).toEqual({
    email: 'email é obrigatório',
    password: 'password é obrigatório',
  });
});
