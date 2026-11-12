import http from 'k6/http';
import { check, sleep } from 'k6';

// Permite configurar a URL sem alterar a lógica (ex: k6 run -e BASE_URL=http://localhost:3000 load-test.js)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    // Cenário 1: Carga inicial (1 VU por 30 segundos)
    carga_inicial: {
      executor: 'constant-vus',
      exec: 'cenarioGetEndpoints',
      vus: 1,
      duration: '30s',
      startTime: '0s',
    },
    // Cenário 2: Carga progressiva utilizando stages
    carga_progressiva: {
      executor: 'ramping-vus',
      exec: 'cenarioGetEndpoints',
      startTime: '35s', // Executa após o término do Cenário 1
      stages: [
        { duration: '10s', target: 1 },  // Início com 1 VU
        { duration: '20s', target: 5 },  // Crescimento para 5 VUs
        { duration: '20s', target: 10 }, // Crescimento até 10 VUs
        { duration: '10s', target: 0 },  // Redução gradual até 0 VU
      ],
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<200'], // 95% das requisições devem responder em menos de 200ms
    'http_req_failed': ['rate<0.01'],    // Taxa de falhas deve ser inferior a 1%
  },
};

export function cenarioGetEndpoints() {
  // Requisição GET /produtos
  let resProdutos = http.get(`${BASE_URL}/produtos`);
  check(resProdutos, {
    'status produtos é 200': (r) => r.status === 200,
    'produtos respondem rápido': (r) => r.timings.duration < 150,
  });

  sleep(0.5);

  // Requisição GET /usuarios
  let resUsuarios = http.get(`${BASE_URL}/usuarios`);
  check(resUsuarios, {
    'status usuarios é 200': (r) => r.status === 200,
    'usuarios respondem rápido': (r) => r.timings.duration < 150,
  });

  sleep(0.5);
}