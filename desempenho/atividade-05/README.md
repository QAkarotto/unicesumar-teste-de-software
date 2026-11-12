# Atividade 05 — 2º bimestre: desempenho com k6 no ServeRest

- [Respostas da pesquisa](pesquisa.md)
- [Relatório comparativo e conclusão técnica](relatorio.md)
- [Evidências das execuções locais](evidencias/)
- Scripts: [carga inicial](scripts/cenario-1.js), [carga progressiva](scripts/cenario-2.js) e [lógica compartilhada](scripts/comum.js)

## Preparação do ServeRest

Utilize Node.js 22 ou superior e npm para a versão 3.2.2 usada nesta entrega. Em um terminal, inicie a instância local:

```bash
npx --yes serverest@3.2.2 --nodoc
```

O comando proposto na atividade, `npx serverest@latest`, também instala e inicia o servidor. Fixar a versão facilita reproduzir a execução. `--nodoc` apenas evita abrir automaticamente o navegador.

Alternativa com Docker (não execute as duas opções ao mesmo tempo na porta 3000):

```bash
docker run --rm -p 127.0.0.1:3000:3000 paulogoncalvesbh/serverest:3.2.2
```

Abra `http://localhost:3000` para consultar a documentação e `http://localhost:3000/status` para visualizar CPU, memória, tempo de resposta e RPS. Confirme o HTTP 200 das páginas:

```bash
curl --noproxy '*' -i http://localhost:3000/
curl --noproxy '*' -i http://localhost:3000/status
```

Os testes são exclusivos para a instância local, conforme a [regra oficial do ServeRest](https://github.com/ServeRest/ServeRest#teste-de-carga). A configuração aceita somente `http://localhost`, `http://127.0.0.1` ou `http://[::1]`, com porta opcional, e não segue redirecionamentos.

## Instalação do k6

O k6 é um executável próprio; os scripts JavaScript desta atividade são executados com `k6 run`. Não é necessário instalar as dependências Playwright do repositório.

Uma opção sem instalar pacotes no sistema é baixar o arquivo da sua plataforma nas [releases oficiais](https://github.com/grafana/k6/releases), extrair o binário e adicioná-lo ao `PATH`. A execução registrada usou **k6 v2.4.0**, Linux amd64:

```bash
mkdir -p /tmp/k6-atividade05
curl -fL https://github.com/grafana/k6/releases/download/v2.4.0/k6-v2.4.0-linux-amd64.tar.gz -o /tmp/k6-atividade05/k6.tar.gz
tar -xzf /tmp/k6-atividade05/k6.tar.gz -C /tmp/k6-atividade05
export PATH="/tmp/k6-atividade05/k6-v2.4.0-linux-amd64:$PATH"
k6 version
```

No Windows, a documentação também fornece `winget install k6 --source winget`; no macOS, `brew install k6`. Para instalação via gerenciador de pacotes Linux, siga a [documentação oficial de instalação](https://grafana.com/docs/k6/latest/set-up/install-k6/).

## Execução dos dois cenários e geração de evidências

Mantenha o ServeRest em execução no primeiro terminal. No segundo, a partir da raiz do repositório, execute o coletor em Bash/Linux (também funciona no WSL):

```bash
bash desempenho/atividade-05/executar.sh
```

O coletor roda os dois cenários sequencialmente e cria uma pasta com data e hora em `desempenho/atividade-05/resultados/`. Salva informações do ambiente, respostas HTML e cabeçalhos da documentação e do painel `/status`, além de logs, resumos JSON e códigos de saída de cada cenário. O código final é diferente de zero se qualquer cenário falhar. Novas execuções ficam separadas das evidências entregues.

Se o k6 estiver fora do `PATH`, indique seu caminho em `K6_BIN`. A URL pode ser alterada por variável de ambiente, sem editar os scripts:

```bash
BASE_URL=http://127.0.0.1:3000 bash desempenho/atividade-05/executar.sh
```

Para executar individualmente (comandos a partir da raiz do repositório):

```bash
mkdir -p desempenho/atividade-05/resultados/manual
k6 run --no-usage-report -e BASE_URL=http://localhost:3000 -e SUMMARY_PATH=desempenho/atividade-05/resultados/manual/cenario-1.json desempenho/atividade-05/scripts/cenario-1.js
k6 run --no-usage-report -e BASE_URL=http://localhost:3000 -e SUMMARY_PATH=desempenho/atividade-05/resultados/manual/cenario-2.json desempenho/atividade-05/scripts/cenario-2.js
```

`BASE_URL` assume `http://localhost:3000` se omitida. `SUMMARY_PATH` determina o destino do JSON; sem ela o arquivo será `resumo.json` no diretório atual. A pasta de destino precisa existir. Os scripts não importam bibliotecas externas pela internet.

## Perfis e verificações

Cada iteração realiza `http.get()` em `/produtos`, espera 1 segundo, consulta `/usuarios` e espera mais 1 segundo. Cada resposta tem dois checks: HTTP 200 e JSON com lista e `quantidade` consistentes. Somente HTTP 200 é considerado sucesso também na métrica `http_req_failed`.

| Cenário | Configuração |
| --- | --- |
| 1 — Carga inicial | `constant-vus`, 1 VU por 30 segundos. |
| 2 — Carga progressiva | `ramping-vus`, início em 1 VU, cinco stages de 15 segundos: 5, 10, 10, 5 e 0 VUs. Total programado: 75 segundos. |

Os tempos são programados; há tolerância de até 5 segundos para finalizar iterações em andamento no encerramento e nas reduções de VUs. A duração efetiva consta no JSON e no relatório. As pausas limitam a emissão a aproximadamente 1 requisição por segundo por VU quando as respostas são rápidas; os 10 VUs representam um pico aproximado de 10 req/s, sem buscar saturação.

Os dois cenários usam os mesmos critérios: média menor que 300 ms, p95 menor que 500 ms, falhas HTTP menores que 1% e 100% dos checks aprovados. Há também critérios de p95 e falhas por endpoint. As justificativas estão no [relatório](relatorio.md). A opção `stages` usada dentro do cenário é descrita na [documentação do executor ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).

## Entrega por Pull Request

O PR deve incluir esta pasta inteira: pesquisa, scripts, instruções, evidências e relatório. Antes de enviá-lo, revise as conclusões e os resultados registrados. A descrição pode apontar para `desempenho/atividade-05/README.md` e destacar as métricas comparativas e a execução exclusivamente local.
