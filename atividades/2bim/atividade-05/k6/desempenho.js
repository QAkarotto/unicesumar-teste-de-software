
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = (
    __ENV.BASE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

const CENARIO = __ENV.CENARIO || 'carga-inicial';

if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE_URL)) {
    throw new Error(
        'Utilize somente uma URL local, como http://localhost:3000'
    );
}

if (!['carga-inicial', 'carga-progressiva'].includes(CENARIO)) {
    throw new Error(
        'Cenário inválido. Utilize carga-inicial ou carga-progressiva.'
    );
}

export const options = {
    scenarios: CENARIO === 'carga-inicial'
        ? {
            carga_inicial: {
                executor: 'constant-vus',
                vus: 1,
                duration: '30s',
            },
        }
        : {
            carga_progressiva: {
                executor: 'ramping-vus',
                startVUs: 1,
                stages: [
                    { duration: '10s', target: 1 },
                    { duration: '10s', target: 5 },
                    { duration: '20s', target: 5 },
                    { duration: '10s', target: 10 },
                    { duration: '20s', target: 10 },
                    { duration: '10s', target: 5 },
                    { duration: '10s', target: 0 },
                ],
            },
        },

    
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
    },
};


export default function () {

   
    const produtos = http.get(`${BASE_URL}/produtos`);

    check(produtos, {
        'GET /produtos retorna status 200': (r) => r.status === 200,
    });

    const usuarios = http.get(`${BASE_URL}/usuarios`);

    check(usuarios, {
        'GET /usuarios retorna status 200': (r) => r.status === 200,
    });

    sleep(1);
}
