
const { test, expect } = require('@playwright/test');

test('Cenário 1 - Cadastro e autenticação de usuário', async ({ page }) => {
  // Gera credenciais únicas para cada execução
  const identificador = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const nome = `Usuario Teste ${identificador}`;
  const email = `usuario${identificador}@teste.com`;
  const senha = 'Teste@123456';

  // Acessa o frontend do ServeRest
  await page.goto('/');

  // Abre a tela de cadastro
  await page.getByText('Cadastre-se', { exact: true }).click();

  // Preenche o formulário de cadastro
  await page.getByTestId('nome').fill(nome);
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(senha);

  // Cadastra um usuário comum
  await page.getByTestId('cadastrar').click();

  // Verifica o acesso à área do usuário
  await expect(page).toHaveURL(/home/);

  // Retorna ao login para autenticar novamente
  await page.getByRole('button', { name: /logout|sair/i }).click();

  // Realiza a autenticação com as credenciais cadastradas
  await page.getByTestId('email').fill(email);
  await page.getByTestId('senha').fill(senha);
  await page.getByTestId('entrar').click();

  // Valida o acesso autenticado
  await expect(page).toHaveURL(/home/);
});
