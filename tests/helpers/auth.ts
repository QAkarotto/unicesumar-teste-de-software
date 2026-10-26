import { expect, type APIRequestContext } from '@playwright/test';
import { criarUsuarioDto } from '../data/factories';
import { cadastrarUsuario } from './api';

export async function login(request: APIRequestContext, email: string, password: string) {
  const resposta = await request.post('/login', { data: { email, password } });
  expect(resposta.status(), 'pré-condição: login').toBe(200);
  const corpo = await resposta.json();
  return corpo.authorization as string;
}

export async function criarUsuarioAutenticado(
  request: APIRequestContext,
  administrador: 'true' | 'false' = 'true',
) {
  const { usuario, id } = await cadastrarUsuario(request, criarUsuarioDto(administrador));
  const token = await login(request, usuario.email, usuario.password);
  return { usuario, id, token };
}
