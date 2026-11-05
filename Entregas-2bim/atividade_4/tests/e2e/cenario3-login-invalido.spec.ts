import { Page } from '@playwright/test';
import { expect, test } from '../fixtures/e2e.fixture';
import { LoginPage } from '../pages/login.page';
import { prepararUsuario } from '../support/api';
import { novoUsuario } from '../support/factories';
import { tokenDaSessao } from '../support/sessao';

/**
 * Cenário 3 — Autenticação com credenciais inválidas.
 * Duas variações: e-mail que não existe e senha errada para um usuário que existe.
 * Nas duas, o ServeRest deve responder com a mesma mensagem genérica (não revela qual dado está errado).
 */
const MENSAGEM_DE_ERRO = 'Email e/ou senha inválidos';

test.describe('Cenário 3: autenticação com credenciais inválidas', () => {
  test('CT04 - login com e-mail não cadastrado é recusado', async ({ page }) => {
    const login = new LoginPage(page);
    const naoCadastrado = novoUsuario(); // gerado, mas nunca cadastrado

    await test.step('Preparação: abrir a tela de login', async () => {
      await login.abrir();
    });

    await tentarLoginEValidarRecusa(page, login, naoCadastrado.email, naoCadastrado.password);
  });

  test('CT05 - login com senha incorreta de um usuário existente é recusado', async ({ page, api, limpeza }) => {
    const login = new LoginPage(page);
    const usuario = novoUsuario({ administrador: 'true' });

    await test.step('Preparação: cadastrar o usuário pela API e abrir a tela de login', async () => {
      limpeza.removerUsuarioAoFinal(usuario.email);
      await prepararUsuario(api, usuario);
      await login.abrir();
    });

    await tentarLoginEValidarRecusa(page, login, usuario.email, `${usuario.password}-errada`);
  });
});

/** Passos e asserções comuns às duas variações do cenário 3. */
async function tentarLoginEValidarRecusa(page: Page, login: LoginPage, email: string, senha: string) {
  await test.step('Tentar autenticar com as credenciais inválidas', async () => {
    const respostaLogin = page.waitForResponse(
      (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/login',
    );
    await login.autenticar(email, senha);
    expect((await respostaLogin).status()).toBe(401);
  });

  await test.step('Validar a mensagem de erro', async () => {
    // Um único alerta, contendo exatamente a mensagem da API (o alerta também tem o botão "×" de fechar).
    await expect(login.alertaDeErro).toHaveCount(1);
    await expect(login.alertaDeErro.getByText(MENSAGEM_DE_ERRO, { exact: true })).toBeVisible();
    await test.info().attach('mensagem-de-erro', { body: await page.screenshot(), contentType: 'image/png' });
  });

  await test.step('Verificar que o acesso à área autenticada não foi permitido', async () => {
    // Continua na tela de login e nenhuma sessão foi criada no navegador.
    await expect(page).toHaveURL((url) => url.pathname === '/login');
    await expect(login.botaoEntrar).toBeVisible();
    expect(await tokenDaSessao(page)).toBeNull();

    // Tentar abrir a área do administrador direto pela URL devolve o usuário para o login.
    await page.goto('/admin/home');
    await expect(page).toHaveURL((url) => url.pathname === '/login');
    await expect(login.botaoEntrar).toBeVisible();
  });
}
