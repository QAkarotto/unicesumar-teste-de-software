import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE_URL)) {
  throw new Error(
    'Por segurança, este teste aceita somente http://localhost ou http://127.0.0.1. ' +
    'Execute a carga apenas na instância local do ServeRest.'
  );
}

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const produtos = http.get(`${BASE_URL}/produtos`, {
    tags: { endpoint: 'GET /produtos' },
  });

  check(produtos, {
    'GET /produtos retorna HTTP 200': (response) => response.status === 200,
  });

  const usuarios = http.get(`${BASE_URL}/usuarios`, {
    tags: { endpoint: 'GET /usuarios' },
  });

  check(usuarios, {
    'GET /usuarios retorna HTTP 200': (response) => response.status === 200,
  });

  // Pausa para manter o volume de requisições controlado.
  sleep(1);
}
