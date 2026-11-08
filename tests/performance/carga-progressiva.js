
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '15s', target: 1 },
    { duration: '15s', target: 5 },
    { duration: '15s', target: 10 },
    { duration: '15s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const produtos = http.get(`${BASE_URL}/produtos`);

  check(produtos, {
    'Produtos: status HTTP 200': (r) => r.status === 200,
  });

  const usuarios = http.get(`${BASE_URL}/usuarios`);

  check(usuarios, {
    'Usuários: status HTTP 200': (r) => r.status === 200,
  });

  sleep(1);
}
