import { randomInt, randomUUID } from 'node:crypto';

/**
 * Massa de dados dos testes. Cada chamada gera dados novos, com um sufixo aleatório,
 * para que execuções simultâneas (outros alunos, outros workers) não colidam no ServeRest público.
 */

export type Administrador = 'true' | 'false';

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  administrador: Administrador;
}

export interface Produto {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

function sufixoUnico(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

export function novoUsuario(overrides: Partial<Usuario> = {}): Usuario {
  const id = sufixoUnico();
  return {
    nome: `QA E2E ${id}`,
    email: `qa.e2e.${id}@qa-playwright.com`,
    password: `Senha#${id}`,
    administrador: 'false',
    ...overrides,
  };
}

export function novoProduto(overrides: Partial<Produto> = {}): Produto {
  const id = sufixoUnico().toUpperCase();
  return {
    // O ServeRest não aceita nomes de produto repetidos, então o nome leva o sufixo único.
    nome: `Produto E2E ${id}`,
    preco: randomInt(10, 5000),
    descricao: `Produto ${id} cadastrado pelo teste E2E`,
    quantidade: randomInt(1, 500),
    ...overrides,
  };
}
