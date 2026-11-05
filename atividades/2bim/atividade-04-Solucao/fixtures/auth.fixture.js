const base = require('@playwright/test');

const test = base.test.extend({
  adminPage: async ({ page, request }, use) => {
    const email = `admin${Date.now()}@qa.com`;
    const senha = 'admin123';

    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: 'Admin Teste',
        email: email,
        password: senha,
        administrador: 'true'
      }
    });

    await page.goto('https://front.serverest.dev/login');
    
    await page.getByTestId('email').fill(email); 
    await page.getByTestId('senha').fill(senha);
    await page.getByTestId('entrar').click();
    
    await base.expect(page).toHaveURL(/.*\/admin\/home/);
    
    await use(page);
  },
});

module.exports = { test, expect: base.expect };