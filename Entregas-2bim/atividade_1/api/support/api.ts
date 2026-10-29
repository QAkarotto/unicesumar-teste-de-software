import { APIRequestContext, expect } from '@playwright/test';
import { novoProduto, novoUsuario, Produto, Usuario } from './factories';

/** Cadastra um usuário e devolve os dados enviados junto com o _id gerado. */
export async function cadastrarUsuario(
  request: APIRequestContext,
  overrides: Partial<Usuario> = {},
): Promise<Usuario & { _id: string }> {
  const usuario = novoUsuario(overrides);
  const response = await request.post('/usuarios', { data: usuario });
  expect(response.status(), 'pré-condição: cadastro de usuário').toBe(201);
  const body = await response.json();
  return { ...usuario, _id: body._id };
}

/** Faz login e devolve o valor do header Authorization ("Bearer ..."). */
export async function obterToken(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const response = await request.post('/login', { data: { email, password } });
  expect(response.status(), 'pré-condição: login').toBe(200);
  const body = await response.json();
  return body.authorization;
}

/** Atalho: cria um usuário (admin por padrão) e já devolve o token dele. */
export async function usuarioAutenticado(
  request: APIRequestContext,
  administrador: 'true' | 'false' = 'true',
) {
  const usuario = await cadastrarUsuario(request, { administrador });
  const token = await obterToken(request, usuario.email, usuario.password);
  return { usuario, token };
}

/** Cadastra um produto com um token de administrador e devolve os dados + _id. */
export async function cadastrarProduto(
  request: APIRequestContext,
  token: string,
  overrides: Partial<Produto> = {},
): Promise<Produto & { _id: string }> {
  const produto = novoProduto(overrides);
  const response = await request.post('/produtos', {
    data: produto,
    headers: { Authorization: token },
  });
  expect(response.status(), 'pré-condição: cadastro de produto').toBe(201);
  const body = await response.json();
  return { ...produto, _id: body._id };
}
