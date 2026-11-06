import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

// Somente loopback; rejeita hosts externos antes de gerar qualquer requisição.
if (!/^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/.test(baseUrl)) {
  throw new Error('BASE_URL deve apontar para HTTP local: localhost, 127.0.0.1 ou [::1].');
}

// Falha HTTP significa qualquer resposta diferente do 200 esperado nestas rotas.
http.setResponseCallback(http.expectedStatuses(200));

export const thresholds = {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate==1'],
  'http_req_duration{endpoint:produtos}': ['p(95)<500'],
  'http_req_duration{endpoint:usuarios}': ['p(95)<500'],
};

export function consultarListagens() {
  for (const endpoint of ['produtos', 'usuarios']) {
    const resposta = http.get(`${baseUrl}/${endpoint}`, {
      tags: { endpoint },
      timeout: '5s',
      redirects: 0, // Impede que um redirecionamento leve a carga para outro host.
    });
    check(resposta, {
      [`GET /${endpoint}: status 200`]: (r) => r.status === 200,
      [`GET /${endpoint}: lista e quantidade validas`]: (r) => {
        try {
          const body = r.json();
          return Array.isArray(body[endpoint]) &&
            Number.isInteger(body.quantidade) &&
            body.quantidade === body[endpoint].length;
        } catch (_) {
          return false;
        }
      },
    });
  }
  sleep(1);
}
