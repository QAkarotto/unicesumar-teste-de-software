
import { expect, type APIRequestContext } from '@playwright/test';
import { gerarUsuario } from '../data/factories';

export async function criarUsuarioAdmin(request: APIRequestContext) {
  const usuario = gerarUsuario('true');

  const resposta = await request.post('/usuarios', {
    data: usuario
  });

  expect(resposta.status()).toBe(201);

  const corpo = await resposta.json();
  expect(corpo._id).toBeTruthy();

  return {
    usuario,
    id: corpo._id as string
  };
}

export async function realizarLogin(
  request: APIRequestContext,
  email: string,
  password: string
) {
  const resposta = await request.post('/login', {
    data: { email, password }
  });

  expect(resposta.status()).toBe(200);

  const corpo = await resposta.json();
  expect(corpo.message).toBe('Login realizado com sucesso');
  expect(corpo.authorization).toBeTruthy();

  return corpo.authorization as string;
}

export async function prepararAutenticacao(request: APIRequestContext) {
  const { usuario, id } = await criarUsuarioAdmin(request);

  try {
    const token = await realizarLogin(
      request,
      usuario.email,
      usuario.password
    );

    return { usuario, id, token };
  } catch (erro) {
    await request.delete(`/usuarios/${id}`);
    throw erro;
  }
}
