import { gerarProduto } from '../data/factories';
import { MENSAGENS } from '../data/mensagens';
import { expect, test } from '../fixtures/api.fixture';

test.describe('API ServeRest - Produtos', () => {
  test('não deve cadastrar produto sem token de autenticação', async ({ api }) => {
    const response = await api.produtos.cadastrar(gerarProduto());

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.tokenInvalido);
    expect(body._id).toBeUndefined();
  });

  test('não deve permitir que usuário não administrador cadastre produto', async ({
    api,
    criarUsuarioAutenticado,
  }) => {
    const usuarioComum = await criarUsuarioAutenticado({ administrador: 'false' });

    // Regra de negócio: apenas administradores podem cadastrar produtos
    const response = await api.produtos.cadastrar(gerarProduto(), usuarioComum.token);

    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.rotaAdministrador);
    expect(body._id).toBeUndefined();
  });

  test('deve cadastrar produto autenticado como administrador e persistir os dados', async ({
    api,
    admin,
    registrarLimpeza,
  }) => {
    // criar usuário → autenticar (fixture admin) → criar produto → consultar produto
    const produto = gerarProduto();

    const response = await api.produtos.cadastrar(produto, admin.token);
    const body = await response.json();
    registrarLimpeza((api) => api.produtos.excluir(body._id, admin.token));

    expect(response.status()).toBe(201);
    expect(body.message).toBe(MENSAGENS.cadastroRealizado);
    expect(body._id).toEqual(expect.any(String));

    const consulta = await api.produtos.buscar(body._id);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({ ...produto, _id: body._id });
  });

  test('não deve permitir cadastrar produto com nome já existente', async ({
    api,
    admin,
    criarProduto,
  }) => {
    const existente = await criarProduto(admin.token);

    // Regra de negócio: o nome do produto deve ser único
    const response = await api.produtos.cadastrar(
      gerarProduto({ nome: existente.nome }),
      admin.token,
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.produtoDuplicado);
    expect(body._id).toBeUndefined();
  });

  test('não deve cadastrar produto com preço e quantidade negativos', async ({ api, admin }) => {
    const response = await api.produtos.cadastrar(
      gerarProduto({ preco: -10, quantidade: -1 }),
      admin.token,
    );

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      preco: 'preco deve ser um número positivo',
      quantidade: 'quantidade deve ser maior ou igual a 0',
    });
  });

  test('deve excluir um produto e não encontrá-lo mais', async ({ api, admin, criarProduto }) => {
    const produto = await criarProduto(admin.token);

    const response = await api.produtos.excluir(produto._id, admin.token);

    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe(MENSAGENS.registroExcluido);

    const consulta = await api.produtos.buscar(produto._id);
    expect(consulta.status()).toBe(400);
    expect((await consulta.json()).message).toBe(MENSAGENS.produtoNaoEncontrado);
  });
});
