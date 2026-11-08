
import http from 'k6/http';
import { check, sleep } from 'k6';

// Permite configurar a URL sem alterar a lógica dos testes.
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

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
// Teste do endpoint de produtos
const produtos = http.get(`${BASE_URL}/produtos`);

check(produtos, {
  'Produtos: status HTTP 200': (r) => r.status === 200,
});

// Teste do endpoint de usuários
const usuarios = http.get(`${BASE_URL}/usuarios`);

check(usuarios, {
  'Usuários: status HTTP 200': (r) => r.status === 200,
});

  // Pequena pausa para controlar o volume de requisições.
  sleep(1);
}
