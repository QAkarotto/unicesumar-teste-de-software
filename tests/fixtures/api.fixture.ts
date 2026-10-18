import { test as base, expect } from '@playwright/test';
import { cadastrarProduto, cadastrarUsuario, type Limpeza } from '../helpers/api';
import { autenticar } from '../helpers/auth';

type Fixtures = {
  limpezas: Limpeza[];
  usuario: Awaited<ReturnType<typeof cadastrarUsuario>>;
  token: string;
  produto: Awaited<ReturnType<typeof cadastrarProduto>>;
};

export const test = base.extend<Fixtures>({
  limpezas: async ({ request }, use) => {
    const tarefas: Limpeza[] = [];
    try {
      await use(tarefas);
    } finally {
      // Ordem inversa: carrinho, produto, usuário. Tenta todas as limpezas.
      const erros: unknown[] = [];
      for (const limpar of tarefas.reverse()) {
        try { await limpar(); } catch (erro) { erros.push(erro); }
      }
      expect(erros, 'Falhas na limpeza dos recursos criados pelo teste').toEqual([]);
    }
  },
  usuario: async ({ request, limpezas }, use) => {
    await use(await cadastrarUsuario(request, limpezas));
  },
  token: async ({ request, usuario }, use) => {
    await use(await autenticar(request, usuario));
  },
  produto: async ({ request, token, limpezas }, use) => {
    await use(await cadastrarProduto(request, token, limpezas));
  },
});

export { expect };
