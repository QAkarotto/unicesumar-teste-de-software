# Evidências de execução — 12/11/2026

Resultados reais obtidos exclusivamente em `http://localhost:3000`:

Para usar as evidências no Pull Request, copie o conteúdo de [evidencias-para-pr.md](../evidencias-para-pr.md), que reúne as saídas reais dos dois cenários e os links para os arquivos originais na branch `feature/atividade3-2bi-gustavo-nicholas`.

| Arquivo | Conteúdo |
| --- | --- |
| [ambiente.txt](ambiente.txt) | Data, URL, versões do k6/Node.js e recursos visíveis da máquina. |
| [cenario-1.log](cenario-1.log) | Horários, métricas, quatro checks nomeados, oito thresholds e código de saída do perfil de 1 VU/30 s. |
| [cenario-1.json](cenario-1.json) | Resumo original do k6, com métricas globais e por endpoint, duração e metadados. |
| [cenario-2.log](cenario-2.log) | Horários, métricas, checks, thresholds e código de saída do perfil progressivo de até 10 VUs. |
| [cenario-2.json](cenario-2.json) | Resumo original do perfil progressivo. |
| [documentacao.headers.txt](documentacao.headers.txt) e [documentacao.html](documentacao.html) | HTTP 200 e conteúdo da documentação local antes dos testes. |
| [status.headers.txt](status.headers.txt) e [status.html](status.html) | HTTP 200 e conteúdo do painel `/status` antes dos testes. O HTML não registra uma série de métricas durante a carga. |
| [dados-api.json](dados-api.json) | Status e contagem de registros após os testes; sem copiar os dados dos usuários. |

Os resumos JSON foram escritos pelo `handleSummary()` dos scripts. A seção `metadata` adiciona URL, instante de registro em UTC e pausa utilizada; os valores das métricas foram mantidos como recebidos do k6. Em métricas do tipo Rate, os nomes `passes`/`fails` indicam amostras verdadeiras/falsas: em `http_req_failed`, `passes: 0` significa zero requisições classificadas como falha. Em `checks`, `passes` representa verificações aprovadas.

Comando usado para gerar as evidências (a partir da raiz do repositório, com `K6_BIN` apontando para o binário oficial extraído):

```bash
K6_BIN=/tmp/atividade05-ferramentas/k6-v2.4.0-linux-amd64/k6 bash desempenho/atividade-05/executar.sh evidencias
```

O ServeRest foi iniciado pelo executável do pacote NPM 3.2.2, instalado em `/tmp/atividade05-ferramentas/serverest`, usando `--nodoc`. A consulta adicional em `dados-api.json` ocorreu após o término dos cenários e não entra nas métricas dos resumos.

Para novas execuções, siga o [guia](../README.md) e use a saída padrão do coletor, que cria uma pasta com data e hora em `resultados/`.
