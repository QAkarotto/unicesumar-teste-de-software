import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { produtoFactory, usuarioFactory, type Produto, type Usuario } from '../data/factories';

export type AuthHeaders = { Authorization: string };
export type Cleanup = () => Promise<void>;

export function criarApi(request: APIRequestContext, registrarLimpeza: (cleanup: Cleanup) => void) {
  async function rastrear(response: APIResponse, remover: (id: string) => Promise<APIResponse>) {
    const body = await response.json();
    // Registra antes das verificações, inclusive se um cadastro negativo criar algo indevidamente.
    if (typeof body._id === 'string' && body._id.length > 0) {
      registrarLimpeza(async () => {
        const deletion = await remover(body._id);
        expect.soft(deletion.status(), `Limpeza do recurso ${body._id}`).toBe(200);
        expect.soft((await deletion.json()).message).toMatch(
          /^(Registro excluído com sucesso|Nenhum registro excluído|Não foi encontrado carrinho para esse usuário)/,
        );
      });
    }
    return response;
  }

  async function validarCadastro(response: APIResponse): Promise<string> {
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toEqual(expect.any(String));
    expect(body._id).not.toBe('');
    return body._id;
  }

  const api = {
    async cadastrarUsuario(data: Usuario) {
      return rastrear(await request.post('/usuarios', { data }),
        (id) => request.delete(`/usuarios/${id}`));
    },
    async criarUsuario(overrides: Partial<Usuario> = {}) {
      const data = usuarioFactory(overrides);
      const _id = await validarCadastro(await api.cadastrarUsuario(data));
      return { ...data, _id };
    },
    async cadastrarProduto(data: Produto, headers?: AuthHeaders, headersLimpeza = headers) {
      return rastrear(await request.post('/produtos', { data, headers }),
        (id) => request.delete(`/produtos/${id}`, { headers: headersLimpeza }));
    },
    async criarProduto(headers: AuthHeaders, overrides: Partial<Produto> = {}) {
      const data = produtoFactory(overrides);
      const _id = await validarCadastro(await api.cadastrarProduto(data, headers));
      return { ...data, _id };
    },
    async cadastrarCarrinho(headers: AuthHeaders, produtos: { idProduto: string; quantidade: number }[]) {
      return rastrear(await request.post('/carrinhos', { data: { produtos }, headers }),
        () => request.delete('/carrinhos/cancelar-compra', { headers }));
    },
  };
  return api;
}
