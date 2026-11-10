export const BASE_URL = (
    __ENV.BASE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export const THRESHOLDS = {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
};
