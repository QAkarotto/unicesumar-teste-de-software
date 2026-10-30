import { test, expect } from '../fixtures/api.fixture';

test('autentica com credenciais válidas e devolve um token Bearer', async ({ request, criarUsuario }) => {
  const usuario = await criarUsuario();

  const resposta = await request.post('/login', { data: { email: usuario.email, password: usuario.password } });

  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual({
    message: 'Login realizado com sucesso',
    authorization: expect.stringMatching(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/),
  });
});

test('recusa senha incorreta sem devolver token', async ({ request, criarUsuario }) => {
  const usuario = await criarUsuario();

  const resposta = await request.post('/login', { data: { email: usuario.email, password: `${usuario.password}x` } });

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
