/**
 * Geradores de massa de dados. Cada chamada gera valores únicos para que os
 * testes possam rodar em paralelo e repetidas vezes contra a API pública
 * sem colidir com dados de outras pessoas.
 */

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

function sufixoUnico(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`;
}

export function novoUsuario(overrides: Partial<Usuario> = {}): Usuario {
  const id = sufixoUnico();
  return {
    nome: `QA Playwright ${id}`,
    email: `qa.playwright.${id}@teste.com`,
    password: 'Senha@123',
    administrador: 'true',
    ...overrides,
  };
}

export function novoProduto(overrides: Partial<Produto> = {}): Produto {
  const id = sufixoUnico();
  return {
    nome: `Produto Playwright ${id}`,
    preco: 150,
    descricao: 'Produto criado por teste automatizado',
    quantidade: 10,
    ...overrides,
  };
}
