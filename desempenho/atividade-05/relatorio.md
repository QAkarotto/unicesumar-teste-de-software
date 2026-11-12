# Relatório — desempenho do ServeRest com k6

## Ambiente e procedimento

Os testes foram executados em **12/11/2026**, no fuso de São Paulo (UTC−03:00), exclusivamente em `http://localhost:3000`. Foram utilizados **ServeRest 3.2.2**, iniciado pelo executável do pacote NPM com `--nodoc`, **Node.js v22.22.1** e **k6 v2.4.0** (binário oficial). As ferramentas foram instaladas em uma pasta temporária, sem adicionar dependências ao projeto Playwright.

O ambiente era Linux 7.0.0-43-generic x86_64, com processador Intel Core i7-1165G7, 8 CPUs lógicas disponíveis e 14,92 GiB de memória total. Gerador de carga e API compartilharam a mesma máquina. Esses dados descrevem os recursos visíveis ao processo, sem representar recursos exclusivos para o teste. Evidência: [ambiente.txt](evidencias/ambiente.txt).

A documentação em `/` e o painel `/status` responderam HTTP 200 antes das execuções. Foram preservados os [cabeçalhos da documentação](evidencias/documentacao.headers.txt), os [cabeçalhos do status](evidencias/status.headers.txt) e o [HTML do painel](evidencias/status.html). Essa consulta comprova a disponibilidade do painel; não constitui uma série temporal de CPU ou memória durante os testes.

Cada iteração realizou um GET em `/produtos` e outro em `/usuarios`, com pausa de 1 segundo após cada requisição. Foram executados somente GETs, sem criação ou alteração de dados. A base local continha **2 produtos e 1 usuário**, conforme [consulta realizada após os cenários](evidencias/dados-api.json). Essa consulta adicional e as consultas de preparação por curl não compõem as métricas do k6.

O cenário inicial foi executado primeiro, seguido pelo progressivo, sem reiniciar a API. Não houve aquecimento separado. O perfil progressivo foi configurado assim:

| Intervalo programado | VUs |
| --- | --- |
| 0–15 s | Aumento gradual de 1 para 5 |
| 15–30 s | Aumento gradual de 5 para 10 |
| 30–45 s | Manutenção em 10 |
| 45–60 s | Redução gradual de 10 para 5 |
| 60–75 s | Redução gradual de 5 para 0 |

As reduções permitem até 5 segundos para finalizar uma iteração já iniciada. Assim, VUs que estão concluindo trabalho podem permanecer ativos brevemente além do alvo de uma etapa. A duração efetiva pode exceder a programada.

## Critérios de aprovação e justificativas

