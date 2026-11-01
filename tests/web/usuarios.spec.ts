
import { test, expect } from '@playwright/test';
import { usuarioFactory } from '../data/factories';

test('deve cadastrar usuário e autenticar pela interface', async ({ page }) => {
  const usuario = usuarioFactory();

  // Cadastro pela interface
  await page.goto('/cadastrarusuarios');

  await page.getByTestId('nome').fill(usuario.nome);
  await page.getByTestId('email').fill(usuario.email);
  await page.getByTestId('password').fill(usuario.password);

  await page.getByTestId('cadastrar').click();

  // Confirma o cadastro e o redirecionamento
  await expect(page).toHaveURL(/\/home/);

  // Encerra a sessão iniciada automaticamente
  await page.getByText('Logout').click();

  // Realiza um novo login pela interface
  await page.getByTestId('email').fill(usuario.email);
  await page.getByTestId('senha').fill(usuario.password);
  await page.getByTestId('entrar').click();

  // Confirma o acesso autenticado
  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByText('Logout')).toBeVisible();
});

test('deve impedir login com credenciais inválidas', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('email').fill('usuario.inexistente@example.com');
  await page.getByTestId('senha').fill('SenhaInvalida123!');
  await page.getByTestId('entrar').click();

  // Verifica a mensagem de erro.
  await expect(page.getByRole('alert')).toContainText(
    'Email e/ou senha inválidos'
  );

  // Confirma que o usuário continua na tela de login.
  await expect(page).toHaveURL(/\/login/);

  // Confirma que não houve autenticação.
  await expect(page.getByTestId('entrar')).toBeVisible();
});
