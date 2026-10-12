const { test, expect } = require('@playwright/test');

test('consultar usuário pela API', async ({ request }) => {

    const response = await request.get(
        'https://jsonplaceholder.typicode.com/users/1'
    );

    expect(response.status()).toBe(200);

    const usuario = await response.json();

    expect(usuario.id).toBe(1);

    console.log(usuario);

});