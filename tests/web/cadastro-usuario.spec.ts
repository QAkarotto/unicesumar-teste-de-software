import { test, expect } from '@playwright/test';

test('deve cadastrar um usuário e realizar login', async ({ page }) => {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const usuario = {
    nome: `Usuario E2E ${id}`,
    email: `usuario.e2e.${id}@teste.com`,
    senha: 'TesteE2E123',
  };

  await page.goto('https://front.serverest.dev/');

  await page.getByText('Cadastre-se', { exact: false }).click();

  await page.getByPlaceholder('Digite seu nome').fill(usuario.nome);
  await page.getByPlaceholder('Digite seu email').fill(usuario.email);
  await page.getByPlaceholder('Digite sua senha').fill(usuario.senha);

  await page.getByRole('button', { name: 'Cadastrar' }).click();

  // Aguarda o redirecionamento após o cadastro.
  await expect(page).toHaveURL(/front\.serverest\.dev/);

  // Realiza login com o usuário cadastrado.
  await page.goto('https://front.serverest.dev/');

  await page.getByPlaceholder('Digite seu email').fill(usuario.email);
  await page.getByPlaceholder('Digite sua senha').fill(usuario.senha);

  await page.getByRole('button', { name: 'Entrar' }).click();

  // Verifica que o login não permaneceu na tela inicial.
  await expect(page).not.toHaveURL('https://front.serverest.dev/');
});