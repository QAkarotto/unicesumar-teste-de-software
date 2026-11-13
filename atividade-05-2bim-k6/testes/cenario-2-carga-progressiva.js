// Cenário 2 — carga progressiva: de 1 a 5 VUs, depois a 10 VUs, e redução gradual até zero.
import exec from 'k6/execution';
import { consultarProdutosEUsuarios, criterios, estatisticasDoResumo } from './comum.js';

// Cada fase vira um stage do executor e também uma tag nas métricas, para que o resumo mostre o tempo de resposta em cada patamar de carga e não só a média da execução inteira.
const FASES = [
  { nome: 'subida-1-a-5', duracao: 30, alvo: 5 },
  { nome: 'patamar-5', duracao: 30, alvo: 5 },
  { nome: 'subida-5-a-10', duracao: 30, alvo: 10 },
  { nome: 'patamar-10', duracao: 60, alvo: 10 },
  { nome: 'descida-10-a-5', duracao: 30, alvo: 5 },
  { nome: 'descida-5-a-0', duracao: 30, alvo: 0 },
];

export const options = {
  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: FASES.map((fase) => ({ duration: `${fase.duracao}s`, target: fase.alvo })),
    },
  },
  thresholds: {
    ...criterios,
    'http_req_duration{fase:patamar-5}': ['p(95)<200'],
    'http_req_duration{fase:patamar-10}': ['p(95)<200'],
  },
  summaryTrendStats: estatisticasDoResumo,
};

function faseAtual() {
  const decorrido = (Date.now() - exec.scenario.startTime) / 1000;
  let fim = 0;
  for (const fase of FASES) {
    fim += fase.duracao;
    if (decorrido < fim) return fase.nome;
  }
  return FASES[FASES.length - 1].nome;
}

export default function () {
  exec.vu.metrics.tags.fase = faseAtual();
  consultarProdutosEUsuarios();
}