Os mesmos thresholds foram definidos para os dois cenários antes da execução. São critérios **didáticos**, escolhidos para este experimento, e não um SLA oficial do ServeRest. A [documentação do k6](https://grafana.com/docs/k6/latest/using-k6/thresholds/) explica como critérios sobre métricas determinam a aprovação do teste.

| Métrica | Critério | Justificativa |
| --- | --- | --- |
| `http_req_duration` | `avg<300` | Exigir baixa latência média nas consultas simples de uma API local. O limite de 300 ms serve como orçamento inicial para detectar lentidão expressiva. |
| `http_req_duration` | `p(95)<500` | Avaliar a cauda de respostas e exigir que aproximadamente 95% fiquem abaixo de meio segundo, complementando a média. |
| `http_req_failed` | `rate<0.01` | Exigir menos de 1% de erros HTTP/transporte; HTTP 200 foi definido explicitamente como o único status esperado. |
| `checks` | `rate==1` | Exigir 100% de sucesso no status e na consistência da lista retornada com o campo `quantidade`. Um JSON incorreto não deve passar apenas por responder HTTP 200. |
| Duração de cada endpoint | `p(95)<500` | Evitar que um endpoint mais rápido esconda lentidão do outro na agregação geral. |
| Falhas de cada endpoint | `rate<0.01` | Evitar que a proporção de erros de um endpoint seja diluída pelo outro. |

São **8 expressões de threshold**: quatro globais e duas por endpoint. O critério estrito de checks faz qualquer resposta com status/conteúdo inválido reprovar a execução, mesmo se a taxa HTTP agregada ainda fosse inferior a 1%. No cenário de 30 requisições, uma única falha HTTP já representaria cerca de 3,33%.

## Resultados comparativos

Os valores abaixo foram extraídos dos resumos originais: [cenário 1](evidencias/cenario-1.json) e [cenário 2](evidencias/cenario-2.json). A duração observada vem de `state.testRunDurationMs`; os tempos de resposta são de `http_req_duration`. A taxa é a média `http_reqs.values.rate` da execução inteira, incluindo o término das iterações em andamento.

| Indicador | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | ---: | ---: |
| VUs configurados | 1 constante | 1 → 5 → 10 → 5 → 0 |
| Máximo de VUs observado | 1 | 10 |
| Duração programada | 30 s | 75 s |
| Duração observada | 30,146 s | 76,216 s |
| Início (UTC−03:00) | 14:55:11 | 14:55:41 |
| Fim (UTC−03:00) | 14:55:41 | 14:56:57 |
| Iterações completas | 15 | 231 |
| Requisições totais | 30 | 462 |
| Requisições por endpoint | 15 | 231 |
| Taxa média de requisições | 0,995 req/s | 6,062 req/s |
| Tempo médio | 3,919 ms | 1,910 ms |
| p95 | 11,690 ms | 3,274 ms |
| Maior tempo observado | 14,205 ms | 17,450 ms |
| Falhas HTTP | 0/30 (0%) | 0/462 (0%) |
| Checks aprovados | 60/60 (100%) | 924/924 (100%) |
| Checks reprovados | 0 | 0 |
| Thresholds aprovados | 8/8 | 8/8 |
| Código de saída | 0 | 0 |

Os quatro checks nomeados (status e consistência por endpoint) tiveram, individualmente, 15 aprovações no cenário 1 e 231 no cenário 2. O detalhamento e o resultado de cada threshold constam nos [logs do cenário 1](evidencias/cenario-1.log) e [do cenário 2](evidencias/cenario-2.log).

| Endpoint | Média — cenário 1 | Média — cenário 2 | p95 — cenário 1 | p95 — cenário 2 | Falhas em ambos |
| --- | ---: | ---: | ---: | ---: | ---: |
| `GET /produtos` | 4,366 ms | 1,947 ms | 11,086 ms | 3,190 ms | 0% |
| `GET /usuarios` | 3,472 ms | 1,873 ms | 7,052 ms | 3,287 ms | 0% |

## Efeito do aumento da carga

A vazão média aumentou aproximadamente **6,09 vezes**, de 0,995 para 6,062 req/s, e o máximo de VUs passou de 1 para 10. Não se espera um aumento médio de dez vezes: o cenário progressivo passa parte da execução abaixo de 10 VUs e inclui a redução final. Além disso, as pausas e a duração das requisições determinam o ritmo de cada usuário.

Nesta amostra, **não houve degradação na média ou no p95** ao aumentar a carga. A média caiu cerca de 51,3% e o p95 cerca de 72,0%; o máximo isolado, por outro lado, subiu de 14,205 para 17,450 ms. Isso mostra por que uma única estatística não descreve toda a distribuição. A API respondeu corretamente às consultas e permaneceu dentro dos limites definidos para o perfil de até 10 VUs.

A redução da latência não prova que aumentar a carga melhora o ServeRest. O cenário inicial tem uma amostra pequena e ocorreu primeiro, sem aquecimento separado. Aquecimento da aplicação, inicialização de recursos e variações do sistema operacional são explicações possíveis, mas não foram isoladas ou comprovadas neste experimento. Não há medições de CPU/memória durante a carga que permitam atribuir os resultados a um recurso específico.

## Limitações e conclusão técnica

- Foi feita uma execução de cada perfil, com apenas 30 requisições no cenário inicial. Percentis de amostras pequenas são sensíveis a poucas respostas lentas; não há repetições suficientes para estabelecer significância estatística.
- API e k6 competem pelos recursos da mesma máquina. O uso de loopback reduz os custos de rede e não representa a latência de uma implantação acessada pela internet.
- A base era pequena e o fluxo continha somente duas listagens GET. O resultado não representa consultas com grande volume de dados, autenticação, escritas, carrinhos ou outros fluxos reais.
- Os cenários duraram pouco, com somente 15 segundos programados no patamar máximo. Não foram avaliados estabilidade prolongada, vazamentos de memória, limite de capacidade ou recuperação após saturação.
- O modelo é fechado: cada VU espera a resposta antes de continuar. Se o servidor ficar lento, o gerador também passa a emitir menos requisições. A [documentação de modelos de carga](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) descreve essa limitação.
- As métricas do cenário 2 agregam crescimento, patamar e redução. Seu p95 não descreve isoladamente o trecho de 10 VUs. Também não se pode concluir capacidade máxima a partir da taxa média de 6,062 req/s, pois as pausas limitam deliberadamente a carga.

O ServeRest atendeu aos critérios didáticos nos dois perfis locais, com aumento de vazão e sem falhas observadas. A conclusão se restringe à versão, máquina, base e fluxo registrados. Para tornar a comparação mais confiável, seriam úteis repetições com aquecimento padronizado, alternância da ordem dos cenários, análise por etapa e coleta de CPU/memória, mantendo o limite de carga da atividade.
