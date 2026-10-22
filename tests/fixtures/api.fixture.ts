import { test as base, expect } from '@playwright/test';
import { gerarProduto, gerarUsuario, type Produto, type Usuario } from '../data/factories';
import {
  cadastrarCarrinho,
  cadastrarProduto,
  cancelarCompra,
  criarUsuarioOk,
  excluirProduto,
  excluirUsuario,
  type ItemCarrinho,
} from '../helpers/api';
import { prepararSessao, type Sessao } from '../helpers/auth';

export type ProdutoCriado = Produto & { id: string };

type Fixtures = {
  /** Usuário comum apenas cadastrado (sem login). Removido ao final. */
  usuario: { usuario: Usuario; id: string };
  /** Administrador já autenticado. Removido ao final. */
  admin: Sessao;
  /** Usuário comum já autenticado. Removido ao final. */
  comum: Sessao;
  /** Cria produtos (como admin) e os remove ao final do teste. */
  criarProduto: (overrides?: Partial<Produto>) => Promise<ProdutoCriado>;
  /** Cria o carrinho do usuário `comum` e o cancela ao final do teste. */
  criarCarrinho: (itens: ItemCarrinho[]) => Promise<string>;
};

export const test = base.extend<Fixtures>({
  usuario: async ({ request }, use) => {
    const usuario = gerarUsuario();
    const id = await criarUsuarioOk(request, usuario);
    await use({ usuario, id });
    await excluirUsuario(request, id);
  },

  admin: async ({ request }, use) => {
    const sessao = await prepararSessao(request, true);
    await use(sessao);
    await excluirUsuario(request, sessao.id);
  },

  comum: async ({ request }, use) => {
    const sessao = await prepararSessao(request, false);
    await use(sessao);
    await excluirUsuario(request, sessao.id);
  },

  criarProduto: async ({ request, admin }, use) => {
    const ids: string[] = [];
    await use(async (overrides = {}) => {
      const produto = gerarProduto(overrides);
      const resp = await cadastrarProduto(request, admin.token, produto);
      expect(resp.status(), 'pré-condição: cadastro de produto').toBe(201);
      const id = (await resp.json())._id as string;
      ids.push(id);
      return { ...produto, id };
    });
    for (const id of ids) await excluirProduto(request, admin.token, id);
  },

  // Depende de `criarProduto` e `comum` => o carrinho é cancelado ANTES
  // de produtos e usuário serem removidos (teardown em ordem inversa).
  criarCarrinho: async ({ request, comum, criarProduto }, use) => {
    void criarProduto;
    await use(async (itens) => {
      const resp = await cadastrarCarrinho(request, comum.token, itens);
      expect(resp.status(), 'pré-condição: cadastro de carrinho').toBe(201);
      return (await resp.json())._id as string;
    });
    await cancelarCompra(request, comum.token);
  },
});

export { expect };
