import { test as base } from '@playwright/test';
import { ServeRestApi } from '../helpers/api';
import { prepararUsuarioAutenticado, UsuarioAutenticado } from '../helpers/auth';
import { RegistroDeLimpeza } from '../helpers/limpeza';

type ApiFixtures = {
  /** Cliente da API; ao final de cada teste remove tudo o que foi criado por ele. */
  api: ServeRestApi;
  /** Usuário administrador novo, já autenticado (com token). */
  admin: UsuarioAutenticado;
  /** Usuário comum (não administrador) novo, já autenticado (com token). */
  usuarioComum: UsuarioAutenticado;
};

/**
 * As fixtures são criadas por teste e só quando o teste as pede, então cada
 * cenário prepara as próprias pré-condições e não depende de nenhum outro.
 */
export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const limpeza = new RegistroDeLimpeza();
    await use(new ServeRestApi(request, limpeza));
    await limpeza.executar(request); // teardown
  },

  admin: async ({ api }, use) => {
    await use(await prepararUsuarioAutenticado(api, 'true'));
  },

  usuarioComum: async ({ api }, use) => {
    await use(await prepararUsuarioAutenticado(api, 'false'));
  },
});

export { expect } from '@playwright/test';
