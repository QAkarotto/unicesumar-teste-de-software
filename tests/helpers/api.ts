import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import type { Produto, Usuario } from '../data/factories';

export interface ItemCarrinho {
  idProduto: string;
  quantidade: number;
}

/** O token do ServeRest já vem no formato "Bearer xxx" e vai direto no header. */
export const authHeaders = (token: string) => ({ Authorization: token });

// ---------- Usuários ----------
export const cadastrarUsuario = (request: APIRequestContext, usuario: Usuario) =>
  request.post('/usuarios', { data: usuario });

export const buscarUsuario = (request: APIRequestContext, id: string) =>
  request.get(`/usuarios/${id}`);

export const excluirUsuario = (request: APIRequestContext, id: string) =>
  request.delete(`/usuarios/${id}`);

/** Cadastra o usuário garantindo sucesso (pré-condição) e devolve o _id. */
export async function criarUsuarioOk(
  request: APIRequestContext,
  usuario: Usuario,
): Promise<string> {
  const resp = await cadastrarUsuario(request, usuario);
  expect(resp.status(), 'pré-condição: cadastro de usuário').toBe(201);
  return (await resp.json())._id as string;
}

// ---------- Produtos ----------
export const cadastrarProduto = (
  request: APIRequestContext,
  token: string,
  produto: Produto,
) => request.post('/produtos', { data: produto, headers: authHeaders(token) });

export const buscarProduto = (request: APIRequestContext, id: string) =>
  request.get(`/produtos/${id}`);

export const atualizarProduto = (
  request: APIRequestContext,
  token: string,
  id: string,
  produto: Produto,
) => request.put(`/produtos/${id}`, { data: produto, headers: authHeaders(token) });

export const excluirProduto = (request: APIRequestContext, token: string, id: string) =>
  request.delete(`/produtos/${id}`, { headers: authHeaders(token) });

// ---------- Carrinhos ----------
export const cadastrarCarrinho = (
  request: APIRequestContext,
  token: string,
  produtos: ItemCarrinho[],
): Promise<APIResponse> =>
  request.post('/carrinhos', { data: { produtos }, headers: authHeaders(token) });

export const buscarCarrinho = (request: APIRequestContext, id: string) =>
  request.get(`/carrinhos/${id}`);

/** Cancela a compra do usuário do token e devolve os itens ao estoque. */
export const cancelarCompra = (request: APIRequestContext, token: string) =>
  request.delete('/carrinhos/cancelar-compra', { headers: authHeaders(token) });
