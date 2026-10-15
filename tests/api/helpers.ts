import { APIRequestContext, expect } from '@playwright/test';

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
}

export interface Produto {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

/** Gera um sufixo único para evitar conflito de dados entre execuções. */
function sufixoUnico(): string {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

/** Gera os dados de um usuário com e-mail único. */
export function gerarUsuario(administrador = false): Usuario {
  const id = sufixoUnico();

  return {
    nome: `Usuario QA ${id}`,
    email: `qa.${id}@teste.com.br`,
    password: 'Senha@123',
    administrador: administrador ? 'true' : 'false',
  };
}

/** Gera os dados de um produto com nome único. */
export function gerarProduto(): Produto {
  return {
    nome: `Produto QA ${sufixoUnico()}`,
    preco: 150,
    descricao: 'Produto criado pelos testes automatizados',
    quantidade: 10,
  };
}

/** Cadastra um usuário na API e retorna o _id gerado. */
export async function cadastrarUsuario(
  request: APIRequestContext,
  usuario: Usuario,
): Promise<string> {
  const response = await request.post('/usuarios', { data: usuario });
  expect(response.status()).toBe(201);

  const body = await response.json();
  return body._id;
}

/** Realiza o login e retorna o token de autorização (Bearer). */
export async function obterToken(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const response = await request.post('/login', { data: { email, password } });
  expect(response.status()).toBe(200);

  const body = await response.json();
  return body.authorization;
}

/** Exclui um usuário para manter a base de testes limpa. */
export async function excluirUsuario(
  request: APIRequestContext,
  id: string,
): Promise<void> {
  await request.delete(`/usuarios/${id}`);
}
