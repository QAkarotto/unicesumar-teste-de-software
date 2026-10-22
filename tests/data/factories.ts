import { faker } from '@faker-js/faker';

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

const sufixo = (tamanho = 8) =>
  faker.string.alphanumeric({ length: tamanho, casing: 'lower' });

/** Gera um usuário único. Qualquer campo pode ser sobrescrito para cenários específicos. */
export function gerarUsuario(overrides: Partial<Usuario> = {}): Usuario {
  return {
    nome: faker.person.fullName(),
    email: `${sufixo(12)}@${faker.internet.domainName()}`,
    password: faker.internet.password({ length: 10 }),
    administrador: 'false',
    ...overrides,
  };
}

export const gerarAdmin = (overrides: Partial<Usuario> = {}): Usuario =>
  gerarUsuario({ administrador: 'true', ...overrides });

/** Gera um produto com nome único (o ServeRest não aceita nomes repetidos). */
export function gerarProduto(overrides: Partial<Produto> = {}): Produto {
  return {
    nome: `${faker.commerce.productName()} ${sufixo(6)}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 10, max: 50 }),
    ...overrides,
  };
}
