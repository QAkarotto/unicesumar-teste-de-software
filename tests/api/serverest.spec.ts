import { randomUUID } from 'node:crypto';
import { expect, test as base, type APIRequestContext } from '@playwright/test';

type TestUser = {
  _id: string;
  nome: string;
  email: string;
  password: string;
  administrador: 'false';
};

type Fixtures = {
  createdUserIds: string[];
};

const test = base.extend<Fixtures>({
  createdUserIds: async ({ request }, use) => {
    const userIds: string[] = [];
    await use(userIds);

    for (const id of userIds) {
      const response = await request.delete(`/usuarios/${id}`);
      expect(response.status()).toBe(200);
    }
  },
});

async function registerUser(
  request: APIRequestContext,
  createdUserIds: string[],
): Promise<TestUser> {
  const user: Omit<TestUser, '_id'> = {
    nome: 'Usuário Playwright',
    email: `playwright-${randomUUID()}@example.com`,
    password: 'SenhaTeste123',
    administrador: 'false',
  };
  const response = await request.post('/usuarios', { data: user });

  expect(response.status()).toBe(201);
  const body: { _id: string; message: string } = await response.json();
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toBeTruthy();
  createdUserIds.push(body._id);

  return { ...user, _id: body._id };
}

function productPayload() {
  return {
    nome: `Produto Playwright ${randomUUID()}`,
    preco: 100,
    descricao: 'Produto usado para validar autorização',
    quantidade: 1,
  };
}

test('lista produtos com quantidade e campos coerentes', async ({ request }) => {
  const response = await request.get('/produtos');

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.quantidade).toBe(body.produtos.length);
  expect(body.produtos.length).toBeGreaterThan(0);
  expect(body.produtos[0]).toMatchObject({
    _id: expect.any(String),
    nome: expect.any(String),
    descricao: expect.any(String),
    preco: expect.any(Number),
    quantidade: expect.any(Number),
  });
});

test('cadastra e consulta usuário pelo ID', async ({ request, createdUserIds }) => {
  const user = await registerUser(request, createdUserIds);
  const response = await request.get(`/usuarios/${user._id}`);

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toMatchObject({
    _id: user._id,
    nome: user.nome,
    email: user.email,
    administrador: 'false',
  });
});

test('bloqueia cadastro de e-mail duplicado', async ({ request, createdUserIds }) => {
  const user = await registerUser(request, createdUserIds);
  const response = await request.post('/usuarios', {
    data: {
      nome: user.nome,
      email: user.email,
      password: user.password,
      administrador: user.administrador,
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    message: 'Este email já está sendo usado',
  });
});

test('rejeita credenciais de login inválidas', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: `missing-${randomUUID()}@example.com`,
      password: 'senha-incorreta',
    },
  });

  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({
    message: 'Email e/ou senha inválidos',
  });
});

test('retorna token Bearer para usuário cadastrado', async ({ request, createdUserIds }) => {
  const user = await registerUser(request, createdUserIds);
  const response = await request.post('/login', {
    data: { email: user.email, password: user.password },
  });

  expect(response.status()).toBe(200);
  const body: { message: string; authorization: string } = await response.json();
  expect(body.message).toBe('Login realizado com sucesso');
  expect(body.authorization).toMatch(/^Bearer\s+\S+$/);
});

test('bloqueia cadastro de produto sem token', async ({ request }) => {
  const response = await request.post('/produtos', { data: productPayload() });

  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({
    message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  });
});

test('bloqueia cadastro de produto para usuário não administrador', async ({
  request,
  createdUserIds,
}) => {
  const user = await registerUser(request, createdUserIds);
  const loginResponse = await request.post('/login', {
    data: { email: user.email, password: user.password },
  });
  expect(loginResponse.status()).toBe(200);
  const login = await loginResponse.json();

  const response = await request.post('/produtos', {
    data: productPayload(),
    headers: { Authorization: login.authorization },
  });

  expect(response.status()).toBe(403);
  expect(await response.json()).toMatchObject({
    message: 'Rota exclusiva para administradores',
  });
});
