import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

const frontUrl = process.env.SERVEREST_FRONT_URL ?? 'https://front.serverest.dev';

test.describe('Jornadas de autenticação no ServeRest Front', () => {
  test('cadastra um usuário e autentica com as credenciais criadas', async ({ page }) => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 16 }),
    };

    // Preparação: abrir a tela pública de cadastro e gerar dados únicos.
    await page.goto(`${frontUrl}/cadastrarusuarios`);

    // Ação do cenário: cadastrar pela interface como cliente.
    await page.getByTestId('nome').fill(usuario.nome);
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('password').fill(usuario.password);
    await page.getByTestId('cadastrar').click();
    await page.waitForURL('**/home');

    // Ação do cenário: autenticar novamente pela tela de login.
    await page.goto(`${frontUrl}/login`);
    await page.getByTestId('email').fill(usuario.email);
    await page.getByTestId('senha').fill(usuario.password);
    await page.getByTestId('entrar').click();

    // Resultado esperado: cliente chega à área do perfil de cliente.
    await page.waitForURL('**/home');
    await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('recusa credenciais inválidas e mantém o usuário fora da área autenticada', async ({ page }) => {
    // Preparação: abrir o formulário público e usar credenciais que não existem.
    await page.goto(`${frontUrl}/login`);
    await page.getByTestId('email').fill(`inexistente-${faker.string.uuid()}@exemplo.com`);
    await page.getByTestId('senha').fill(faker.internet.password({ length: 16 }));

    // Ação do cenário: tentar autenticar pela interface.
    await page.getByTestId('entrar').click();

    // Resultado esperado: mensagem de erro e permanência na tela de login.
    await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('entrar')).toBeVisible();
  });
});
