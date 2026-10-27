
import { expect, type APIRequestContext } from '@playwright/test';
import { gerarUsuario, gerarProduto } from '../data/factories';

export async function cadastrarUsuario(request: APIRequestContext) {
  const usuario = gerarUsuario();

  const resposta = await request.post('/usuarios', {
    data: usuario
  });

  expect(resposta.status()).toBe(201);

  const corpo = await resposta.json();
  expect(corpo.message).toBe('Cadastro realizado com sucesso');
  expect(corpo._id).toBeTruthy();

  return { usuario, id: corpo._id as string };
}

export async function excluirUsuario(
  request: APIRequestContext,
  id: string
) {
  const resposta = await request.delete(`/usuarios/${id}`);
  expect(resposta.status()).toBe(200);
}

export async function cadastrarProduto(
  request: APIRequestContext,
  token: string
) {
  const produto = gerarProduto();

  const resposta = await request.post('/produtos', {
    headers: { Authorization: token },
    data: produto
  });

  expect(resposta.status()).toBe(201);

  const corpo = await resposta.json();
  expect(corpo.message).toBe('Cadastro realizado com sucesso');
  expect(corpo._id).toBeTruthy();

  return { produto, id: corpo._id as string };
}

export async function excluirProduto(
  request: APIRequestContext,
  id: string,
  token: string
) {
  const resposta = await request.delete(`/produtos/${id}`, {
    headers: { Authorization: token }
  });

  expect(resposta.status()).toBe(200);
}
