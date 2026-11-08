import { faker } from '@faker-js/faker';

export function criarUsuario() {
  return {
    nome: faker.person.fullName(),
    email: `qa-${faker.string.uuid()}@example.com`,
    password: faker.internet.password(),
    administrador: 'true',
  };
}

export function criarProduto() {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.uuid()}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: 10,
  };
}
