import { faker } from '@faker-js/faker';

export type Usuario = {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
};

export type Produto = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
};

export function usuarioFactory(overrides: Partial<Usuario> = {}): Usuario {
  return {
    nome: faker.person.fullName(),
    email: `playwright-${faker.string.uuid()}@example.com`,
    password: faker.internet.password({ length: 16 }),
    administrador: 'false',
    ...overrides,
  };
}

export function produtoFactory(overrides: Partial<Produto> = {}): Produto {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.uuid()}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 5, max: 20 }),
    ...overrides,
  };
}
