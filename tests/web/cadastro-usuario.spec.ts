
import { test, expect } from '@playwright/test';
import { criarUsuario } from '../data/factories';
import { preencherCampo } from '../helpers/web';

test('deve cadastrar e autenticar um novo usuário', async ({ page }) => {
    const usuario = criarUsuario('false');

    // Acessa o formulário de cadastro.
    await page.goto('/cadastrarusuarios');

    await preencherCampo(
        page,
        'nome',
        page.locator('input').nth(0),
        usuario.nome,
    );

    await preencherCampo(
        page,
        'email',
        page.locator('input[type="email"]'),
        usuario.email,
    );

    await preencherCampo(
        page,
        'password',
        page.locator('input[type="password"]'),
        usuario.password,
    );

    // Aguarda a confirmação real do cadastro pela API.
    const respostaCadastroPromise = page.waitForResponse(
        response =>
            response.url().includes('/usuarios') &&
            response.request().method() === 'POST',
    );

    await page.getByRole('button', {
        name: /cadastrar/i,
    }).click();

    const respostaCadastro = await respostaCadastroPromise;

    // Confirma que o usuário foi criado.
    expect(
        respostaCadastro.status(),
        'O cadastro do usuário deveria retornar HTTP 201.',
    ).toBe(201);

    // Limpa a sessão para realizar uma autenticação independente.
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    // Acessa a tela de login.
    await page.goto('/login');

    await preencherCampo(
        page,
        'email',
        page.locator('input[type="email"]'),
        usuario.email,
    );

    await preencherCampo(
        page,
        'password',
        page.locator('input[type="password"]'),
        usuario.password,
    );

    await page.getByRole('button', {
        name: /entrar/i,
    }).click();

    // Confirma que o usuário acessou a área de cliente.
    await expect(page).not.toHaveURL(/\/login/);

    await expect(
        page.getByRole('button', { name: /entrar/i }),
    ).not.toBeVisible();
});
