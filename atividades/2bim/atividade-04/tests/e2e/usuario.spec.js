const { test, expect } = require('@playwright/test');

test('deve cadastrar e autenticar um usuário comum', async ({ page }) => {
  const identificador = Date.now();

  const usuario = {
    nome: `Usuario Teste ${identificador}`,
    email: `usuario${identificador}@teste.com`,
    senha: 'Teste@123'
  };

  await page.goto('/');

  await page.getByText('Cadastre-se').click();


  await page.getByTestId('nome').fill(usuario.nome);
  await page.getByTestId('email').fill(usuario.email);
  await page.getByTestId('password').fill(usuario.senha);

  const checkbox = page.getByTestId('checkbox');

  if (await checkbox.isChecked()) {
    await checkbox.uncheck();
  }

  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(
    page.getByText('Cadastro realizado com sucesso')
  ).toBeVisible();

  await page.getByText('Entrar').last().click();

  await expect(page).toHaveURL(/\/login$/);

  await page.getByTestId('email').fill(usuario.email);
  await page.getByTestId('senha').fill(usuario.senha);


  const respostaLogin = page.waitForResponse(resposta =>
    resposta.url().includes('/login') &&
    resposta.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Entrar' }).click();

  const resposta = await respostaLogin;

  expect(resposta.status()).toBe(200);

  const dadosLogin = await resposta.json();

  expect(dadosLogin).toHaveProperty('authorization');

await expect(page).not.toHaveURL(/\/login$/);

await expect(page.getByText('Logout')).toBeVisible();

console.log('Usuário cadastrado:', usuario.email);
console.log('Status do login:', resposta.status());
console.log('URL após autenticação:', page.url());
console.log('Área autenticada acessada com sucesso.');
});