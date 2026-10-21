import { faker } from '@faker-js/faker';

export const createUserFactory = () => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: 'true',
});

export const createProductFactory = () => ({
  nome: faker.commerce.productName() + ' ' + faker.string.alphanumeric(4),
  preco: Math.floor(Number(faker.commerce.price({ min: 10, max: 500 }))),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 1, max: 100 }),
});