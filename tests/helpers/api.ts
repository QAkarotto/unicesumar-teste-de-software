import { APIRequestContext } from '@playwright/test';
import { ItemCarrinho, Produto, Usuario } from '../data/factories';

export interface Credenciais {
  email: string;
  password: string;
}

/** Cabeçalho de autorização para rotas protegidas. */
export function autorizacao(token?: string): Record<string, string> {
  return token ? { Authorization: token } : {};
}

/**
 * Cliente da API do ServeRest. Centraliza os endpoints usados pela suíte,
 * sempre com caminhos relativos ao baseURL do playwright.config.ts.
 * Os métodos retornam a resposta crua para que cada teste faça suas verificações.
 */
export function criarClienteApi(request: APIRequestContext) {
  return {
    login: (credenciais: Partial<Credenciais>) => request.post('/login', { data: credenciais }),

    usuarios: {
      listar: () => request.get('/usuarios'),
      cadastrar: (usuario: Partial<Usuario>) => request.post('/usuarios', { data: usuario }),
      buscar: (id: string) => request.get(`/usuarios/${id}`),
      atualizar: (id: string, usuario: Usuario) => request.put(`/usuarios/${id}`, { data: usuario }),
      excluir: (id: string) => request.delete(`/usuarios/${id}`),
    },

    produtos: {
      cadastrar: (produto: Partial<Produto>, token?: string) =>
        request.post('/produtos', { data: produto, headers: autorizacao(token) }),
      buscar: (id: string) => request.get(`/produtos/${id}`),
      excluir: (id: string, token: string) =>
        request.delete(`/produtos/${id}`, { headers: autorizacao(token) }),
    },

    carrinhos: {
      cadastrar: (produtos: ItemCarrinho[], token: string) =>
        request.post('/carrinhos', { data: { produtos }, headers: autorizacao(token) }),
      buscar: (id: string) => request.get(`/carrinhos/${id}`),
      cancelarCompra: (token: string) =>
        request.delete('/carrinhos/cancelar-compra', { headers: autorizacao(token) }),
    },
  };
}

export type ClienteApi = ReturnType<typeof criarClienteApi>;
