# Testes de desempenho da API ServeRest com k6

**Alunos:** Eric Verschoor e Felipe da Silva Mattos — Atividade 05, 2º bimestre.

Testes de carga dos endpoints `GET /produtos` e `GET /usuarios` do [ServeRest](https://github.com/ServeRest/ServeRest), executados com o [k6](https://grafana.com/docs/k6/latest/) contra uma instância **local** da API, em dois perfis: carga inicial (1 VU por 30 s) e carga progressiva (1 → 5 → 10 VUs, com redução gradual).

| Entrega | Onde está |
| --- | --- |
| Respostas da pesquisa (Parte 1) | [docs/pesquisa-k6.md](docs/pesquisa-k6.md) |
| Scripts k6 (Parte 3) | [testes/](testes/) |
| Instruções de configuração e execução (Parte 2) | este arquivo |
| Evidências da execução dos dois cenários | [evidencias/](evidencias/) |
| Relatório comparativo e conclusão (Parte 4) | [docs/relatorio.md](docs/relatorio.md) |

## Estrutura

```text
testes/
  comum.js                        URL da API, thresholds e a iteração de um VU (GET /produtos + GET /usuarios + pausa de 1 s)
  cenario-1-carga-inicial.js      executor constant-vus: 1 VU por 30 s
  cenario-2-carga-progressiva.js  executor ramping-vus: stages 1 → 5 → 10 → 0 VUs em 3 min 30 s
evidencias/
  ambiente.txt                    versões, máquina e respostas de /produtos, /usuarios e /status antes dos testes
  serverest-status.png            página /status do ServeRest depois das duas execuções
  cenario-1/  cenario-2/          terminal.txt (saída do k6), resumo.json (resumo exportado), painel-k6.html (relatório gráfico do k6) e painel-k6.png (captura dele)
  repeticao/                      segunda execução de cada cenário, para medir a variação entre execuções
docs/
  pesquisa-k6.md                  Parte 1
  relatorio.md                    Parte 4
```

## 1. Subir o ServeRest localmente

A documentação do ServeRest determina que teste de carga rode **apenas em ambiente local**. Não execute estes scripts contra `https://serverest.dev`: o `testes/comum.js` interrompe a execução, antes de qualquer requisição, se a URL configurada apontar para lá.

Com Node.js (o que foi usado nas evidências):

```bash
npx serverest@latest --nodoc
```

Ou com Docker:

```bash
docker run -p 3000:3000 paulogoncalvesbh/serverest:latest
```

A opção `--nodoc` só evita que o navegador abra a documentação na inicialização. Para conferir que a API está no ar:

- <http://localhost:3000> — documentação das rotas;
- <http://localhost:3000/status> — página de monitoramento com CPU, memória, tempo de resposta e requisições por segundo do servidor;
- `curl http://localhost:3000/produtos` e `curl http://localhost:3000/usuarios` — devem responder `200` com `{"quantidade": ..., "produtos": [...]}` e `{"quantidade": ..., "usuarios": [...]}`.

## 2. Instalar o k6

Conforme o [guia de instalação oficial](https://grafana.com/docs/k6/latest/set-up/install-k6/):

| Sistema | Comando |
| --- | --- |
| Windows (winget) | `winget install k6 --source winget` |
| Windows (Chocolatey) | `choco install k6` |
| Windows (instalador) | [k6-latest-amd64.msi](https://dl.k6.io/msi/k6-latest-amd64.msi) |
| macOS | `brew install k6` |
| Linux | pacote `.deb`/`.rpm` do repositório oficial — ver o guia |

Conferir com `k6 version`. As evidências foram geradas com o k6 v2.4.0.

## 3. Executar os testes

Na raiz deste repositório, com o ServeRest no ar:

```bash
k6 run testes/cenario-1-carga-inicial.js
k6 run testes/cenario-2-carga-progressiva.js
```

A URL da API vem da variável `BASE_URL` (padrão `http://localhost:3000`), então trocar o alvo não exige alterar os scripts:

```bash
k6 run -e BASE_URL=http://localhost:3500 testes/cenario-1-carga-inicial.js
```

O k6 termina com código de saída `0` quando todos os thresholds passam e com código diferente de zero quando algum falha; o resumo no fim da execução marca cada threshold com ✓ ou ✗.

## 4. Reproduzir as evidências

Os arquivos de [evidencias/](evidencias/) foram gerados com os comandos abaixo (Git Bash, Linux ou macOS). O painel web do k6 exporta um relatório HTML com os gráficos da execução; o período de agregação foi reduzido para 2 s porque o painel só desenha gráficos quando a execução dura mais que três períodos, e o cenário 1 dura 30 s.

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=2s K6_WEB_DASHBOARD_EXPORT=evidencias/cenario-1/painel-k6.html \
  k6 run --no-color --summary-export=evidencias/cenario-1/resumo.json testes/cenario-1-carga-inicial.js \
  > evidencias/cenario-1/terminal.txt 2>&1

K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=2s K6_WEB_DASHBOARD_EXPORT=evidencias/cenario-2/painel-k6.html \
  k6 run --no-color --summary-export=evidencias/cenario-2/resumo.json testes/cenario-2-carga-progressiva.js \
  > evidencias/cenario-2/terminal.txt 2>&1
```

A repetição em [evidencias/repeticao/](evidencias/repeticao/) usou os mesmos comandos, sem as variáveis do painel, logo em seguida e contra a mesma instância do ServeRest.

O `resumo.json` está no formato clássico do `--summary-export`, que guarda thresholds, p(99) e taxas por segundo. Duas leituras desse formato não são intuitivas: em `"thresholds": {"p(95)<200": false}`, `false` significa que o limite **não** foi violado; e em métricas do tipo Rate, `passes` e `fails` contam amostras verdadeiras e falsas da métrica — em `http_req_failed`, `"passes": 0` quer dizer zero requisições com falha.
