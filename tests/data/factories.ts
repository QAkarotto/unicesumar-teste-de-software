import { faker } from '@faker-js/faker';

export type Usuario = {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
};

export type Produto = {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
};

// O ServeRest público é compartilhado pela turma inteira: o sufixo aleatório impede colisão com e-mails e nomes que outra execução já cadastrou.
const sufixo = () => faker.string.alphanumeric(8).toLowerCase();

export function novoUsuario(dados: Partial<Usuario> = {}): Usuario {
  return {
    nome: faker.person.fullName(),
    email: `${sufixo()}.${faker.internet.email()}`.toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
    ...dados,
  };
}

export function novoProduto(dados: Partial<Produto> = {}): Produto {
  return {
    nome: `${faker.commerce.productName()} ${sufixo()}`,
    preco: faker.number.int({ min: 10, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 10, max: 100 }),
    ...dados,
  };
}
