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

function sufixoUnico() {
  return `${Date.now()}${faker.string.alphanumeric(6).toLowerCase()}`;
}

export function criarUsuarioDto(administrador: 'true' | 'false' = 'true'): Usuario {
  return {
    nome: faker.person.fullName(),
    email: `${sufixoUnico()}.${faker.internet.email().toLowerCase()}`,
    password: faker.internet.password({ length: 12 }),
    administrador,
  };
}

export function criarProdutoDto(): Produto {
  return {
    nome: `${faker.commerce.productName()} ${sufixoUnico()}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 5, max: 50 }),
  };
}
