import { expect, Page, test as base } from '@playwright/test';
import { AreaAdminPage } from '../pages/areas.page';
import { API_URL } from '../support/ambiente';
import { obterToken, prepararUsuario, ServeRestApi, UsuarioAutenticado } from '../support/api';
import { novoUsuario } from '../support/factories';
import { RegistroDeLimpeza } from '../support/limpeza';
import { gravarSessao } from '../support/sessao';

type E2EFixtures = {
  /** Cliente da API do ServeRest (apenas para pré-condições e limpeza). */
  api: ServeRestApi;
  /** Agenda a remoção do que o teste criar; a remoção roda no teardown, mesmo se o teste falhar. */
  limpeza: RegistroDeLimpeza;
  /** Administrador novo, cadastrado e autenticado pela API, exclusivo do teste. */
  admin: UsuarioAutenticado;
  /** Página do navegador já autenticada como `admin` e aberta na área do administrador (/admin/home). */
  adminPage: Page;
};

/**
 * Fixtures dos testes E2E. Todas têm escopo de teste e só são criadas quando o teste as pede,
 * então cada cenário recebe a própria massa de dados e não depende de nenhum outro.
 */
export const test = base.extend<E2EFixtures>({
  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    await use(new ServeRestApi(request));
    await request.dispose();
  },

  limpeza: async ({ api }, use) => {
    const limpeza = new RegistroDeLimpeza();
    await use(limpeza);
    await limpeza.executar(api); // teardown
  },

  admin: async ({ api, limpeza }, use) => {
    const usuario = novoUsuario({ administrador: 'true' });
    limpeza.removerUsuarioAoFinal(usuario.email);

    const cadastrado = await prepararUsuario(api, usuario);
    const token = await obterToken(api, usuario.email, usuario.password);
    await use({ ...cadastrado, token });
  },

  adminPage: async ({ page, admin }, use) => {
    // Login programático: o token vem da API (fixture `admin`) e é gravado no localStorage do
    // mesmo jeito que a tela de login faria. O cenário começa já autenticado, sem repetir o login pela tela.
    await page.goto('/login');
    await gravarSessao(page, admin);
    await page.goto('/admin/home');

    // A fixture só entrega a página depois de comprovar que a sessão de admin está ativa.
    const areaAdmin = new AreaAdminPage(page);
    await expect(page).toHaveURL((url) => url.pathname === '/admin/home');
    await expect(areaAdmin.saudacao).toHaveText(`Bem Vindo ${admin.nome}`);
    await expect(areaAdmin.menuCadastrarProdutos).toBeVisible();

    await use(page);
  },
});

export { expect } from '@playwright/test';
