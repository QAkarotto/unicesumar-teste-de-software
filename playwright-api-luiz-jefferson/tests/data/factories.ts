import { faker } from '@faker-js/faker';

export type UserData = { nome: string; email: string; password: string; administrador: 'true' | 'false' };
export type ProductData = { nome: string; preco: number; descricao: string; quantidade: number };

export function makeUser(admin = false): UserData {
  return {
    nome: faker.person.fullName(),
    email: `teste.${faker.string.uuid()}@example.com`,
    password: faker.internet.password({ length: 12 }),
    administrador: admin ? 'true' : 'false',
  };
}
export function makeProduct(): ProductData {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.uuid()}`,
    preco: faker.number.int({ min: 10, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };
}
