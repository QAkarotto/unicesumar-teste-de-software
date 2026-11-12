# RELATÓRIO DE TESTES DE DESEMPENHO – SERVEREST

## 1. Introdução

Este relatório apresenta os resultados dos testes de desempenho realizados na API ServeRest utilizando a ferramenta k6, da Grafana.

O objetivo foi avaliar o comportamento da API durante requisições aos endpoints `/produtos` e `/usuarios`, observando principalmente o tempo de resposta, a quantidade de requisições realizadas e a ocorrência de falhas.

Foram realizados dois cenários: um teste de carga inicial, utilizando apenas um usuário virtual, e um teste de carga progressiva, com aumento gradual até dez usuários virtuais.

Os testes foram executados em ambiente local, utilizando o endereço `http://localhost:3000`.

## 2. Ambiente de testes

As ferramentas e tecnologias utilizadas foram:

- ServeRest: API utilizada nos testes.
- Node.js e NPM: execução local do ServeRest.
- k6: ferramenta utilizada para os testes de desempenho.
- Windows e PowerShell: ambiente de execução.

Os endpoints avaliados foram:

- `GET /produtos`
- `GET /usuarios`

Ambos retornaram status HTTP 200 durante a verificação inicial, confirmando que estavam disponíveis para os testes.

## 3. Cenário 1 – Teste de carga inicial

O primeiro cenário foi configurado com apenas um usuário virtual (VU), durante 30 segundos.

Durante a execução, foram realizadas requisições aos endpoints de produtos e usuários, verificando se ambos retornavam o status HTTP 200.

### Resultados obtidos

| Indicador | Resultado |
|---|---:|
| Usuários virtuais | 1 |
| Duração | 30 segundos |
| Iterações | 30 |
| Total de requisições | 60 |
| Requisições por segundo | 1,99 |
| Tempo médio de resposta | 1,11 ms |
| Tempo mínimo | 0,50 ms |
| Tempo máximo | 1,68 ms |
| Percentil 95 (p95) | 1,63 ms |
| Falhas HTTP | 0% |
| Checks aprovados | 60 de 60 (100%) |

### Análise

O primeiro cenário apresentou resultados positivos. Todas as verificações foram aprovadas e não houve falhas nas requisições realizadas.

O tempo médio de resposta foi de 1,11 ms, enquanto o percentil 95 ficou em 1,63 ms. Isso significa que 95% das requisições foram concluídas em até aproximadamente 1,63 ms.

Os dois thresholds configurados também foram aprovados:

- `http_req_duration`: p95 inferior a 1000 ms.
- `http_req_failed`: taxa de falhas inferior a 1%.

O resultado demonstra que a API respondeu rapidamente durante o teste com um único usuário virtual.

## 4. Cenário 2 – Teste de carga progressiva

No segundo cenário, foi realizado um teste com aumento gradual da quantidade de usuários virtuais, chegando ao máximo de dez VUs.

A configuração utilizada foi:

| Etapa | Duração | Usuários virtuais |
|---|---:|---:|
| Inicial | 10 segundos | 1 |
| Aumento | 20 segundos | 5 |
| Pico | 20 segundos | 10 |
| Redução | 10 segundos | 5 |
| Encerramento | 10 segundos | 0 |

Durante todo o cenário, foram mantidas as requisições aos endpoints `/produtos` e `/usuarios`.

### Resultados obtidos

| Indicador | Resultado |
|---|---:|
| Usuários virtuais máximos | 10 |
| Duração | 70 segundos |
| Iterações | 310 |
| Total de requisições | 620 |
| Requisições por segundo | 8,83 |
| Tempo médio de resposta | 1,08 ms |
| Tempo mínimo | 0 ms (conforme saída do k6) |
| Tempo máximo | 3,7 ms |
| Percentil 95 (p95) | 2,09 ms |
| Falhas HTTP | 0% |
| Checks aprovados | 620 de 620 (100%) |

### Análise

Mesmo com o aumento da quantidade de usuários virtuais, a API manteve um bom desempenho durante a execução.

Foram realizadas 620 requisições, com uma média de 8,83 requisições por segundo. Todas as verificações foram aprovadas e não foram registradas falhas HTTP.

O tempo médio de resposta foi de 1,08 ms e o p95 ficou em 2,09 ms, permanecendo abaixo do limite de 1500 ms definido no threshold.

Dessa forma, o cenário progressivo também foi aprovado.

## 5. Comparação entre os cenários

A comparação dos resultados permite observar como a API se comportou com o aumento da carga.

| Indicador | Carga inicial | Carga progressiva |
|---|---:|---:|
| VUs máximos | 1 | 10 |
| Duração | 30 s | 70 s |
| Iterações | 30 | 310 |
| Requisições | 60 | 620 |
| Requisições por segundo | 1,99 | 8,83 |
| Tempo médio | 1,11 ms | 1,08 ms |
| p95 | 1,63 ms | 2,09 ms |
| Falhas HTTP | 0% | 0% |
| Checks aprovados | 100% | 100% |

É possível observar que o volume de requisições aumentou consideravelmente no segundo cenário, enquanto os tempos de resposta permaneceram próximos aos do primeiro teste.

O p95 passou de 1,63 ms para 2,09 ms, uma diferença pequena considerando o aumento da quantidade de usuários virtuais.

Os resultados indicam que, nas condições avaliadas, a API conseguiu lidar com o aumento da carga sem apresentar falhas ou uma degradação significativa no tempo de resposta.

## 6. Limitações dos testes

Apesar dos resultados positivos, é importante considerar algumas limitações.

Os testes foram realizados localmente, utilizando uma quantidade máxima de dez usuários virtuais. Portanto, os resultados não representam necessariamente o comportamento da API em um ambiente de produção, com maior volume de acessos e diferentes condições de infraestrutura.

Além disso, fatores como capacidade do computador, configuração do ambiente e disponibilidade de recursos podem influenciar os resultados.

Para uma avaliação mais completa, seria necessário realizar testes com quantidades maiores de usuários, além de considerar cenários de estresse e períodos mais longos de execução.

## 7. Conclusão

A realização dos testes permitiu observar o comportamento da API ServeRest em diferentes condições de carga utilizando o k6.

No primeiro cenário, com apenas um usuário virtual, todas as requisições foram concluídas com sucesso. No segundo, mesmo com o aumento gradual até dez usuários virtuais, a API manteve tempos de resposta baixos e não apresentou falhas HTTP.

Os dois cenários atenderam aos thresholds definidos e tiveram 100% dos checks aprovados.

Com isso, foi possível compreender melhor a importância dos testes de desempenho e como métricas como tempo médio de resposta, p95, taxa de falhas e requisições por segundo ajudam a avaliar o comportamento de uma aplicação.

De forma geral, os resultados foram positivos para as condições testadas, embora não sejam suficientes para determinar os limites máximos de capacidade da API.

## 8. Evidências

As evidências dos testes devem ser armazenadas na pasta `evidencias/` do projeto:

- `cenario1-carga-inicial.png`: resultado do teste de carga inicial.
- `cenario2-carga-progressiva.png`: resultado do teste de carga progressiva.

