import { test, expect } from '@playwright/test';

// Estrutura preparada para os futuros testes Web (projeto "web" do playwright.config.ts).
// Remova o `.skip` e ajuste o cenário quando os testes Web forem implementados.
test.describe.skip('Web - exemplo (placeholder)', () => {
  test('carrega a página inicial', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ServeRest/i);
  });
});
