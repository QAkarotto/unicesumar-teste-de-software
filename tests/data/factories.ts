import { faker } from '@faker-js/faker';

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
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

export type UsuarioCadastrado = Usuario & { _id: string };
export type UsuarioAutenticado = UsuarioCadastrado & { token: string };
export type ProdutoCadastrado = Produto & { _id: string };

/**
 * Sufixo aleatório adicionado a e-mails e nomes de produtos. O ServeRest é um
 * ambiente público e compartilhado, então só o Faker não garante unicidade.
 */
function sufixoUnico(): string {
  return faker.string.alphanumeric({ length: 8, casing: 'lower' });
}

/** Gera os dados de um usuário (administrador por padrão) com e-mail único. */
export function gerarUsuario(sobrescrever: Partial<Usuario> = {}): Usuario {
  const primeiroNome = faker.person.firstName();
  const sobrenome = faker.person.lastName();

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    email: faker.internet
      .email({ firstName: primeiroNome, lastName: `${sobrenome}.${sufixoUnico()}` })
      .toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
    ...sobrescrever,
  };
}

/** Gera os dados de um produto com nome único. */
export function gerarProduto(sobrescrever: Partial<Produto> = {}): Produto {
  return {
    nome: `${faker.commerce.productName()} ${sufixoUnico()}`,
    preco: faker.number.int({ min: 10, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 10, max: 100 }),
    ...sobrescrever,
  };
}

/** Gera um e-mail que não pertence a nenhum usuário cadastrado. */
export function gerarEmailInexistente(): string {
  return `inexistente.${sufixoUnico()}@${faker.internet.domainName()}`;
}
