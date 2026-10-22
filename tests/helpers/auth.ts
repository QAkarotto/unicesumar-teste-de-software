import { APIRequestContext, expect } from '@playwright/test';
import { gerarAdmin, gerarUsuario, type Usuario } from '../data/factories';
import { criarUsuarioOk } from './api';

export interface Sessao {
  usuario: Usuario;
  id: string;
  token: string;
}

export const realizarLogin = (
  request: APIRequestContext,
  credenciais: { email: string; password: string },
) =>
  // O /login aceita somente email e password (outros campos geram 400).
  request.post('/login', {
    data: { email: credenciais.email, password: credenciais.password },
  });

/** Faz login e devolve o token (valor do campo `authorization`). */
export async function obterToken(
  request: APIRequestContext,
  credenciais: { email: string; password: string },
): Promise<string> {
  const resp = await realizarLogin(request, credenciais);
  expect(
    resp.status(),
    `pré-condição: login (resposta da API: ${await resp.text()})`,
  ).toBe(200);
  return (await resp.json()).authorization as string;
}

/**
 * Fluxo completo e reutilizável: gera usuário → cadastra → autentica → devolve token.
 * É o único lugar da suíte que conhece esse passo a passo.
 */
export async function prepararSessao(
  request: APIRequestContext,
  administrador: boolean,
): Promise<Sessao> {
  const usuario = administrador ? gerarAdmin() : gerarUsuario();
  const id = await criarUsuarioOk(request, usuario);
  const token = await obterToken(request, usuario);
  return { usuario, id, token };
}
