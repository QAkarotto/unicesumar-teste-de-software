import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const perfil = __ENV.PERFIL || 'inicial';

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseUrl)) {
  throw new Error('BASE_URL deve apontar para uma API local.');
}

if (!['inicial', 'progressivo'].includes(perfil)) {
  throw new Error('PERFIL deve ser inicial ou progressivo.');
}

http.setResponseCallback(http.expectedStatuses(200));

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)'],
  ...(perfil === 'inicial'
    ? { vus: 1, duration: '30s' }
    : {
        vus: 1,
        stages: [
          { duration: '10s', target: 1 },
          { duration: '20s', target: 5 },
          { duration: '20s', target: 10 },
          { duration: '10s', target: 10 },
          { duration: '10s', target: 5 },
          { duration: '10s', target: 0 },
        ],
      }),
};

export default function () {
  const produtos = http.get(`${baseUrl}/produtos`, { timeout: '5s', redirects: 0 });
  check(produtos, { 'GET /produtos retorna 200': (r) => r.status === 200 });
  sleep(1);

  const usuarios = http.get(`${baseUrl}/usuarios`, { timeout: '5s', redirects: 0 });
  check(usuarios, { 'GET /usuarios retorna 200': (r) => r.status === 200 });
  sleep(1);
}
