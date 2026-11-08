# Relatório de testes de desempenho

## Ambiente e execução

Os testes foram executados em 08/11/2026, no fuso de Brasília (UTC−03:00), exclusivamente contra `http://localhost:3000`. A página inicial e `/status` responderam HTTP 200. Foi utilizado ServeRest 3.2.2 instalado via npm e iniciado localmente, Node.js 24.21.0, npm 11.19.0 e k6 2.3.0.

O computador utiliza Windows 11 Pro, processador AMD Ryzen 5 4600G com 12 processadores lógicos e aproximadamente 15,39 GiB de memória utilizável. API e gerador de carga foram executados na mesma máquina. A base inicial continha 2 produtos e 1 usuário; os testes realizaram somente consultas.

O cenário inicial utilizou 1 VU por 30 segundos. O progressivo iniciou com 1 VU e utilizou seis estágios: 10 s com 1 VU, 20 s de 1 a 5, 20 s de 5 a 10, 10 s com 10, 10 s de 10 a 5 e 10 s de 5 a 0. Foram programados 80 segundos. Cada iteração consultou os dois endpoints e aguardou 1 segundo após cada requisição, mantendo a carga controlada.

## Critérios de desempenho

| Threshold | Critério e justificativa |
|---|---|
| `http_req_duration: p(95)<500` | Exige p95 inferior a 500 ms. É um limite didático para consultas locais simples, definido antes da execução; não representa um SLA oficial do ServeRest. |
| `http_req_failed: rate<0.01` | Exige menos de 1% de falhas HTTP, para avaliar a estabilidade sob carga. Somente status 200 é considerado sucesso neste teste. |
| `checks: rate==1` | Exige 100% das verificações de status 200 aprovadas, pois ambos os endpoints devem responder corretamente. Esse critério é mais rigoroso que a tolerância da taxa de falhas HTTP. |

## Resultados

| Indicador | Cenário 1 — Inicial | Cenário 2 — Progressivo |
|---|---:|---:|
| VUs | 1 constante | 1 → 5 → 10 → 5 → 0 |
| Duração programada | 30 s | 80 s |
| Duração medida pelo k6 | 30,093 s | 80,422 s |
| Total de requisições | 30 | 412 |
| Requisições por segundo | 0,997 | 5,123 |
| Tempo médio de resposta | 2,146 ms | 2,095 ms |
| p95 do tempo de resposta | 2,794 ms | 6,538 ms |
| Taxa de falhas HTTP | 0% (0/30) | 0% (0/412) |
| Checks de produtos aprovados | 15/15 | 206/206 |
| Checks de usuários aprovados | 15/15 | 206/206 |
| Total de checks aprovados | 30/30 (100%) | 412/412 (100%) |
| Threshold de p95 | Aprovado | Aprovado |
| Threshold de falhas HTTP | Aprovado | Aprovado |
| Threshold de checks | Aprovado | Aprovado |
| Código de saída | 0 | 0 |

Os valores foram extraídos dos resumos JSON, com arredondamento para três casas decimais. A duração medida foi calculada por `http_reqs.count / http_reqs.rate`, usando os valores completos. A pequena diferença em relação à duração programada decorre da conclusão das iterações em andamento. Os horários dos arquivos de execução incluem também a inicialização e a finalização do processo. Nos JSON exportados, `false` dentro de `thresholds` indica ausência de violação; os resumos TXT apresentam a aprovação explicitamente.

## Análise e limitações

A taxa média de requisições aumentou de 0,997 para 5,123 req/s, aproximadamente 5,14 vezes. O total de requisições também aumentou, mas não deve ser comparado isoladamente porque o cenário progressivo teve duração maior. Sua taxa média inclui as rampas e os períodos com menos usuários, não apenas o intervalo com 10 VUs.

O tempo médio permaneceu próximo de 2,1 ms e apresentou pequena redução. Entretanto, o p95 passou de 2,794 para 6,538 ms, aproximadamente 2,34 vezes o valor inicial. Assim, a média estável não impediu o aumento dos tempos na parte mais lenta da distribuição. Esse comportamento foi observado na execução com maior concorrência, mas uma única medição não permite atribuí-lo exclusivamente ao aumento de carga.

Não ocorreram erros HTTP nem falhas nos checks. Os dois cenários atenderam ao limite de p95 e aos demais thresholds. As pausas entre requisições limitaram a taxa de envio, portanto o teste não mediu a capacidade máxima da API.

As principais limitações são a curta duração, a pequena amostra inicial de 30 requisições, uma única execução por perfil, a base com poucos registros e a avaliação de apenas dois endpoints de leitura. A execução local não representa latência de rede externa. API e k6 compartilharam CPU e memória, e processos em segundo plano ou aquecimento podem afetar os resultados. Os resumos agregam os dois endpoints e todos os estágios, sem identificar em qual rota ou estágio ocorreram os maiores tempos. Os checks validaram o status HTTP, sem verificar o conteúdo completo das respostas.

## Conclusão

O ServeRest atendeu aos critérios definidos para os dois cenários locais, com até 10 VUs, 100% de checks aprovados e nenhuma falha HTTP. A maior carga elevou a taxa de requisições e o p95, mantendo o tempo médio praticamente estável. Os resultados demonstram desempenho adequado somente nas condições avaliadas e não comprovam capacidade máxima, estabilidade prolongada ou comportamento equivalente em produção.

## Evidências

- [Ambiente](evidencias/ambiente.txt) e [confirmação da API e do status](evidencias/status.txt).
- Cenário 1: [saída do k6](evidencias/cenario-1.txt), [métricas JSON](evidencias/cenario-1.json) e [horários e código de saída](evidencias/cenario-1-execucao.txt).
- Cenário 2: [saída do k6](evidencias/cenario-2.txt), [métricas JSON](evidencias/cenario-2.json) e [horários e código de saída](evidencias/cenario-2-execucao.txt).
