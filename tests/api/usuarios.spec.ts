import { test, expect, type APIRequestContext } from '@playwright/test';
import { randomUUID } from 'node:crypto';

function novoUsuario() {
  return {
    nome: 'Aluno Teste',
    email: `aluno-${randomUUID()}@exemplo.com`,
    password: 'senha123',
    administrador: 'false'
  };
}

async function cadastrarUsuario(request: APIRequestContext) {
  const usuario = novoUsuario();
  const resposta = await request.post('/usuarios', { data: usuario });
  expect(resposta.status()).toBe(201);
  const corpo = await resposta.json();
  expect(corpo.message).toBe('Cadastro realizado com sucesso');
  expect(corpo._id).toBeTruthy();
  return { usuario, id: corpo._id as string };
}

async function excluirUsuario(request: APIRequestContext, id: string) {
  await request.delete(`/usuarios/${id}`);
}

test('listar usuários cadastrados', async ({ request }) => {
  const resposta = await request.get('/usuarios');
  expect(resposta.status()).toBe(200);
  const corpo = await resposta.json();
  expect(Array.isArray(corpo.usuarios)).toBe(true);
  expect(corpo.quantidade).toBe(corpo.usuarios.length);
});

test('cadastrar usuário com dados válidos', async ({ request }) => {
  const { usuario, id } = await cadastrarUsuario(request);
  try {
    const resposta = await request.get(`/usuarios/${id}`);
    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).email).toBe(usuario.email);
  } finally {
    await excluirUsuario(request, id);
  }
});

test('buscar usuário por ID', async ({ request }) => {
  const { usuario, id } = await cadastrarUsuario(request);
  try {
    const resposta = await request.get(`/usuarios/${id}`);
    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.nome).toBe(usuario.nome);
    expect(corpo.email).toBe(usuario.email);
    expect(corpo.administrador).toBe('false');
  } finally {
    await excluirUsuario(request, id);
  }
});

test('impedir cadastro com e-mail duplicado', async ({ request }) => {
  const { usuario, id } = await cadastrarUsuario(request);
  try {
    const resposta = await request.post('/usuarios', { data: usuario });
    expect(resposta.status()).toBe(400);
    expect((await resposta.json()).message).toBe('Este email já está sendo usado');
  } finally {
    await excluirUsuario(request, id);
  }
});

test('alterar dados de usuário', async ({ request }) => {
  const { usuario, id } = await cadastrarUsuario(request);
  try {
    const resposta = await request.put(`/usuarios/${id}`, {
      data: { ...usuario, nome: 'Aluno Atualizado' }
    });
    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).message).toBe('Registro alterado com sucesso');
    const consulta = await request.get(`/usuarios/${id}`);
    expect(consulta.status()).toBe(200);
    expect((await consulta.json()).nome).toBe('Aluno Atualizado');
  } finally {
    await excluirUsuario(request, id);
  }
});

test('excluir usuário cadastrado', async ({ request }) => {
  const { id } = await cadastrarUsuario(request);
  const resposta = await request.delete(`/usuarios/${id}`);
  expect(resposta.status()).toBe(200);
  expect((await resposta.json()).message).toBe('Registro excluído com sucesso');
  const consulta = await request.get(`/usuarios/${id}`);
  expect(consulta.status()).toBe(400);
  expect((await consulta.json()).message).toBe('Usuário não encontrado');
});

test('consultar usuário inexistente', async ({ request }) => { 
  const resposta = await request.get('/usuarios/testestestestest'); 
  
  expect(resposta.status()).toBe(400); 
  expect((await resposta.json()).message).toBe('Usuário não encontrado'); 
});
