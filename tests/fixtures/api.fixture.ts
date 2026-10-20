import { test as base } from '@playwright/test';
import type { Produto, Usuario } from '../data/factories';
import { cadastrarProduto, cancelarCompra, excluirProduto, excluirUsuario } from '../helpers/api';
import { criarUsuarioAutenticado } from '../helpers/auth';

type UsuarioAutenticado = { usuario: Usuario; id: string; token: string };
type ProdutoCadastrado = { produto: Produto; id: string };

type ApiFixtures = {
  admin: UsuarioAutenticado;
  cliente: UsuarioAutenticado;
  produto: ProdutoCadastrado;
};

export const test = base.extend<ApiFixtures>({
  admin: async ({ request }, use) => {
    const admin = await criarUsuarioAutenticado(request, 'true');
    await use(admin);
    await cancelarCompra(request, admin.token);
    await excluirUsuario(request, admin.id);
  },

  cliente: async ({ request }, use) => {
    const cliente = await criarUsuarioAutenticado(request, 'false');
    await use(cliente);

    await cancelarCompra(request, cliente.token);
    await excluirUsuario(request, cliente.id);
  },

  produto: async ({ request, admin }, use) => {
    const produto = await cadastrarProduto(request, admin.token);
    await use(produto);
    await excluirProduto(request, admin.token, produto.id);
  },
});

export { expect } from '@playwright/test';
