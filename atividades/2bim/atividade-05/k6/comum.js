import http from 'k6/http';
import { check, sleep } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Trava de segurança: o ServeRest pede que testes de carga rodem só localmente
if (BASE_URL.includes('serverest.dev')) {
  throw new Error('Teste de carga não deve rodar contra serverest.dev. Use ambiente local.');
}

export const thresholds = {
  http_req_duration: ['p(95)<500'],
  'http_req_duration{name:produtos}': ['p(95)<500'],
  'http_req_duration{name:usuarios}': ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate==1'],
};

export function consultar() {
  const produtos = http.get(`${BASE_URL}/produtos`, { tags: { name: 'produtos' } });
  check(produtos, {
    'GET /produtos retorna 200': (r) => r.status === 200,
    'GET /produtos traz lista': (r) => Array.isArray(r.json('produtos')),
  });

  const usuarios = http.get(`${BASE_URL}/usuarios`, { tags: { name: 'usuarios' } });
  check(usuarios, {
    'GET /usuarios retorna 200': (r) => r.status === 200,
    'GET /usuarios traz lista': (r) => Array.isArray(r.json('usuarios')),
  });

  sleep(1);
}
