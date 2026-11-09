
import { faker } from '@faker-js/faker';

export function criarUsuario(administrador: 'true' | 'false' = 'false') {
    return {
        nome: faker.person.fullName(),
        email: `teste.${faker.string.uuid()}@example.com`,
        password: `Senha${faker.string.alphanumeric(10)}!`,
        administrador,
    };
}

export function criarProduto() {
    return {
        nome: `Produto ${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
        preco: faker.number.int({ min: 10, max: 1000 }),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.number.int({ min: 1, max: 100 }),
    };
}
