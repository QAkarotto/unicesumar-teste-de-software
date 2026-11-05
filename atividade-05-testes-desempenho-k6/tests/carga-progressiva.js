
import http from 'k6/http';
import { check, sleep } from 'k6';

const baseURL = __ENV.BASE_URL || 'http://localhost:3000';

if (!/^http:\/\/(localhost|127\.0\.0\.1):3000$/.test(baseURL)) {
  throw new Error('Utilize somente o ServeRest local.');
}

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
  },
};

export default function () {
  const produtos = http.get(`${baseURL}/produtos`);
  const usuarios = http.get(`${baseURL}/usuarios`);

  check(produtos, {
    'Produtos retornou 200': (r) => r.status === 200,
  });

  check(usuarios, {
    'Usuarios retornou 200': (r) => r.status === 200,
  });

  sleep(1);
}
