import http from 'k6/http';
import { check, sleep } from 'k6';

export const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

// Permite apenas loopback para que um erro de configuração não gere carga remota.
if (!/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(BASE_URL)) {
  throw new Error('BASE_URL deve apontar apenas para localhost, 127.0.0.1 ou ::1.');
}

export function getAndCheck(path, endpoint) {
  const response = http.get(BASE_URL + path, {
    tags: { endpoint },
    timeout: '10s',
  });
  check(response, {
    [endpoint + ' responde HTTP 200']: (res) => res.status === 200,
  });
  return response;
}

export function runEndpoints() {
  getAndCheck('/produtos', 'GET /produtos');
  getAndCheck('/usuarios', 'GET /usuarios');
  sleep(1);
}
