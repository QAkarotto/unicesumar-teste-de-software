# Parte 1 — Pesquisa sobre k6

Respostas baseadas na documentação oficial do k6 (Grafana), versão 2.3. As fontes estão no fim do documento.

## 1. Qual é a finalidade dos testes de desempenho e como os testes de carga se diferenciam dos testes funcionais?

Testes de desempenho medem **como** o sistema se comporta sob uma determinada carga: tempo de resposta, vazão
(requisições por segundo), taxa de erros e estabilidade ao longo do tempo. Eles servem para saber se o sistema atende
às metas de desempenho, encontrar o ponto em que ele começa a degradar e confirmar que uma mudança de código ou de
infraestrutura não piorou esses números. A documentação do k6 organiza esses testes por objetivo:

- **smoke:** carga mínima, para validar o script;
- **average-load:** carga típica do dia a dia;
- **stress:** carga acima da média;
- **soak:** carga média por horas;
- **spike:** picos súbitos;
- **breakpoint:** carga crescente até o limite.

Um teste **funcional** verifica **se** o sistema faz o que deveria. Para uma entrada, ele confere se a saída está
correta, normalmente com um único usuário, e o resultado é binário: passou ou falhou. Um teste de **carga** repete
essas operações com muitos usuários ao mesmo tempo e avalia o resultado **estatisticamente**, por médias, percentis e
taxas. A resposta pode estar correta e mesmo assim lenta demais, ou correta para 99% dos usuários e com erro para o
resto. Por isso, o resultado de um teste de carga depende do ambiente (máquina, rede, dados) e precisa ser
interpretado junto com as condições em que foi executado.

## 2. O que são usuários virtuais (VUs) e como eles influenciam a carga gerada?

Usuários virtuais são os usuários simulados pelo k6. Cada VU executa a função principal do script (`default`)
repetidamente e de forma independente, em paralelo com os outros VUs. Cada execução completa dessa função é uma
**iteração**. Quanto mais VUs, mais requisições acontecem ao mesmo tempo, ou seja, mais concorrência sobre o sistema.

A quantidade de requisições por segundo, porém, não depende só do número de VUs. Ela também depende de **quanto tempo
cada iteração leva**:

> requisições/s ≈ VUs × requisições por iteração ÷ duração de uma iteração

Neste trabalho, cada iteração faz 2 requisições e espera 1 s (`sleep(1)`). Então 1 VU gera cerca de 2 req/s e 10 VUs
geram cerca de 20 req/s. Esse é o **modelo fechado** (*closed model*) do k6: um VU só começa a próxima iteração quando
termina a anterior. Se o sistema ficar lento, as iterações demoram mais e a vazão cai junto. Para impor uma taxa fixa
de requisições, independente da resposta do sistema, o k6 oferece os executores de taxa de chegada (*open model*).

Os VUs e a duração são definidos nas opções do teste (`vus`, `duration`) ou em cenários com executores. O executor
`ramping-vus`, usado no cenário 2, varia a quantidade de VUs ao longo do teste conforme os `stages`.

## 3. Qual é a diferença entre checks e thresholds no k6?

**Checks** são validações feitas em cada resposta, como "o status é 200" ou "o corpo tem a lista de produtos". Elas
funcionam como asserções, com uma diferença importante: uma check que falha **não interrompe o teste e não o marca como
reprovado**. O k6 apenas registra quantas passaram e quantas falharam, na métrica `checks`, e segue executando.

**Thresholds** são os critérios de aprovação do teste inteiro. Eles são definidos sobre métricas agregadas, por exemplo
"95% das requisições abaixo de 300 ms" (`http_req_duration: ['p(95)<300']`) ou "menos de 1% de falhas"
(`http_req_failed: ['rate<0.01']`). Se algum threshold não for atendido, o k6 marca o teste como reprovado e termina
com código de saída diferente de zero (99). É isso que permite usar o k6 em pipelines de CI. Um threshold também pode
interromper o teste na hora, com `abortOnFail`.

Em resumo: as checks dizem **o que aconteceu** em cada resposta, e os thresholds decidem **se o resultado é
aceitável**. Os dois se combinam com um threshold sobre a taxa de checks (`checks: ['rate>0.99']`), que faz o teste
reprovar quando muitas respostas vêm erradas. Este trabalho usa essa combinação.

## 4. O que representam as métricas `http_req_duration`, `http_req_failed` e `http_reqs`?

Elas são as métricas embutidas que o k6 coleta automaticamente em toda requisição HTTP e cobrem o método RED
(*Requests, Errors, Duration*):

| Métrica | Tipo | O que representa |
| --- | --- | --- |
| `http_req_duration` | Trend | Tempo total de cada requisição: envio + espera pela resposta + recebimento (`http_req_sending` + `http_req_waiting` + `http_req_receiving`). Não inclui o tempo de abrir a conexão. Como é uma tendência, o k6 mostra média, mínimo, mediana, máximo e percentis. É a principal medida de velocidade. |
| `http_req_failed` | Rate | Proporção de requisições que falharam. Por padrão, a falha é um status fora da faixa 200–399 ou um erro de rede, e o critério pode ser ajustado com `http.setResponseCallback()`. É a taxa de erros. |
| `http_reqs` | Counter | Quantidade total de requisições geradas pelo k6, com a taxa por segundo. É a vazão (*throughput*) do teste. |

## 5. Qual é a importância do percentil 95 (p95) na análise dos tempos de resposta?

O p95 é o tempo abaixo do qual estão 95% das requisições. Se o p95 é 120 ms, 95% das respostas levaram até 120 ms e
apenas 5% foram mais lentas.

Ele importa porque a **média esconde a cauda**. Poucas respostas muito lentas quase não mexem na média, mas são
justamente as que o usuário percebe. Por exemplo, 95 requisições de 20 ms e 5 de 2 s têm média de 119 ms, um número que
parece bom, enquanto 1 em cada 20 usuários esperou 2 segundos. O p95 descreve a experiência de quase todos os usuários
e, ao mesmo tempo, descarta os 5% mais extremos, que podem ser picos isolados (coleta de lixo, uma conexão nova).
Isso o torna mais estável que o máximo e mais honesto que a média.

Por isso, metas de desempenho e thresholds costumam ser escritos em percentis (`p(95)<300`). Na análise, o p95 também é
o primeiro sinal de degradação sob carga: quando o sistema começa a enfileirar requisições, a cauda cresce antes da
média. Vale olhar o p95 junto com o p99 e o máximo para ver o tamanho dessa cauda.

---

## Fontes (documentação oficial do k6)

- [Load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/)
- [Average-load testing](https://grafana.com/docs/k6/latest/testing-guides/test-types/load-testing/)
- [API load testing](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/)
- [Glossary — Virtual user](https://grafana.com/docs/k6/latest/reference/glossary/)
- [Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)
- [Ramping VUs executor](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/)
- [Checks](https://grafana.com/docs/k6/latest/using-k6/checks/)
- [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/)
- [Built-in metrics reference](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
- [setResponseCallback](https://grafana.com/docs/k6/latest/javascript-api/k6-http/set-response-callback/)
- [End-of-test summary](https://grafana.com/docs/k6/latest/results-output/end-of-test/)
