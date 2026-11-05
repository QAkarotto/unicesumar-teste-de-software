import { expect, type APIRequestContext } from '@playwright/test';
import { criarProdutoDto, criarUsuarioDto, type Produto, type Usuario } from '../data/factories';

export async function cadastrarUsuario(
  request: APIRequestContext,
  usuario: Usuario = criarUsuarioDto(),
) {
  const resposta = await request.post('/usuarios', { data: usuario });
  expect(resposta.status(), 'pré-condição: cadastro de usuário').toBe(201);
  const corpo = await resposta.json();
  return { usuario, id: corpo._id as string };
}

export async function excluirUsuario(request: APIRequestContext, id: string) {
  await request.delete(`/usuarios/${id}`);
}

export async function cadastrarProduto(
  request: APIRequestContext,
  token: string,
  produto: Produto = criarProdutoDto(),
) {
  const resposta = await request.post('/produtos', {
    data: produto,
    headers: { Authorization: token },
  });
  expect(resposta.status(), 'pré-condição: cadastro de produto').toBe(201);
  const corpo = await resposta.json();
  return { produto, id: corpo._id as string };
}

export async function excluirProduto(request: APIRequestContext, token: string, id: string) {
  await request.delete(`/produtos/${id}`, { headers: { Authorization: token } });
}

export async function cancelarCompra(request: APIRequestContext, token: string) {
  await request.delete('/carrinhos/cancelar-compra', { headers: { Authorization: token } });
}
