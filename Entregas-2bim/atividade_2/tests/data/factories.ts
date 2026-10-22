import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * Factories de massa de dados.
 * Toda geração com Faker fica concentrada aqui: os testes só pedem "um usuário"
 * ou "um produto" e, se precisarem, sobrescrevem os campos relevantes ao cenário.
 */

export type Administrador = 'true' | 'false';

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  administrador: Administrador;
}

export interface Produto {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface ItemCarrinho {
  idProduto: string;
  quantidade: number;
}

export function novoUsuario(overrides: Partial<Usuario> = {}): Usuario {
  const primeiroNome = faker.person.firstName();
  const sobrenome = faker.person.lastName();

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    // O trecho aleatório no e-mail evita colisão com cadastros de outras execuções/pessoas.
    email: faker.internet
      .email({ firstName: primeiroNome, lastName: faker.string.alphanumeric(8), provider: 'qa-playwright.com' })
      .toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
    ...overrides,
  };
}

export function novoProduto(overrides: Partial<Produto> = {}): Produto {
  return {
    // O ServeRest não aceita nomes de produto repetidos, então o nome recebe um sufixo único.
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(6).toUpperCase()}`,
    preco: faker.number.int({ min: 10, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 5, max: 100 }),
    ...overrides,
  };
}

export function itensDoCarrinho(...itens: ItemCarrinho[]) {
  return { produtos: itens };
}
