
import http from 'k6/http';
import { check, sleep } from 'k6';

import { BASE_URL, THRESHOLDS } from './config.js';

export const options = {
  thresholds: THRESHOLDS,

  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 1,

      stages: [
        { duration: '10s', target: 1 },
        { duration: '15s', target: 5 },
        { duration: '15s', target: 10 },
        { duration: '10s', target: 5 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};

export default function () {
  const produtos = http.get(`${BASE_URL}/produtos`, {
    tags: { endpoint: 'produtos' },
  });

  check(produtos, {
    'GET /produtos retorna status 200': (res) => res.status === 200,
  });

  const usuarios = http.get(`${BASE_URL}/usuarios`, {
    tags: { endpoint: 'usuarios' },
  });

  check(usuarios, {
    'GET /usuarios retorna status 200': (res) => res.status === 200,
  });

  sleep(1);
}
