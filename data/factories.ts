import { faker } from '@faker-js/faker';

export function criarUsuarioDto() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true',
  };
}

export function criarProdutoDto() {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(5)}`,
    preco: Number(faker.commerce.price({ min: 10, max: 1000, dec: 0 })),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };
}
