# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\serverest.spec.ts >> API ServeRest >> 3 - Deve listar as categorias
- Location: tests\api\serverest.spec.ts:31:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 405
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('API ServeRest', () => {
  5  |   test('1 - Deve listar os usuários', async ({ request }) => {
  6  |     const response = await request.get('/usuarios');
  7  | 
  8  |     expect(response.status()).toBe(200);
  9  | 
  10 |     const body = await response.json();
  11 | 
  12 |     expect(body).toHaveProperty('quantidade');
  13 |     expect(body).toHaveProperty('usuarios');
  14 |     expect(Array.isArray(body.usuarios)).toBe(true);
  15 |     expect(body.quantidade).toBe(body.usuarios.length);
  16 |   });
  17 | 
  18 |   test('2 - Deve listar os produtos', async ({ request }) => {
  19 |     const response = await request.get('/produtos');
  20 | 
  21 |     expect(response.status()).toBe(200);
  22 | 
  23 |     const body = await response.json();
  24 | 
  25 |     expect(body).toHaveProperty('quantidade');
  26 |     expect(body).toHaveProperty('produtos');
  27 |     expect(Array.isArray(body.produtos)).toBe(true);
  28 |     expect(body.quantidade).toBe(body.produtos.length);
  29 |   });
  30 | 
  31 |   test('3 - Deve listar as categorias', async ({ request }) => {
  32 |     const response = await request.get('/categorias');
  33 | 
> 34 |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  35 | 
  36 |     const body = await response.json();
  37 | 
  38 |     expect(body).toHaveProperty('quantidade');
  39 |     expect(body).toHaveProperty('categorias');
  40 |     expect(Array.isArray(body.categorias)).toBe(true);
  41 |     expect(body.quantidade).toBe(body.categorias.length);
  42 |   });
  43 | 
  44 |   test('4 - Os produtos devem possuir os campos esperados', async ({ request }) => {
  45 |     const response = await request.get('/produtos');
  46 | 
  47 |     expect(response.status()).toBe(200);
  48 | 
  49 |     const body = await response.json();
  50 | 
  51 |     expect(body.produtos.length).toBeGreaterThan(0);
  52 | 
  53 |     const produto = body.produtos[0];
  54 | 
  55 |     expect(produto).toHaveProperty('nome');
  56 |     expect(produto).toHaveProperty('preco');
  57 |     expect(produto).toHaveProperty('descricao');
  58 |     expect(produto).toHaveProperty('quantidade');
  59 |   });
  60 | 
  61 |   test('5 - Os usuários devem possuir os campos esperados', async ({ request }) => {
  62 |     const response = await request.get('/usuarios');
  63 | 
  64 |     expect(response.status()).toBe(200);
  65 | 
  66 |     const body = await response.json();
  67 | 
  68 |     expect(body.usuarios.length).toBeGreaterThan(0);
  69 | 
  70 |     const usuario = body.usuarios[0];
  71 | 
  72 |     expect(usuario).toHaveProperty('nome');
  73 |     expect(usuario).toHaveProperty('email');
  74 |     expect(usuario).toHaveProperty('administrador');
  75 |   });
  76 | 
  77 |   test('6 - Deve rejeitar credenciais inválidas', async ({ request }) => {
  78 |     const response = await request.post('/login', {
  79 |       data: {
  80 |         email: 'usuario-inexistente@example.com',
  81 |         password: 'senha-incorreta',
  82 |       },
  83 |     });
  84 | 
  85 |     expect(response.status()).toBe(401);
  86 | 
  87 |     const body = await response.json();
  88 | 
  89 |     expect(body).toHaveProperty('message');
  90 |     expect(body.message).toBe('Email e/ou senha inválidos');
  91 |   });
  92 | });
  93 | 
```