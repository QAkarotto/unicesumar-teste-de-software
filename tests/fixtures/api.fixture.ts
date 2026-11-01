import { test as base, expect } from '@playwright/test';
import { criarApi, type Cleanup, type AuthHeaders } from '../helpers/api';
import { autenticar } from '../helpers/auth';
import type { Usuario } from '../data/factories';

type Sessao = { usuario: Usuario & { _id: string }; headers: AuthHeaders };
type Fixtures = {
  api: ReturnType<typeof criarApi>;
  administrador: Sessao;
  cliente: Sessao;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const limpezas: Cleanup[] = [];
    const api = criarApi(request, (cleanup) => limpezas.push(cleanup));
    try {
      await use(api);
    } finally {
      for (const cleanup of limpezas.reverse()) {
        // Uma falha de rede não deve impedir a tentativa de limpar os outros recursos.
        try {
          await cleanup();
        } catch (error) {
          expect.soft(error, 'Falha durante a limpeza dos dados').toBeUndefined();
        }
      }
    }
  },
  administrador: async ({ api, request }, use) => {
    const usuario = await api.criarUsuario({ administrador: 'true' });
    await use({ usuario, headers: await autenticar(request, usuario) });
  },
  cliente: async ({ api, request }, use) => {
    const usuario = await api.criarUsuario();
    await use({ usuario, headers: await autenticar(request, usuario) });
  },
});

export { expect } from '@playwright/test';
