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
    stages: [
        {duration: '10s', target: 1},
        {duration: '10s', target: 5},
        {duration: '10s', target: 10}
    ],
    thresholds: {
        'http_req_failed': ['rate<0.01'],
        'http_req_duration': ['p(95)<10']
    }
}
