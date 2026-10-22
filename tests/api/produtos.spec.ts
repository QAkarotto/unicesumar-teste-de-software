import { test, expect } from '@playwright/test';
import { criarProdutoDto } from '../../data/factories';
import { obterTokenAutenticacao } from '../../helpers/auth';

test.describe('Testes de API - ServeRest (Produtos)', () => {

  test('6. Deve falhar ao tentar cadastrar produto sem estar autenticado', async ({ request }) => {
    const produtoDto = criarProdutoDto();

    const resposta = await request.post('/produtos', {
      data: produtoDto,
    });

    expect(resposta.status()).toBe(401);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });

  test('7. Cenário com múltiplas requisições relacionadas (cadastrar produto e consultar por ID)', async ({ request }) => {
    const token = await obterTokenAutenticacao(request);
    const produtoDto = criarProdutoDto();

    // 1. Cadastra o produto
    const respostaCadastro = await request.post('/produtos', {
      headers: { authorization: token },
      data: produtoDto,
    });
    expect(respostaCadastro.status()).toBe(201);
    const corpoCadastro = await respostaCadastro.json();
    const produtoId = corpoCadastro._id;

    // 2. Consulta o produto recém-criado
    const respostaConsulta = await request.get(`/produtos/${produtoId}`);
    expect(respostaConsulta.status()).toBe(200);
    const corpoConsulta = await respostaConsulta.json();
    expect(corpoConsulta.nome).toBe(produtoDto.nome);
  });

  test('8. Validação do estado final de um recurso após exclusão', async ({ request }) => {
    const token = await obterTokenAutenticacao(request);
    const produtoDto = criarProdutoDto();

    // 1. Cadastra o produto
    const resCadastro = await request.post('/produtos', {
      headers: { authorization: token },
      data: produtoDto,
    });
    const produtoId = (await resCadastro.json())._id;

    // 2. Exclui o produto
    const resDelete = await request.delete(`/produtos/${produtoId}`, {
      headers: { authorization: token },
    });
    expect(resDelete.status()).toBe(200);
    expect((await resDelete.json()).message).toBe('Registro excluído com sucesso');
  });

});
