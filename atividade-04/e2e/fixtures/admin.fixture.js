
const { test: base, expect } = require('@playwright/test')

const test = base.extend({
  adminPage: async ({ page, request }, use) => {
    const email = `admin${Date.now()}@teste.com`
    const password = 'Teste@12345'

    // Preparação: cria um administrador pela API
    const response = await request.post(
      'https://serverest.dev/usuarios',
      {
        data: {
          nome: 'Administrador E2E',
          email,
          password,
          administrador: 'true'
        }
      }
    )

    expect(response.ok()).toBeTruthy()

    // Ação principal: autenticação pela interface
    await page.goto('/')

    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)

    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/admin/)

    await use(page)
  }
})

module.exports = { test, expect }
