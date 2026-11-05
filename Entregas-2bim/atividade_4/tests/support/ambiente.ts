/**
 * Endereços da aplicação testada. Ficam SOMENTE aqui: o playwright.config.ts usa a URL do front
 * como baseURL e as fixtures usam a URL da API para preparar dados e fazer a limpeza.
 *
 * O front público (front.serverest.dev) sempre conversa com a API pública (serverest.dev).
 * Se apontar o front para outra instância, aponte a API para a instância que esse front usa.
 */
export const WEB_URL = process.env.SERVEREST_WEB_URL ?? 'https://front.serverest.dev';
export const API_URL = process.env.SERVEREST_API_URL ?? 'https://serverest.dev';
