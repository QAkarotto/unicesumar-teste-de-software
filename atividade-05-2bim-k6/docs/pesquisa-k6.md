# Parte 1 — Pesquisa sobre k6

Respostas baseadas na documentação oficial do k6 (versão `latest`, consultada em 2026-11-12, correspondente ao k6 v2.x). As citações estão no original em inglês, com o link da página de onde saíram.

## 1. Finalidade dos testes de desempenho e diferença entre teste de carga e teste funcional

Teste de desempenho mede **como** o sistema responde quando é usado: tempo de resposta, vazão (requisições por segundo), taxa de erro e consumo de recursos, sob uma carga definida. A finalidade é verificar se o sistema atende aos requisitos não funcionais de velocidade e confiabilidade e descobrir seus limites antes dos usuários. A documentação organiza esses testes por tipo, conforme o perfil de carga: _smoke_ (carga mínima, valida o script e a linha de base), _average-load_ (carga típica), _stress_ (acima da média), _soak_ (carga típica por longos períodos), _spike_ (pico súbito) e _breakpoint_ (carga crescente até achar o limite) ([Load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/)).

O **teste de carga** propriamente dito é o _average-load test_: _"An average-load test assesses how the system performs under typical load"_, e ele _"typically increases the throughput or VUs gradually and keeps that average load for some time"_ ([Average-load testing](https://grafana.com/docs/k6/latest/testing-guides/test-types/load-testing/)).

A diferença para o **teste funcional** está na pergunta e na forma do resultado. O funcional pergunta se o sistema faz o que deveria: executa um caso, compara a saída com a esperada e o veredito é binário por caso. O de carga pergunta se o sistema continua fazendo isso, e em quanto tempo, quando muitos usuários agem ao mesmo tempo: o veredito é estatístico, sobre distribuições de tempo e taxas de erro agregadas ao longo de uma duração e de um nível de concorrência. No k6 as duas coisas convivem — _checks_ fazem a validação funcional de cada resposta e _thresholds_ julgam as métricas agregadas (ver a pergunta 3).

## 2. Usuários virtuais (VUs) e sua influência na carga

Um VU é uma unidade de execução independente que repete a função `default` do script enquanto o cenário durar: _"VUs are essentially parallel `while(true)` loops"_ ([Running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)). Cada VU tem estado próprio (conexões, cookies) e simula um usuário; o número de VUs é o nível de concorrência do teste.

A carga gerada depende de quantos VUs existem **e** de quanto dura cada iteração. Nos executores baseados em VUs (`constant-vus`, `ramping-vus`) o modelo é fechado: _"in the closed model, VU iterations start only when the last iteration finishes"_ ([Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)). A vazão é, portanto, aproximadamente `VUs ÷ duração da iteração`, e a duração da iteração é a soma dos tempos de resposta com as pausas (`sleep`): _"Total iteration time is sleep + time to finish request"_ ([ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/)). Nos scripts desta atividade cada iteração faz 2 requisições e pausa 1 s, então cada VU gera cerca de 2 req/s, e 10 VUs, cerca de 20 req/s.

Consequência importante do modelo fechado: se o sistema ficar lento, as iterações demoram mais e o próprio k6 reduz a vazão, porque _"the target system's response time can influence the throughput of the test"_ — efeito que a literatura chama de _coordinated omission_ ([Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)). Para fixar a taxa de chegada independentemente da resposta, o k6 oferece os executores de modelo aberto `constant-arrival-rate` e `ramping-arrival-rate`.

## 3. Diferença entre checks e thresholds

**Checks** são asserções sobre cada resposta (status, corpo, cabeçalho). Cada check gera uma métrica de taxa de sucesso, mas não decide o resultado do teste: _"failed checks do not cause the test to abort or finish with a failed status"_ ([Checks](https://grafana.com/docs/k6/latest/using-k6/checks/)).

**Thresholds** são critérios de aprovação sobre métricas agregadas da execução inteira — por exemplo, `p(95)` de `http_req_duration` abaixo de 200 ms. São a forma de codificar SLOs: se algum não for atendido, _"the test finishes with a failed status"_ e o k6 termina com código de saída diferente de zero, o que permite barrar um pipeline de CI ([Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)).

Os dois se combinam com um threshold sobre a própria métrica `checks` (ex.: `checks: ['rate>0.99']`), para que falhas funcionais acima de um limite também reprovem o teste ([Thresholds — fail a load test using checks](https://grafana.com/docs/k6/latest/using-k6/thresholds/#fail-a-load-test-using-checks)). Thresholds também aceitam submétricas filtradas por tag, como `'http_req_duration{endpoint:produtos}'`, recurso usado nos scripts para avaliar cada endpoint e cada patamar de carga separadamente.

## 4. As métricas `http_req_duration`, `http_req_failed` e `http_reqs`

Definições da [referência de métricas](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/):

| Métrica | Tipo | O que representa |
| --- | --- | --- |
| `http_req_duration` | Trend | Tempo total da requisição: _"equal to `http_req_sending + http_req_waiting + http_req_receiving`"_, isto é, envio, espera pela resposta e recebimento, **sem** a resolução de DNS e o estabelecimento da conexão. É o tempo de resposta percebido do lado do cliente; por ser Trend, o k6 resume a distribuição em média, mínimo, mediana, máximo e percentis. |
| `http_req_failed` | Rate | Proporção de requisições que falharam segundo o `setResponseCallback`. Por padrão, _"requests with status codes between 200 and 399 are considered 'expected'"_ ([setResponseCallback](https://grafana.com/docs/k6/latest/javascript-api/k6-http/set-response-callback/)); status 4xx/5xx e erros de rede contam como falha. |
| `http_reqs` | Counter | _"How many total HTTP requests k6 generated"_. O resumo mostra o total e a taxa por segundo, que é a vazão alcançada. |

## 5. Importância do percentil 95 (p95)

O p95 é o tempo abaixo do qual estão 95% das requisições — dito ao contrário, só 1 em cada 20 foi mais lenta que ele. A média resume mal tempos de resposta porque a distribuição costuma ser assimétrica, com cauda longa: poucas requisições lentas puxam a média sem que ela mostre quantos usuários foram afetados, e uma média boa pode esconder uma fatia relevante de usuários esperando muito. O máximo, no extremo oposto, reflete um único evento e varia muito entre execuções. O p95 fica no meio: descreve a experiência de quase todos os usuários e é estável o bastante para servir de critério. Por isso é o percentil usual em SLOs — o exemplo canônico da documentação é _"95% of requests should be below 200ms"_, escrito como `http_req_duration: ['p(95)<200']` ([Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)) — e o resumo de fim de teste do k6 mostra `p(90)` e `p(95)` por padrão ([End-of-test summary](https://grafana.com/docs/k6/latest/results-output/end-of-test/)).

Um cuidado: percentil depende de amostra. Com 60 requisições, como no cenário 1, o p95 é decidido pelas 3 mais lentas, e o p99 praticamente coincide com o máximo; a leitura fica mais confiável à medida que o número de requisições cresce.

## Referências

- Grafana Labs. [k6 documentation](https://grafana.com/docs/k6/latest/).
- Grafana Labs. [Running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/).
- Grafana Labs. [Load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/) e [Average-load testing](https://grafana.com/docs/k6/latest/testing-guides/test-types/load-testing/).
- Grafana Labs. [Checks](https://grafana.com/docs/k6/latest/using-k6/checks/) e [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).
- Grafana Labs. [Built-in metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/) e [setResponseCallback](https://grafana.com/docs/k6/latest/javascript-api/k6-http/set-response-callback/).
- Grafana Labs. [Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) e [ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).
- Grafana Labs. [End-of-test summary](https://grafana.com/docs/k6/latest/results-output/end-of-test/).
