import { faker } from '@faker-js/faker';

export const createUserPayload = (isAdm = 'true') => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: isAdm,
});

export const createProductPayload = () => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(4)}`,
  preco: Number(faker.commerce.price({ min: 10, max: 500, dec: 0 })),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 1, max: 100 }),
});
