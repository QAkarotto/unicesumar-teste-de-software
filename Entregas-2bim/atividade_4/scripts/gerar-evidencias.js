/**
 * Executa a suíte E2E e salva a evidência em evidencias/:
 *   - execucao.txt   saída completa do terminal (reporter "list")
 *   - resumo.md      tabela com o resultado e a duração de cada teste
 *   - screenshots/   print do estado final da tela de cada teste (CT01.png, CT02.png, ...)
 *
 * Uso: npm run evidencias   (funciona em Windows, Linux e macOS)
 */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const pasta = path.join(raiz, 'evidencias');
const pastaPrints = path.join(pasta, 'screenshots');
fs.rmSync(pastaPrints, { recursive: true, force: true });
fs.mkdirSync(pastaPrints, { recursive: true });

const webUrl = process.env.SERVEREST_WEB_URL ?? 'https://front.serverest.dev';
const apiUrl = process.env.SERVEREST_API_URL ?? 'https://serverest.dev';
const inicio = new Date();

const execucao = spawnSync('npx', ['playwright', 'test', '--reporter=list,json,html'], {
  cwd: raiz,
  shell: true,
  encoding: 'utf8',
  env: { ...process.env, FORCE_COLOR: '0', PLAYWRIGHT_JSON_OUTPUT_NAME: 'test-results/resultados.json' },
});
const saida = `${execucao.stdout ?? ''}${execucao.stderr ?? ''}`;
process.stdout.write(saida);

const cabecalho = [
  `Execução: ${inicio.toLocaleString('pt-BR')}`,
  `Front: ${webUrl}`,
  `API:   ${apiUrl}`,
  `Node:  ${process.version}`,
  '',
].join('\n');
fs.writeFileSync(path.join(pasta, 'execucao.txt'), cabecalho + saida);

// Resumo e prints a partir do relatório JSON do Playwright.
const resultados = JSON.parse(fs.readFileSync(path.join(raiz, 'test-results', 'resultados.json'), 'utf8'));
const linhas = [];
const percorrer = (suite) => {
  (suite.suites ?? []).forEach(percorrer);
  for (const spec of suite.specs ?? []) {
    const teste = spec.tests[0];
    const ultimo = teste.results[teste.results.length - 1];
    const id = (spec.title.match(/CT\d+/) ?? [spec.title])[0];
    for (const anexo of ultimo.attachments ?? []) {
      if (anexo.contentType !== 'image/png') continue;
      const destino = path.join(pastaPrints, anexo.name === 'screenshot' ? `${id}-final.png` : `${id}-${anexo.name}.png`);
      // Prints automáticos vêm como arquivo (path); os anexados no teste vêm embutidos em base64 (body).
      if (anexo.path) fs.copyFileSync(anexo.path, destino);
      else if (anexo.body) fs.writeFileSync(destino, Buffer.from(anexo.body, 'base64'));
    }
    const status = teste.status === 'expected' ? 'passou' : teste.status === 'flaky' ? 'passou na nova tentativa' : 'FALHOU';
    linhas.push(`| ${id} | ${spec.file.replace(/^.*?cenario/, 'cenario')} | ${spec.title.replace(/^CT\d+ - /, '')} | ${status} | ${(ultimo.duration / 1000).toFixed(1)} s |`);
  }
};
resultados.suites.forEach(percorrer);

const { expected = 0, unexpected = 0, flaky = 0 } = resultados.stats;
fs.writeFileSync(
  path.join(pasta, 'resumo.md'),
  [
    '# Evidência de execução',
    '',
    cabecalho.replace(/\n/g, '  \n'),
    `**Resultado: ${expected + flaky} de ${expected + unexpected + flaky} testes passaram** (${unexpected} falha(s), ${flaky} instável(is)).`,
    '',
    '| ID | Arquivo | Teste | Resultado | Duração |',
    '| --- | --- | --- | --- | --- |',
    ...linhas,
    '',
    'Prints do estado final de cada teste em `screenshots/`. Saída completa do terminal em `execucao.txt`.',
    '',
  ].join('\n'),
);

console.log(`\nEvidência salva em ${path.relative(process.cwd(), pasta) || pasta}`);
process.exit(execucao.status ?? 1);
