import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '20s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'avg<100'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const resProdutos = http.get(`${BASE_URL}/produtos`);
  check(resProdutos, {
    'GET /produtos - status 200': (r) => r.status === 200,
    'GET /produtos - tempo < 200ms': (r) => r.timings.duration < 200,
  });

  const resUsuarios = http.get(`${BASE_URL}/usuarios`);
  check(resUsuarios, {
    'GET /usuarios - status 200': (r) => r.status === 200,
    'GET /usuarios - tempo < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}