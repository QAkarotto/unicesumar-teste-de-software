import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ItemCarrinho, novoProduto, Produto, Usuario } from '../data/factories';
import { RegistroDeLimpeza } from './limpeza';

/** Monta o header de autorização; sem token, a requisição vai sem o header. */
export function autorizacao(token?: string): Record<string, string> {
  return token ? { Authorization: token } : {};
}

/**
 * Cliente da API do ServeRest.
 *
 * Reúne as requisições usadas pela suíte (sempre com caminhos relativos à
 * baseURL do playwright.config.ts) e registra para limpeza tudo o que for
 * criado com sucesso. Os métodos devolvem a resposta crua para que cada teste
 * faça as próprias verificações.
 */
export class ServeRestApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly limpeza: RegistroDeLimpeza,
  ) {}

  // ---------- Login ----------
  login(credenciais: { email: string; password: string }) {
    return this.request.post('/login', { data: credenciais });
  }

  // ---------- Usuários ----------
  async cadastrarUsuario(dados: Partial<Usuario> | Record<string, unknown>) {
    const response = await this.request.post('/usuarios', { data: dados });
    if (response.status() === 201) this.limpeza.registrarUsuario((await response.json())._id);
    return response;
  }

  buscarUsuario(id: string) {
    return this.request.get(`/usuarios/${id}`);
  }

  listarUsuarios(filtros: Record<string, string>) {
    return this.request.get('/usuarios', { params: filtros });
  }

  editarUsuario(id: string, dados: Usuario) {
    return this.request.put(`/usuarios/${id}`, { data: dados });
  }

  excluirUsuario(id: string) {
    return this.request.delete(`/usuarios/${id}`);
  }

  // ---------- Produtos ----------
  async cadastrarProduto(dados: Produto, token?: string) {
    const response = await this.request.post('/produtos', { data: dados, headers: autorizacao(token) });
    if (response.status() === 201 && token) this.limpeza.registrarProduto((await response.json())._id, token);
    return response;
  }

  buscarProduto(id: string) {
    return this.request.get(`/produtos/${id}`);
  }

  listarProdutos(filtros: Record<string, string>) {
    return this.request.get('/produtos', { params: filtros });
  }

  excluirProduto(id: string, token?: string) {
    return this.request.delete(`/produtos/${id}`, { headers: autorizacao(token) });
  }

  // ---------- Carrinhos ----------
  async cadastrarCarrinho(itens: { produtos: ItemCarrinho[] }, token: string) {
    const response = await this.request.post('/carrinhos', { data: itens, headers: autorizacao(token) });
    if (response.status() === 201) this.limpeza.registrarCarrinho(token);
    return response;
  }

  buscarCarrinho(id: string) {
    return this.request.get(`/carrinhos/${id}`);
  }

  concluirCompra(token: string) {
    return this.request.delete('/carrinhos/concluir-compra', { headers: autorizacao(token) });
  }

  cancelarCompra(token: string) {
    return this.request.delete('/carrinhos/cancelar-compra', { headers: autorizacao(token) });
  }
}

// ---------- Pré-condições reutilizáveis ----------

/** Cadastra um produto válido (pré-condição) e devolve os dados enviados + _id. */
export async function prepararProduto(
  api: ServeRestApi,
  tokenAdmin: string,
  overrides: Partial<Produto> = {},
): Promise<Produto & { _id: string }> {
  const produto = novoProduto(overrides);
  const response = await api.cadastrarProduto(produto, tokenAdmin);
  await esperarStatus(response, 201, 'pré-condição: cadastrar produto');
  return { ...produto, _id: (await response.json())._id };
}

/** Consulta a quantidade em estoque de um produto. */
export async function consultarEstoque(api: ServeRestApi, idProduto: string): Promise<number> {
  const response = await api.buscarProduto(idProduto);
  await esperarStatus(response, 200, 'consultar estoque do produto');
  return (await response.json()).quantidade;
}

/** Verifica o status e, se falhar, mostra o corpo da resposta na mensagem de erro. */
export async function esperarStatus(response: APIResponse, status: number, contexto: string) {
  expect(response.status(), `${contexto}: ${await response.text()}`).toBe(status);
}
