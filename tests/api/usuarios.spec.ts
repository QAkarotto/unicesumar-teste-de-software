
import { test, expect } from '@playwright/test';

test('Deve retornar a lista de usuarios', async ({ request }) => {

  // 1. Faz a requisicao HTTP
  const resposta = await request.get(
    'https://serverest.dev/usuarios'
  );

  // 2. Confere o status HTTP
  expect(resposta.status()).toBe(200);

  // 3. Converte a resposta para JSON
  const dados = await resposta.json();

  // 4. Mostra a resposta no terminal
  console.log(dados);

  // 5. Confere se usuarios e uma lista
  expect(Array.isArray(dados.usuarios)).toBe(true);

  // 6. Verifica uma regra de consistencia
  expect(dados.quantidade).toBe(dados.usuarios.length);

});