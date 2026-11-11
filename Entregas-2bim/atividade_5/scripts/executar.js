/**
 * Executa os cenários k6 e salva a evidência em evidencias/:
 *   - cenarioN-execucao.txt   saída completa do k6 no terminal
 *   - cenarioN-resumo.json    métricas agregadas do fim do teste (--summary-export)
 *   - cenarioN-dashboard.html relatório HTML com gráficos (web dashboard do k6)
 * e, no final, gera evidencias/comparativo.md com a tabela comparativa.
 *
 * Uso:  node scripts/executar.js [1 | 2 | todos]      (padrão: todos)
 * URL:  defina BASE_URL para usar outra instância local (padrão: http://localhost:3000)
 */
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { gerarComparativo } = require('./comparar');

const raiz = path.join(__dirname, '..');
const evidencias = path.join(raiz, 'evidencias');
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const CENARIOS = {
  1: { script: 'k6/cenario1-carga-inicial.js', nome: 'Cenário 1 — Carga inicial' },
  2: { script: 'k6/cenario2-carga-progressiva.js', nome: 'Cenário 2 — Carga progressiva' },
};

async function main() {
  const escolha = process.argv[2] || 'todos';
  const ids = escolha === 'todos' ? ['1', '2'] : [escolha];
  if (!ids.every((id) => CENARIOS[id])) {
    console.error('Uso: node scripts/executar.js [1 | 2 | todos]');
    process.exit(2);
  }

  if (/serverest\.dev/i.test(BASE_URL)) {
    console.error('Testes de desempenho só podem rodar no ServeRest local (ex.: http://localhost:3000).');
    process.exit(2);
  }
  await verificarApi();
  const versaoK6 = verificarK6();
  fs.mkdirSync(evidencias, { recursive: true });

  let falhou = false;
  for (const id of ids) {
    const codigo = await executarCenario(id, versaoK6);
    if (codigo !== 0) falhou = true;
  }

  const arquivo = await gerarComparativo({ pasta: evidencias, baseUrl: BASE_URL, versaoK6 });
  console.log(`\nEvidências salvas em ${path.relative(process.cwd(), evidencias) || evidencias}`);
  console.log(`Comparativo: ${path.relative(process.cwd(), arquivo)}`);
  if (falhou) console.log('Atenção: algum threshold não foi atendido (k6 terminou com código diferente de 0).');
  process.exit(falhou ? 1 : 0);
}

async function verificarApi() {
  try {
    const resposta = await fetch(`${BASE_URL}/produtos`, { signal: AbortSignal.timeout(5000) });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  } catch (erro) {
    console.error(`O ServeRest não respondeu em ${BASE_URL} (${erro.message}).`);
    console.error('Suba a API local em outro terminal com:  npx serverest@latest');
    process.exit(2);
  }
}

function verificarK6() {
  const resultado = spawnSync('k6 version', { shell: true, encoding: 'utf8' });
  if (resultado.status !== 0) {
    console.error('k6 não encontrado. Instale pelo guia do README (ex.: winget install k6 --source winget).');
    process.exit(2);
  }
  return resultado.stdout.trim();
}

function executarCenario(id, versaoK6) {
  const { script, nome } = CENARIOS[id];
  const prefixo = path.join(evidencias, `cenario${id}`);
  const relativo = (arquivo) => path.relative(raiz, arquivo).split(path.sep).join('/');

  const args = [
    'run',
    '--no-color',
    '--summary-trend-stats', '"avg,min,med,max,p(90),p(95),p(99)"',
    '--summary-export', `"${relativo(`${prefixo}-resumo.json`)}"`,
    '-e', `BASE_URL=${BASE_URL}`,
    script,
  ];

  const cabecalho = [
    `${nome}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    `API: ${BASE_URL}`,
    `k6: ${versaoK6}`,
    `Comando: k6 ${args.join(' ')}`,
    '',
    '',
  ].join('\n');

  console.log(`\n=== ${nome} (${script}) ===\n`);
  const saida = fs.createWriteStream(`${prefixo}-execucao.txt`);
  saida.write(cabecalho);

  return new Promise((resolve) => {
    // Comando montado como texto (shell: true) para achar o k6 pelo PATH também no Windows.
    const k6 = spawn(`k6 ${args.join(' ')}`, {
      cwd: raiz,
      shell: true,
      env: {
        ...process.env,
        K6_WEB_DASHBOARD: 'true',
        K6_WEB_DASHBOARD_PORT: '-1', // não abre servidor; só exporta o relatório no fim
        K6_WEB_DASHBOARD_EXPORT: relativo(`${prefixo}-dashboard.html`),
      },
    });
    for (const fluxo of [k6.stdout, k6.stderr]) {
      fluxo.on('data', (pedaco) => {
        process.stdout.write(pedaco);
        saida.write(pedaco);
      });
    }
    k6.on('close', (codigo) => saida.end(() => resolve(codigo ?? 1)));
  });
}

main();
