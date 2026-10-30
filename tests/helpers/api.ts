import { expect, type APIRequestContext } from '@playwright/test';
import type { Produto, Usuario } from '../data/factories';
import { autorizacao } from './auth';

// Requisições de pré-condição, consulta auxiliar e limpeza. A requisição cujo comportamento está sob teste fica escrita por extenso na spec.

export async function cadastrarUsuario(request: APIRequestContext, usuario: Usuario): Promise<string> {
  const resposta = await request.post('/usuarios', { data: usuario });
  expect(resposta.status(), 'pré-condição: cadastro de usuário').toBe(201);
  return (await resposta.json())._id;
}

export async function cadastrarProduto(request: APIRequestContext, token: string, produto: Produto): Promise<string> {
  const resposta = await request.post('/produtos', { data: produto, headers: autorizacao(token) });
  expect(resposta.status(), 'pré-condição: cadastro de produto').toBe(201);
  return (await resposta.json())._id;
}

export async function estoqueDoProduto(request: APIRequestContext, id: string): Promise<number> {
  const resposta = await request.get(`/produtos/${id}`);
  expect(resposta.status()).toBe(200);
  return (await resposta.json()).quantidade;
}

export async function cancelarCompra(request: APIRequestContext, token: string) {
  await request.delete('/carrinhos/cancelar-compra', { headers: autorizacao(token) });
}

export async function excluirProduto(request: APIRequestContext, token: string, id: string) {
  await request.delete(`/produtos/${id}`, { headers: autorizacao(token) });
}

export async function excluirUsuario(request: APIRequestContext, id: string) {
  await request.delete(`/usuarios/${id}`);
}
