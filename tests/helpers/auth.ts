import { expect } from '@playwright/test';
import { UsuarioAutenticado, UsuarioCadastrado } from '../data/factories';
import { ClienteApi, Credenciais } from './api';

/** Realiza o login e retorna o token de autorização (Bearer). */
export async function obterToken(api: ClienteApi, credenciais: Credenciais): Promise<string> {
  const response = await api.login(credenciais);
  expect(response.status(), 'o login da pré-condição deveria ser realizado').toBe(200);

  const { authorization } = await response.json();
  return authorization;
}

/** Autentica um usuário já cadastrado e devolve seus dados junto com o token. */
export async function autenticar(
  api: ClienteApi,
  usuario: UsuarioCadastrado,
): Promise<UsuarioAutenticado> {
  const token = await obterToken(api, { email: usuario.email, password: usuario.password });
  return { ...usuario, token };
}
