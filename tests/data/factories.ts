
import { faker } from '@faker-js/faker';

export function gerarUsuario(administrador = 'false') {
  return {
    nome: faker.person.fullName(),
    email: `aluno-${faker.string.uuid()}@exemplo.com`,
    password: faker.internet.password(),
    administrador
  };
}

export function gerarProduto() {
  return {
    nome: `${faker.commerce.productName()}-${faker.string.uuid()}`,
    preco: faker.number.int({ min: 10, max: 500 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 })
  };
}
