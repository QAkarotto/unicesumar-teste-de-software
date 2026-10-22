import { test, expect } from '@playwright/test';
import { novoProduto } from './support/factories';
import { cadastrarProduto, usuarioAutenticado } from './support/api';

test.describe('Produtos - /produtos', () => {
  test('CT08 - administrador deve cadastrar um produto e consultá-lo pelo _id', async ({ request }) => {
    const { token } = await usuarioAutenticado(request, 'true');
    const produto = novoProduto({ preco: 299, quantidade: 7 });

    const cadastro = await request.post('/produtos', {
      data: produto,
      headers: { Authorization: token },
    });
    expect(cadastro.status()).toBe(201);
    const corpoCadastro = await cadastro.json();
    expect(corpoCadastro.message).toBe('Cadastro realizado com sucesso');

    const consulta = await request.get(`/produtos/${corpoCadastro._id}`);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({ ...produto, _id: corpoCadastro._id });
  });

  test('CT09 - não deve cadastrar produto sem token de acesso', async ({ request }) => {
    const response = await request.post('/produtos', { data: novoProduto() });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    });
  });

  test('CT10 - usuário comum não pode cadastrar produto (rota exclusiva de administrador)', async ({ request }) => {
    const { token } = await usuarioAutenticado(request, 'false');

    const response = await request.post('/produtos', {
      data: novoProduto(),
      headers: { Authorization: token },
    });

    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Rota exclusiva para administradores' });
  });

  test('CT11 - não deve permitir dois produtos com o mesmo nome (regra de negócio)', async ({ request }) => {
    const { token } = await usuarioAutenticado(request, 'true');
    const existente = await cadastrarProduto(request, token);

    const response = await request.post('/produtos', {
      data: novoProduto({ nome: existente.nome }),
      headers: { Authorization: token },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Já existe produto com esse nome' });
  });
});
