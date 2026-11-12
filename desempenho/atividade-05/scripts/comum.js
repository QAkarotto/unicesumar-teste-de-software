import http from 'k6/http';
import { check, sleep } from 'k6';

export const baseURL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const endereco = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::([0-9]{1,5}))?$/.exec(baseURL);

// A atividade e o ServeRest autorizam carga somente na instância local.
if (!endereco || (endereco[2] && (Number(endereco[2]) < 1 || Number(endereco[2]) > 65535))) {
  throw new Error('BASE_URL deve apontar para HTTP local: localhost, 127.0.0.1 ou [::1], com porta opcional.');
}

export const opcoesComuns = {
  maxRedirects: 0,
  hosts: { localhost: '127.0.0.1' },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)'],
  thresholds: {
    http_req_duration: ['avg<300', 'p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate==1'],
    'http_req_duration{endpoint:produtos}': ['p(95)<500'],
    'http_req_duration{endpoint:usuarios}': ['p(95)<500'],
    'http_req_failed{endpoint:produtos}': ['rate<0.01'],
    'http_req_failed{endpoint:usuarios}': ['rate<0.01'],
  },
};

function consultar(endpoint) {
  const resposta = http.get(`${baseURL}/${endpoint}`, {
    timeout: '5s',
    redirects: 0,
    responseCallback: http.expectedStatuses(200),
    tags: { endpoint, name: `GET /${endpoint}` },
  });

  check(resposta, {
    [`GET /${endpoint}: status 200`]: (r) => r.status === 200,
    [`GET /${endpoint}: lista e quantidade consistentes`]: (r) => {
      try {
        const corpo = r.json();
        return Array.isArray(corpo[endpoint]) && corpo.quantidade === corpo[endpoint].length;
      } catch (_) {
        return false;
      }
    },
  });
}

export function executar() {
  consultar('produtos');
  sleep(1);
  consultar('usuarios');
  sleep(1);
}

export function salvarResumo(data) {
  const valores = (nome) => data.metrics[nome].values;
  const duracao = valores('http_req_duration');
  const requisicoes = valores('http_reqs');
  const checks = valores('checks');
  const linhas = [
    `API: ${baseURL}`,
    `Duração observada: ${(data.state.testRunDurationMs / 1000).toFixed(3)} s`,
    `Requisições: ${requisicoes.count} | Taxa: ${requisicoes.rate.toFixed(3)} req/s`,
    `Tempo médio: ${duracao.avg.toFixed(3)} ms | p95: ${duracao['p(95)'].toFixed(3)} ms`,
    `Falhas HTTP: ${(valores('http_req_failed').rate * 100).toFixed(2)}%`,
    `Checks: ${checks.passes} aprovados, ${checks.fails} reprovados`,
    '',
    'Verificações:',
  ];
  for (const verificacao of data.root_group.checks) {
    linhas.push(`  ${verificacao.name}: ${verificacao.passes} aprovados, ${verificacao.fails} reprovados`);
  }
  linhas.push('', 'Thresholds:');
  for (const [nome, metrica] of Object.entries(data.metrics)) {
    for (const [criterio, resultado] of Object.entries(metrica.thresholds || {})) {
      linhas.push(`  ${resultado.ok ? 'PASSOU' : 'FALHOU'} ${nome}: ${criterio}`);
    }
  }
  const resumo = {
    ...data,
    metadata: { baseURL, registradoEm: new Date().toISOString(), pausaPorRequisicaoSegundos: 1 },
  };
  return {
    stdout: `${linhas.join('\n')}\n`,
    [__ENV.SUMMARY_PATH || 'resumo.json']: `${JSON.stringify(resumo, null, 2)}\n`,
  };
}
