import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1.0'],
  },
};

export default function () {
  const resProdutos = http.get(`${BASE_URL}/produtos`);
  check(resProdutos, {
    'GET /produtos - status 200': (r) => r.status === 200,
    'GET /produtos - possui lista': (r) => r.json('produtos') !== undefined,
  });

  const resUsuarios = http.get(`${BASE_URL}/usuarios`);
  check(resUsuarios, {
    'GET /usuarios - status 200': (r) => r.status === 200,
    'GET /usuarios - possui lista': (r) => r.json('usuarios') !== undefined,
  });

  sleep(1);
}