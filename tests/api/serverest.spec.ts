import { test, expect } from '@playwright/test';

function emailUnico() {
  return `samara-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

async function criarUsuario(request: any, email: string) {
  return request.post('/usuarios', {
    data: {
      nome: 'Usuário de Teste',
      email,
      password: 'Senha123',
      administrador: 'false',
    },
  });
}

test('lista usuários e valida os dados retornados', async ({ request }) => {
  const response = await request.get('/usuarios');
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.quantidade).toBeGreaterThan(0);
  expect(Array.isArray(body.usuarios)).toBe(true);
  expect(body.usuarios[0]).toHaveProperty('_id');
  expect(body.usuarios[0]).toHaveProperty('email');
});

test('lista produtos com informações relevantes', async ({ request }) => {
  const response = await request.get('/produtos');
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.quantidade).toBeGreaterThan(0);
  expect(Array.isArray(body.produtos)).toBe(true);
  expect(body.produtos[0]).toHaveProperty('nome');
  expect(body.produtos[0].preco).toEqual(expect.any(Number));
});

test('cria um usuário com sucesso', async ({ request }) => {
  const email = emailUnico();
  const response = await criarUsuario(request, email);
  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body.message).toContain('Cadastro realizado com sucesso');
  expect(body._id).toBeTruthy();
});

test('impede cadastrar dois usuários com o mesmo e-mail', async ({ request }) => {
  const email = emailUnico();

  const primeiroCadastro = await criarUsuario(request, email);
  expect(primeiroCadastro.status()).toBe(201);

  const segundoCadastro = await criarUsuario(request, email);
  const body = await segundoCadastro.json();

  expect(segundoCadastro.status()).toBe(400);
  expect(body.message).toContain('email');
});

test('faz login de um usuário cadastrado e retorna autorização', async ({ request }) => {
  const email = emailUnico();
  const senha = 'Senha123';

  const cadastro = await request.post('/usuarios', {
    data: {
      nome: 'Usuário para Login',
      email,
      password: senha,
      administrador: 'false',
    },
  });
  expect(cadastro.status()).toBe(201);

  const response = await request.post('/login', {
    data: { email, password: senha },
  });
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.message).toContain('Login realizado com sucesso');
  expect(body.authorization).toMatch(/^Bearer /);
});

test('rejeita login com credenciais inválidas', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: emailUnico(),
      password: 'senha-incorreta',
    },
  });
  const body = await response.json();

  expect(response.status()).toBe(401);
  expect(body.message).toContain('inválidos');
});