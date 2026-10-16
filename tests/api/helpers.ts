import { APIRequestContext, expect } from '@playwright/test';

export function novoUsuario(administrador: 'true' | 'false' = 'true') {
  const id = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  return {
    nome: `Usuario Teste ${id}`,
    email: `teste_${id}@qa.com.br`,
    password: 'senha123',
    administrador,
  };
}

export async function criarUsuario(
  request: APIRequestContext,
  administrador: 'true' | 'false' = 'true',
) {
  const usuario = novoUsuario(administrador);
  const resp = await request.post('/usuarios', { data: usuario });
  expect(resp.status()).toBe(201);
  const body = await resp.json();
  return { ...usuario, _id: body._id as string };
}

export async function autenticar(
  request: APIRequestContext,
  email: string,
  password: string,
) {
  const resp = await request.post('/login', { data: { email, password } });
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  return body.authorization as string;
}

export function novoProduto() {
  const id = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  return {
    nome: `Produto Teste ${id}`,
    preco: 150,
    descricao: 'Produto criado por teste automatizado',
    quantidade: 20,
  };
}
