/**
 * Monta evidencias/comparativo.md a partir dos arquivos gerados por scripts/executar.js
 * (cenarioN-resumo.json e cenarioN-execucao.txt).
 *
 * Uso direto:  node scripts/comparar.js
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CENARIOS = [
  { id: 1, titulo: 'Cenário 1 — Carga inicial' },
  { id: 2, titulo: 'Cenário 2 — Carga progressiva' },
];

const ms = (v) => (v === undefined ? '—' : `${v.toFixed(2)} ms`);
const pct = (v) => (v === undefined ? '—' : `${(v * 100).toFixed(2)}%`);
const num = (v, casas = 0) => (v === undefined ? '—' : v.toFixed(casas));

function lerCenario(pasta, id) {
  const arquivoJson = path.join(pasta, `cenario${id}-resumo.json`);
  if (!fs.existsSync(arquivoJson)) return null;
  const { metrics } = JSON.parse(fs.readFileSync(arquivoJson, 'utf8'));

  // Duração real da execução: última linha "running (...)" da saída do k6.
  let duracao;
  const arquivoTxt = path.join(pasta, `cenario${id}-execucao.txt`);
  if (fs.existsSync(arquivoTxt)) {
    const linhas = [...fs.readFileSync(arquivoTxt, 'utf8').matchAll(/running \((?:(\d+)m)?([\d.]+)s\)/g)];
    const ultima = linhas[linhas.length - 1];
    if (ultima) duracao = Number(ultima[1] || 0) * 60 + Number(ultima[2]);
  }

  // No summary-export, cada threshold vale `true` quando FALHOU e `false` quando passou.
  const thresholds = [];
  for (const [metrica, dados] of Object.entries(metrics)) {
    for (const [expressao, falhou] of Object.entries(dados.thresholds || {})) {
      thresholds.push({ metrica, expressao, passou: !falhou, valor: valorDoThreshold(dados, expressao) });
    }
  }

  return { metrics, duracao, thresholds };
}

function valorDoThreshold(dados, expressao) {
  const estatistica = expressao.split(/[<>=!]/)[0].trim();
  if (estatistica === 'rate') return pct(dados.value);
  return ms(dados[estatistica]);
}

function linhaMetricas(r) {
  const m = r.metrics;
  const d = m.http_req_duration || {};
  const prod = m['http_req_duration{endpoint:produtos}'] || {};
  const usu = m['http_req_duration{endpoint:usuarios}'] || {};
  const checks = m.checks || {};
  const totalChecks = (checks.passes || 0) + (checks.fails || 0);
  return {
    'Usuários virtuais (máximo)': num(m.vus_max?.max ?? m.vus_max?.value),
    'Duração da execução': r.duracao === undefined ? '—' : `${r.duracao.toFixed(1)} s`,
    'Iterações': num(m.iterations?.count),
    'Total de requisições': num(m.http_reqs?.count),
    'Requisições por segundo': num(m.http_reqs?.rate, 2),
    'Tempo médio de resposta': ms(d.avg),
    'Mediana': ms(d.med),
    'p90': ms(d['p(90)']),
    'p95': ms(d['p(95)']),
    'p99': ms(d['p(99)']),
    'Máximo': ms(d.max),
    'Tempo médio — GET /produtos': ms(prod.avg),
    'p95 — GET /produtos': ms(prod['p(95)']),
    'Tempo médio — GET /usuarios': ms(usu.avg),
    'p95 — GET /usuarios': ms(usu['p(95)']),
    'Taxa de falhas (http_req_failed)': pct(m.http_req_failed?.value),
    'Checks aprovados': totalChecks ? `${pct(checks.value)} (${checks.passes} de ${totalChecks})` : '—',
    'Thresholds atendidos': `${r.thresholds.filter((t) => t.passou).length} de ${r.thresholds.length}`,
  };
}

async function versaoServeRest(baseUrl) {
  try {
    const resposta = await fetch(`${baseUrl}/version`, { signal: AbortSignal.timeout(3000) });
    return (await resposta.json()).version;
  } catch (_) {
    return undefined;
  }
}

async function gerarComparativo({ pasta, baseUrl = process.env.BASE_URL || 'http://localhost:3000', versaoK6 } = {}) {
  pasta = pasta || path.join(__dirname, '..', 'evidencias');
  const resultados = CENARIOS.map((c) => ({ ...c, r: lerCenario(pasta, c.id) })).filter((c) => c.r);
  if (resultados.length === 0) throw new Error('Nenhum cenarioN-resumo.json encontrado em evidencias/.');

  const linhas = resultados.map((c) => linhaMetricas(c.r));
  const nomes = Object.keys(linhas[0]);
  const serverest = await versaoServeRest(baseUrl);
  const cpu = os.cpus()[0]?.model?.trim() || 'desconhecida';

  const md = [
    '# Comparativo dos cenários',
    '',
    `Gerado em ${new Date().toLocaleString('pt-BR')} por \`scripts/comparar.js\` a partir de \`cenarioN-resumo.json\`.`,
    '',
    '**Ambiente de execução**',
    '',
    `- API: ${baseUrl}${serverest ? ` (ServeRest ${serverest})` : ''}`,
    `- k6: ${(versaoK6 || '').split('\n')[0] || 'ver cenarioN-execucao.txt'}`,
    `- Máquina: ${os.type()} ${os.release()} · ${cpu} · ${os.cpus().length} núcleos lógicos · ${(os.totalmem() / 1024 ** 3).toFixed(1)} GB de RAM`,
    '- k6 e ServeRest rodando na mesma máquina',
    '',
    '## Métricas',
    '',
    `| Métrica | ${resultados.map((c) => c.titulo).join(' | ')} |`,
    `| --- | ${resultados.map(() => '---:').join(' | ')} |`,
    ...nomes.map((n) => `| ${n} | ${linhas.map((l) => l[n]).join(' | ')} |`),
    '',
    '## Thresholds',
    '',
    `| Métrica | Critério | ${resultados.map((c) => c.titulo).join(' | ')} |`,
    `| --- | --- | ${resultados.map(() => '---').join(' | ')} |`,
    ...resultados[0].r.thresholds.map((t) => {
      const celulas = resultados.map((c) => {
        const x = c.r.thresholds.find((y) => y.metrica === t.metrica && y.expressao === t.expressao);
        return x ? `${x.passou ? '✅' : '❌'} ${x.valor}` : '—';
      });
      return `| \`${t.metrica}\` | \`${t.expressao}\` | ${celulas.join(' | ')} |`;
    }),
    '',
  ].join('\n');

  const arquivo = path.join(pasta, 'comparativo.md');
  fs.writeFileSync(arquivo, md);
  return arquivo;
}

module.exports = { gerarComparativo };

if (require.main === module) {
  gerarComparativo().then((arquivo) => console.log(`Comparativo gerado em ${arquivo}`));
}
