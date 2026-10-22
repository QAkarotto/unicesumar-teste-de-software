import { APIRequestContext, expect } from '@playwright/test';

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
}

/** Gera dados únicos para evitar conflito entre execuções/testes paralelos. */
export function unico(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

export function gerarUsuario(administrador: boolean = true): Usuario {
  const id = unico();
  return {
    nome: `Aluno Teste ${id}`,
    email: `aluno.${id}@qa.com.br`,
    password: 'senha123',
    administrador: administrador ? 'true' : 'false',
  };
}

export function gerarProduto() {
  return {
    nome: `Produto ${unico()}`,
    preco: 470,
    descricao: 'Mouse gamer',
    quantidade: 381,
  };
}

export async function criarUsuario(request: APIRequestContext, usuario: Usuario): Promise<string> {
  const res = await request.post('/usuarios', { data: usuario });
  expect(res.status(), 'pré-condição: criar usuário').toBe(201);
  return (await res.json())._id;
}

export async function fazerLogin(request: APIRequestContext, usuario: Usuario): Promise<string> {
  const res = await request.post('/login', {
    data: { email: usuario.email, password: usuario.password },
  });
  expect(res.status(), 'pré-condição: login').toBe(200);
  return (await res.json()).authorization;
}

export async function excluirUsuario(request: APIRequestContext, id: string) {
  await request.delete(`/usuarios/${id}`);
}
