import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const usuario = () => ({
  nome: 'Aluno Playwright',
  email: `teste-${randomUUID()}@example.com`,
  password: 'SenhaTeste123',
  administrador: 'true',
});

test('GET /usuarios retorna lista de usuários', async ({ request }) => {
  const resposta = await request.get('/usuarios');
  expect(resposta.status()).toBe(200);
  const corpo = await resposta.json();
  expect(corpo).toHaveProperty('quantidade');
  expect(Array.isArray(corpo.usuarios)).toBe(true);
  expect(corpo.quantidade).toBe(corpo.usuarios.length);
});

test('GET /produtos retorna lista de produtos', async ({ request }) => {
  const resposta = await request.get('/produtos');
  expect(resposta.status()).toBe(200);
  const corpo = await resposta.json();
  expect(Array.isArray(corpo.produtos)).toBe(true);
  expect(corpo.quantidade).toBe(corpo.produtos.length);
});

test('POST /usuarios cadastra usuário válido', async ({ request }) => {
  const dados = usuario();
  const resposta = await request.post('/usuarios', { data: dados });
  expect(resposta.status()).toBe(201);
  const corpo = await resposta.json();
  expect(corpo.message).toBe('Cadastro realizado com sucesso');
  expect(corpo._id).toBeTruthy();
  const consulta = await request.get(`/usuarios/${corpo._id}`);
  expect(consulta.status()).toBe(200);
  expect((await consulta.json()).email).toBe(dados.email);
  await request.delete(`/usuarios/${corpo._id}`);
});

test('POST /usuarios rejeita email duplicado', async ({ request }) => {
  const dados = usuario();
  const primeiro = await request.post('/usuarios', { data: dados });
  expect(primeiro.status()).toBe(201);
  const id = (await primeiro.json())._id;
  try {
    const duplicado = await request.post('/usuarios', { data: dados });
    expect(duplicado.status()).toBe(400);
    expect((await duplicado.json()).message).toBe('Este email já está sendo usado');
  } finally {
    await request.delete(`/usuarios/${id}`);
  }
});

test('POST /usuarios rejeita cadastro sem nome', async ({ request }) => {
  const { nome: _nome, ...semNome } = usuario();
  const resposta = await request.post('/usuarios', { data: semNome });
  expect(resposta.status()).toBe(400);
  expect((await resposta.json()).nome).toBe('nome é obrigatório');
});

test('GET /usuarios/:id rejeita ID inexistente', async ({ request }) => {
  const resposta = await request.get('/usuarios/id-inexistente-123');
  expect(resposta.status()).toBe(400);
  expect(resposta.status()).toBe(400);
});

test('POST /login rejeita credenciais inválidas', async ({ request }) => {
  const resposta = await request.post('/login', {
    data: { email: `inexistente-${randomUUID()}@example.com`, password: 'senha-errada' },
  });
  expect(resposta.status()).toBe(401);
  expect((await resposta.json()).message).toBe('Email e/ou senha inválidos');
});

test('POST /login autentica usuário cadastrado', async ({ request }) => {
  const dados = usuario();
  const cadastro = await request.post('/usuarios', { data: dados });
  expect(cadastro.status()).toBe(201);
  const id = (await cadastro.json())._id;
  try {
    const resposta = await request.post('/login', {
      data: { email: dados.email, password: dados.password },
    });
    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Login realizado com sucesso');
    expect(corpo.authorization).toMatch(/^Bearer\s+\S+/);
  } finally {
    await request.delete(`/usuarios/${id}`);
  }
});
