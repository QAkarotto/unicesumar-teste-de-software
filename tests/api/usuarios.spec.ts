
import { test, expect } from '@playwright/test';
import { gerarUsuario } from '../data/factories';
import { cadastrarUsuario, excluirUsuario } from '../helpers/api';

test('listar usuários cadastrados', async ({ request }) => {
  const resposta = await request.get('/usuarios');
  const corpo = await resposta.json();

  expect(resposta.status()).toBe(200);
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
    const corpo = await resposta.json();

    expect(resposta.status()).toBe(200);
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
    const resposta = await request.post('/usuarios', {
      data: usuario
    });

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

test('impedir cadastro sem e-mail', async ({ request }) => {
  const usuario = gerarUsuario();
  const { email, ...dadosInvalidos } = usuario;

  const resposta = await request.post('/usuarios', {
    data: dadosInvalidos
  });

  expect(resposta.status()).toBe(400);
  expect((await resposta.json()).email).toBe('email é obrigatório');
});
