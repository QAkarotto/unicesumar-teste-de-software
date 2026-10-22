
import { faker } from '@faker-js/faker';

export function criarDadosUsuario() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    administrador: 'false',
  };
}

export function criarDadosAdministrador() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
  };
}

export function criarDadosProduto() {
  return {
    nome: `Produto ${faker.string.uuid()}`,
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };
}
