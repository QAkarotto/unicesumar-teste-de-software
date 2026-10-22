import { Administrador, novoUsuario, Usuario } from '../data/factories';
import { esperarStatus, ServeRestApi } from './api';

export type UsuarioCadastrado = Usuario & { _id: string };
export type UsuarioAutenticado = UsuarioCadastrado & { token: string };

/** Cadastra um usuário novo (dados do Faker) e devolve os dados + _id. */
export async function prepararUsuario(
  api: ServeRestApi,
  overrides: Partial<Usuario> = {},
): Promise<UsuarioCadastrado> {
  const usuario = novoUsuario(overrides);
  const response = await api.cadastrarUsuario(usuario);
  await esperarStatus(response, 201, 'pré-condição: cadastrar usuário');
  return { ...usuario, _id: (await response.json())._id };
}

/** Faz login e devolve o token no formato "Bearer <jwt>", pronto para o header Authorization. */
export async function obterToken(api: ServeRestApi, email: string, password: string): Promise<string> {
  const response = await api.login({ email, password });
  await esperarStatus(response, 200, 'pré-condição: login');
  return (await response.json()).authorization;
}

/** Fluxo completo e reutilizável: cadastrar usuário → fazer login → obter token. */
export async function prepararUsuarioAutenticado(
  api: ServeRestApi,
  administrador: Administrador,
): Promise<UsuarioAutenticado> {
  const usuario = await prepararUsuario(api, { administrador });
  const token = await obterToken(api, usuario.email, usuario.password);
  return { ...usuario, token };
}
