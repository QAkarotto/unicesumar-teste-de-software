import { faker } from "@faker-js/faker";


export function criarUsuario(){

    return {

        nome: faker.person.fullName(),

        email: faker.internet.email(),

        password: faker.internet.password(),

        administrador: "true"

    };

}



export function criarProduto(){

    return {

        nome: faker.commerce.productName(),

        preco: faker.number.int({
            min: 10,
            max: 500
        }),

        descricao: faker.commerce.productDescription(),

        quantidade: faker.number.int({
            min: 1,
            max: 100
        })

    };

}