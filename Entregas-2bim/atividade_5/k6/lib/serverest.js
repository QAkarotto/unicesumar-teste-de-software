import http from 'k6/http';
import { check } from 'k6';

/**
 * Configuração e requisições compartilhadas pelos dois cenários.
 * A lógica dos testes não muda com o ambiente: a URL da API vem da variável BASE_URL.
 *
 *   k6 run -e BASE_URL=http://localhost:3000 k6/cenario1-carga-inicial.js
 */
export const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

// A documentação do ServeRest proíbe teste de carga contra o ambiente público.
if (/serverest\.dev/i.test(BASE_URL)) {
  throw new Error(
    `BASE_URL=${BASE_URL} aponta para o ServeRest público. ` +
      'Testes de desempenho devem rodar apenas em ambiente local (ex.: http://localhost:3000).',
  );
}

/**
 * Critérios de desempenho (justificados no RELATORIO.md). São os MESMOS nos dois cenários,
 * para que a comparação mostre o efeito da carga e não de critérios diferentes.
 */
export const THRESHOLDS = {
  // Nenhuma listagem pública deveria falhar; até 1% de tolerância para ruído do ambiente.
  http_req_failed: ['rate<0.01'],
  // 95% das respostas em até 300 ms e média abaixo de 150 ms, no geral e em cada endpoint.
  http_req_duration: ['p(95)<300', 'avg<150'],
  'http_req_duration{endpoint:produtos}': ['p(95)<300'],
  'http_req_duration{endpoint:usuarios}': ['p(95)<300'],
  // Pelo menos 99% das verificações de resposta devem passar.
  checks: ['rate>0.99'],
};

/**
 * GET /<recurso> com as verificações da resposta. O ServeRest responde as listagens no formato
 * { "quantidade": N, "<recurso>": [ ... ] }.
 */
export function listar(recurso) {
  const res = http.get(`${BASE_URL}/${recurso}`, {
    tags: { endpoint: recurso },
    headers: { Accept: 'application/json' },
  });

  const corpo = lerJson(res);
  check(
    res,
    {
      [`GET /${recurso}: status 200`]: (r) => r.status === 200,
      [`GET /${recurso}: corpo com a lista de ${recurso}`]: () => !!corpo && Array.isArray(corpo[recurso]),
      [`GET /${recurso}: quantidade igual ao total da lista`]: () =>
        !!corpo && Array.isArray(corpo[recurso]) && corpo.quantidade === corpo[recurso].length,
    },
    { endpoint: recurso },
  );

  return res;
}

function lerJson(res) {
  try {
    return res.json();
  } catch (_) {
    return null;
  }
}
