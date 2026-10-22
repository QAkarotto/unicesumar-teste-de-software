import { test as base, expect } from '@playwright/test';
import {
  ItemCarrinho,
  Produto,
  ProdutoCadastrado,
  Usuario,
  UsuarioAutenticado,
  UsuarioCadastrado,
  gerarProduto,
  gerarUsuario,
} from '../data/factories';
import { ClienteApi, criarClienteApi } from '../helpers/api';
import { autenticar } from '../helpers/auth';

type AcaoDeLimpeza = (api: ClienteApi) => Promise<unknown>;

type ApiFixtures = {
  /** Cliente com os endpoints do ServeRest. */
  api: ClienteApi;
  /** Agenda a remoção de um recurso criado durante o teste. */
  registrarLimpeza: (acao: AcaoDeLimpeza) => void;
  /** Cadastra um usuário com dados gerados (e o remove ao final do teste). */
  criarUsuario: (dados?: Partial<Usuario>) => Promise<UsuarioCadastrado>;
  /** Cadastra um usuário e já realiza o login, retornando o token. */
  criarUsuarioAutenticado: (dados?: Partial<Usuario>) => Promise<UsuarioAutenticado>;
  /** Administrador autenticado, pronto para rotas protegidas. */
  admin: UsuarioAutenticado;
  /** Cadastra um produto com dados gerados (e o remove ao final do teste). */
  criarProduto: (token: string, dados?: Partial<Produto>) => Promise<ProdutoCadastrado>;
  /** Cadastra um carrinho para o usuário do token (e cancela a compra ao final). */
  criarCarrinho: (token: string, itens: ItemCarrinho[]) => Promise<string>;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    await use(criarClienteApi(request));
  },

  registrarLimpeza: async ({ api }, use) => {
    const acoes: AcaoDeLimpeza[] = [];

    await use((acao) => {
      acoes.push(acao);
    });

    // Ordem inversa à criação: carrinho → produto → usuário. O ServeRest não
    // permite excluir produtos ou usuários vinculados a um carrinho.
    for (const acao of acoes.reverse()) {
      await acao(api).catch(() => undefined);
    }
  },

  criarUsuario: async ({ api, registrarLimpeza }, use) => {
    await use(async (dados = {}) => {
      const usuario = gerarUsuario(dados);
      const response = await api.usuarios.cadastrar(usuario);
      expect(response.status(), 'o cadastro da pré-condição deveria ser realizado').toBe(201);

      const { _id } = await response.json();
      registrarLimpeza((api) => api.usuarios.excluir(_id));

      return { ...usuario, _id };
    });
  },

  criarUsuarioAutenticado: async ({ api, criarUsuario }, use) => {
    await use(async (dados) => autenticar(api, await criarUsuario(dados)));
  },

  admin: async ({ criarUsuarioAutenticado }, use) => {
    await use(await criarUsuarioAutenticado({ administrador: 'true' }));
  },

  criarProduto: async ({ api, registrarLimpeza }, use) => {
    await use(async (token, dados = {}) => {
      const produto = gerarProduto(dados);
      const response = await api.produtos.cadastrar(produto, token);
      expect(response.status(), 'o cadastro do produto deveria ser realizado').toBe(201);

      const { _id } = await response.json();
      registrarLimpeza((api) => api.produtos.excluir(_id, token));

      return { ...produto, _id };
    });
  },

  criarCarrinho: async ({ api, registrarLimpeza }, use) => {
    await use(async (token, itens) => {
      const response = await api.carrinhos.cadastrar(itens, token);
      expect(response.status(), 'o cadastro do carrinho deveria ser realizado').toBe(201);

      const { _id } = await response.json();
      registrarLimpeza((api) => api.carrinhos.cancelarCompra(token));

      return _id;
    });
  },
});

export { expect };
