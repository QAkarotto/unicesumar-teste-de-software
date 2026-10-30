import { test as base, type APIRequestContext } from '@playwright/test';
import { novoProduto, novoUsuario, type Produto, type Usuario } from '../data/factories';
import { cadastrarProduto, cadastrarUsuario, cancelarCompra, excluirProduto, excluirUsuario } from '../helpers/api';
import { login } from '../helpers/auth';

export type UsuarioCadastrado = Usuario & { _id: string };
export type UsuarioAutenticado = UsuarioCadastrado & { token: string };
export type ProdutoCadastrado = Produto & { _id: string };

/** Recursos criados durante um teste, removidos no teardown na ordem que o ServeRest exige. */
export class Limpeza {
  private readonly usuarios = new Map<string, string | undefined>();
  private readonly produtos = new Map<string, string>();

  usuario(id: string, token?: string) {
    this.usuarios.set(id, token);
  }

  produto(id: string, tokenDeAdmin: string) {
    this.produtos.set(id, tokenDeAdmin);
  }

  async executar(request: APIRequestContext) {
    // Carrinho aberto impede excluir o usuário e os produtos dele; cancelar a compra devolve o estoque e libera os dois.
    for (const token of this.usuarios.values()) if (token) await cancelarCompra(request, token);
    // Produtos saem antes dos usuários porque a exclusão exige o token de um administrador que ainda exista.
    for (const [id, token] of this.produtos) await excluirProduto(request, token, id);
    for (const id of this.usuarios.keys()) await excluirUsuario(request, id);
  }
}

type ApiFixtures = {
  limpeza: Limpeza;
  /** Cadastra um usuário com dados do Faker, sobrescritos por `dados`. */
  criarUsuario: (dados?: Partial<Usuario>) => Promise<UsuarioCadastrado>;
  /** Cadastra um usuário e faz login com ele. */
  criarUsuarioAutenticado: (dados?: Partial<Usuario>) => Promise<UsuarioAutenticado>;
  admin: UsuarioAutenticado;
  cliente: UsuarioAutenticado;
  /** Cadastra um produto com dados do Faker em nome do `admin`. */
  criarProduto: (dados?: Partial<Produto>) => Promise<ProdutoCadastrado>;
};

// Todas as fixtures registram o que criam na `limpeza`, que é montada primeiro e desmontada por último.
export const test = base.extend<ApiFixtures>({
  limpeza: async ({ request }, use) => {
    const limpeza = new Limpeza();
    await use(limpeza);
    await limpeza.executar(request);
  },

  criarUsuario: async ({ request, limpeza }, use) => {
    await use(async (dados) => {
      const usuario = novoUsuario(dados);
      const _id = await cadastrarUsuario(request, usuario);
      limpeza.usuario(_id);
      return { ...usuario, _id };
    });
  },

  criarUsuarioAutenticado: async ({ request, limpeza, criarUsuario }, use) => {
    await use(async (dados) => {
      const usuario = await criarUsuario(dados);
      const token = await login(request, usuario.email, usuario.password);
      limpeza.usuario(usuario._id, token);
      return { ...usuario, token };
    });
  },

  admin: async ({ criarUsuarioAutenticado }, use) => {
    await use(await criarUsuarioAutenticado({ administrador: 'true' }));
  },

  cliente: async ({ criarUsuarioAutenticado }, use) => {
    await use(await criarUsuarioAutenticado({ administrador: 'false' }));
  },

  criarProduto: async ({ request, limpeza, admin }, use) => {
    await use(async (dados) => {
      const produto = novoProduto(dados);
      const _id = await cadastrarProduto(request, admin.token, produto);
      limpeza.produto(_id, admin.token);
      return { ...produto, _id };
    });
  },
});

export { expect } from '@playwright/test';
