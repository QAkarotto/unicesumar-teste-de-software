import { test, expect } from './fixtures/auth.fixture'; 
import { faker } from '@faker-js/faker';

test('Cenário 1: Cadastro e autenticação de usuário', async ({ page }) => {
    const nome = faker.person.fullName();
    const email = faker.internet.email();
    const senha = faker.internet.password();

    await page.goto('/login', { waitUntil: 'commit' });
    

    const btnIrParaCadastro = page.getByTestId('cadastrar');
    await btnIrParaCadastro.waitFor({ state: 'visible' });
    await btnIrParaCadastro.click();

    await page.getByTestId('nome').fill(nome);
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill(senha); 
    await page.getByTestId('cadastrar').click();

    await expect(page.locator('.alert')).toContainText('Cadastro realizado com sucesso');
    

    await page.waitForURL('**/home', { waitUntil: 'domcontentloaded' });

    await page.getByTestId('logout').click();
    await page.waitForURL('**/login', { waitUntil: 'domcontentloaded' });

    await page.getByTestId('email').fill(email);
    await page.getByTestId('senha').fill(senha); 
    await page.getByTestId('entrar').click();

    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('h1')).toContainText('Serverest Store');
  });

  test('Cenário 2: Cadastro de produto pelo administrador', async ({ adminPage }) => {
    const nomeProduto = `Produto ${faker.commerce.productName()} ${faker.string.uuid()}`;
    const preco = faker.number.int({ min: 10, max: 1000 }).toString();
    const descricao = faker.commerce.productDescription();
    const quantidade = faker.number.int({ min: 1, max: 50 }).toString();

    await adminPage.getByTestId('cadastrarProdutos').click();
    
    await adminPage.getByTestId('nome').fill(nomeProduto);
    await adminPage.getByTestId('preco').fill(preco);
    await adminPage.getByTestId('descricao').fill(descricao);
    await adminPage.getByTestId('quantity').fill(quantidade);
    await adminPage.getByTestId('cadastarProdutos').click(); 

    await adminPage.waitForURL('**/admin/listarprodutos');
    const tabela = adminPage.locator('table');
    await expect(tabela).toContainText(nomeProduto);
    await expect(tabela).toContainText(descricao);
  });

  test('Cenário 3: Autenticação com credenciais inválidas', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'commit' });
    await page.getByTestId('email').fill(`invalido_${faker.string.uuid()}@teste.com`);
    await page.getByTestId('senha').fill('senha_errada_123');
    
    await page.getByTestId('entrar').click();

    const alertaErro = page.locator('.alert');
    await expect(alertaErro).toBeVisible();
    await expect(alertaErro).toContainText('Email e/ou senha inválidos');
    await expect(page).toHaveURL(/.*login/); 
  });
