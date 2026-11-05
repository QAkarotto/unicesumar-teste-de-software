const { test, expect } = require('@playwright/test');

test('deve bloquear o acesso com dados de login incorretos', async ({ page }) => {
  // Abre a página inicial do sistema
  await page.goto('/');

  // Preenche os campos com credenciais inválidas
  const email = page.locator('input[type="email"]');
  const senha = page.locator('input[type="password"]');

  await email.fill('emailinvalido@teste.com');
  await senha.fill('senhaerrada123');

  // Tenta realizar a autenticação
  await page.getByRole('button', { name: /entrar/i }).click();

  // Confirma que a aplicação apresenta uma mensagem de erro
  const mensagemErro = page.getByText(/email e\/ou senha inválidos/i);

  await expect(mensagemErro).toBeVisible();

  // Garante que o usuário não foi direcionado para uma área restrita
  await expect(page).not.toHaveURL(/home|admin/);
});