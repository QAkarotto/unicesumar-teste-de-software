
import type { APIRequestContext } from '@playwright/test';
import { criarDadosAdministrador } from '../data/factories';

export async function criarUsuario(
  request: APIRequestContext,
  usuario: {
    nome: string;
    email: string;
    password: string;
    administrador: string;
  },
) {
  return request.post('/usuarios', { data: usuario });
}

export async function fazerLogin(
  request: APIRequestContext,
  email: string,
  password: string,
) {
  return request.post('/login', {
    data: { email, password },
  });
}

export async function autenticarAdministrador(
  request: APIRequestContext,
) {
  const administrador = criarDadosAdministrador();

  const cadastro = await criarUsuario(request, administrador);

  if (cadastro.status() !== 201) {
    throw new Error(
      `Falha ao cadastrar administrador: ${await cadastro.text()}`,
    );
  }

  const login = await fazerLogin(
    request,
    administrador.email,
    administrador.password,
  );

  if (login.status() !== 200) {
    throw new Error(
      `Falha ao autenticar administrador: ${await login.text()}`,
    );
  }

  const body = await login.json();

  if (!body.authorization) {
    throw new Error('A API não retornou o token de autorização.');
  }

  return {
    administrador,
    token: body.authorization as string,
  };
}
