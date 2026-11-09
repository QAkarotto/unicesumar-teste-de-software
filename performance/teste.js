import http from 'k6/http';
import { check } from 'k6';

export default function (){
    const produtosGet = http.get('http://localhost:3000/produtos')
    check(produtosGet,{
        'produtos status 200': (r) => r.status === 200,
    });

    const usuariosGet = http.get('http://localhost:3000/usuarios')
    check(usuariosGet,{
        'usuarios status 200': (r) => r.status === 200,
    });
}


export const options = {
    vus: 1,
    duration: '30s',
    thresholds: {
        'http_req_failed': ['rate<0.01'],
        'http_req_duration': ['p(95)<3']
    }
}
