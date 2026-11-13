// Partes comuns aos dois cenários: URL da API, critérios de desempenho e a iteração de um usuário virtual.
import http from 'k6/http';
import { check, sleep } from 'k6';

// A URL vem de variável de ambiente (k6 run -e BASE_URL=...), para que trocar o alvo não exija mexer na lógica dos testes.
export const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

// A documentação do ServeRest só autoriza teste de carga contra a instância local; a pública é compartilhada por quem estuda com ela.
if (/serverest\.dev/i.test(BASE_URL)) {
  throw new Error(`BASE_URL aponta para ${BASE_URL}; rode o ServeRest localmente (npx serverest@latest) e use http://localhost:3000.`);
}

// Pausa de um usuário entre uma consulta e a próxima; também limita cada VU a cerca de 2 requisições por segundo.
const PAUSA_EM_SEGUNDOS = 1;

// Os critérios são os mesmos nos dois cenários, para que a comparação mostre o efeito da carga e não de critérios diferentes. A justificativa de cada valor está em docs/relatorio.md.
export const criterios = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<200', 'p(99)<500'],
  'http_req_duration{endpoint:produtos}': ['p(95)<200'],
  'http_req_duration{endpoint:usuarios}': ['p(95)<200'],
  checks: ['rate>0.99'],
};

// Inclui p(99) no resumo, já que há um threshold sobre ele.
export const estatisticasDoResumo = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

function listaConfereComQuantidade(resposta, campo) {
  try {
    const corpo = resposta.json();
    return Array.isArray(corpo[campo]) && corpo.quantidade === corpo[campo].length;
  } catch (erro) {
    return false;
  }
}

function consultar(recurso) {
  const resposta = http.get(`${BASE_URL}/${recurso}`, { tags: { endpoint: recurso } });
  check(resposta, {
    [`GET /${recurso} responde 200`]: (r) => r.status === 200,
    [`GET /${recurso} traz a lista com a quantidade informada`]: (r) => listaConfereComQuantidade(r, recurso),
  });
}

export function consultarProdutosEUsuarios() {
  consultar('produtos');
  consultar('usuarios');
  sleep(PAUSA_EM_SEGUNDOS);
}
