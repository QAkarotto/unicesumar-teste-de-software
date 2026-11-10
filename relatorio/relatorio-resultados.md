# Relatório — Testes de Desempenho com k6 no ServeRest

**Atividade:** 05 — 2º Bimestre  
**Alunos:** Robert William Correa Lima e Eduarda Apim  
**Turma:** ES6SA  
**Data da execução:** 09/11/2026  
**Ambiente:** ServeRest local — http://localhost:3000  
**Ferramenta:** k6 — versão não informada.

## 1. Objetivo

Avaliar o comportamento dos endpoints `GET /produtos` e `GET /usuarios` da API ServeRest local em dois cenários de execução: carga inicial com 1 usuário virtual durante 30 segundos e carga progressiva, aumentando gradualmente de 1 até 5 e 10 usuários virtuais, seguida pela redução gradual da carga.

O objetivo foi analisar o desempenho da API, observando o tempo de resposta, a quantidade de requisições realizadas, a taxa de falhas e o comportamento do sistema diante do aumento de usuários simultâneos.

## 2. Ambiente de teste

- Sistema operacional: Windows 11.
- Processador: Não informado.
- Memória RAM: Não informada.
- Versão do k6: Não informada.
- Forma de execução do ServeRest: Não informada (NPM ou Docker).
- URL local: `http://localhost:3000`.
- Ferramenta de testes: Grafana k6.
- Linguagem utilizada: JavaScript.
- Endpoints testados: `GET /produtos` e `GET /usuarios`.

## 3. Critérios configurados

Foram definidos três critérios de desempenho (thresholds) para avaliar os resultados:

| Métrica | Threshold | Motivo |
|---|---|---|
| `http_req_duration` | p95 < 1000 ms | Garantir que 95% das requisições sejam respondidas em menos de 1 segundo. |
| `http_req_failed` | rate < 0.01 (1%) | Manter a taxa de falhas abaixo de 1%. |
| `checks` | rate > 0.99 (99%) | Garantir que mais de 99% das verificações sejam aprovadas. |

Os limites foram definidos como critérios didáticos para a atividade, permitindo avaliar se a API manteve um bom desempenho durante os dois cenários.

## 4. Resultados — Cenário 1: Carga inicial

**Configuração:** 1 usuário virtual durante 30 segundos, realizando duas requisições por iteração, com pausa de 1 segundo entre as iterações.

| Indicador | Resultado obtido |
|---|---:|
| Usuários virtuais (VUs) | 1 |
| Duração efetiva | 30,2 segundos |
| Total de requisições (`http_reqs`) | 60 |
| Taxa de requisições (`http_reqs/s`) | 1,989253 |
| Tempo médio de resposta | 1,9 ms |
| Tempo mínimo | 0,4973 ms |
| Tempo máximo | 12,38 ms |
| Percentil 95 (p95) | 4,08 ms |
| Taxa de falhas | 0,00% |
| Total de checks | 60 |
| Checks aprovados | 100% (60 de 60) |
| Checks reprovados | 0 |
| Threshold de checks | Aprovado |
| Threshold de duração | Aprovado |
| Threshold de falhas | Aprovado |
| Resultado geral | APROVADO |

### Análise do cenário 1

No primeiro cenário, a API foi testada com apenas 1 usuário virtual durante 30 segundos. Foram realizadas 30 iterações, totalizando 60 requisições HTTP, sendo uma para o endpoint `/produtos` e outra para `/usuarios` em cada iteração.

O tempo médio de resposta foi de 1,9 ms e o percentil 95 foi de 4,08 ms, demonstrando que as requisições apresentaram tempos de resposta baixos.

Não foram identificadas falhas HTTP, e todos os 60 checks foram aprovados. Os dois endpoints retornaram corretamente o código HTTP 200.

Os três thresholds configurados também foram atendidos, demonstrando que a API apresentou um comportamento estável durante a carga inicial.

## 5. Resultados — Cenário 2: Carga progressiva

**Configuração:** aumento gradual dos usuários virtuais, passando por 1, 5 e 10 VUs, seguido da redução até 0 VUs. Foram utilizados quatro estágios de 30 segundos, totalizando 120 segundos planejados.

| Indicador | Resultado obtido |
|---|---:|
| Pico de usuários virtuais | 10 |
| Duração efetiva | 120,5 segundos |
| Total de requisições (`http_reqs`) | 962 |
| Taxa de requisições (`http_reqs/s`) | 7,981282 |
| Tempo médio de resposta | 1,58 ms |
| Tempo mínimo | 0 ms (conforme resumo do k6) |
| Tempo máximo | 10,4 ms |
| Percentil 95 (p95) | 3,88 ms |
| Taxa de falhas | 0,00% |
| Total de checks | 962 |
| Checks aprovados | 100% (962 de 962) |
| Checks reprovados | 0 |
| Threshold de checks | Aprovado |
| Threshold de duração | Aprovado |
| Threshold de falhas | Aprovado |
| Resultado geral | APROVADO |

### Análise do cenário 2

No segundo cenário, a API foi submetida a uma carga progressiva, começando com 1 usuário virtual, aumentando para 5 e chegando ao máximo de 10 usuários virtuais.

Durante aproximadamente 2 minutos de execução, foram realizadas 962 requisições HTTP, alcançando uma taxa média de aproximadamente 7,98 requisições por segundo.

O tempo médio de resposta foi de 1,58 ms e o percentil 95 foi de 3,88 ms. A taxa de falhas permaneceu em 0%, e todos os 962 checks foram aprovados.

Os endpoints `/produtos` e `/usuarios` continuaram retornando o código HTTP 200 durante a execução.

Mesmo com o aumento da quantidade de usuários virtuais, a API manteve tempos de resposta baixos e não apresentou falhas. Todos os thresholds configurados foram aprovados.

## 6. Comparação dos resultados

| Indicador | Cenário 1 | Cenário 2 |
|---|---:|---:|
| Pico de VUs | 1 | 10 |
| Duração efetiva | 30,2 s | 120,5 s |
| Total de requisições | 60 | 962 |
| Requisições por segundo | 1,989253 | 7,981282 |
| Tempo médio | 1,9 ms | 1,58 ms |
| Tempo mínimo | 0,4973 ms | 0 ms |
| Tempo máximo | 12,38 ms | 10,4 ms |
| Percentil 95 (p95) | 4,08 ms | 3,88 ms |
| Taxa de falhas | 0,00% | 0,00% |
| Checks aprovados | 100% | 100% |
| Checks reprovados | 0 | 0 |
| Thresholds | Todos aprovados | Todos aprovados |

### Comparação geral

Ao comparar os resultados, observa-se que o segundo cenário apresentou uma quantidade maior de requisições, passando de 60 para 962.

A taxa média de requisições por segundo também aumentou de aproximadamente 1,99 para 7,98.

O tempo médio de resposta diminuiu de 1,9 ms para 1,58 ms, enquanto o p95 passou de 4,08 ms para 3,88 ms.

A taxa de falhas permaneceu em 0% nos dois cenários, e todos os checks foram aprovados.

Esses resultados demonstram que, nas condições utilizadas, o aumento da carga não provocou uma piora perceptível no tempo de resposta da API.

## 7. Análise dos resultados

A realização dos dois cenários permitiu observar o comportamento da API ServeRest diante de diferentes quantidades de usuários virtuais.

No primeiro cenário, com apenas 1 usuário virtual, foram realizadas 60 requisições durante aproximadamente 30 segundos. A taxa de requisições foi de 1,99 por segundo, com tempo médio de resposta de 1,9 ms.

No segundo cenário, com aumento progressivo até 10 usuários virtuais, foram realizadas 962 requisições durante aproximadamente 2 minutos, alcançando uma taxa de 7,98 requisições por segundo.

Mesmo com o aumento da carga, os tempos de resposta permaneceram baixos. O tempo médio diminuiu de 1,9 ms para 1,58 ms, e o p95 passou de 4,08 ms para 3,88 ms.

Outro resultado importante foi a ausência de falhas HTTP nos dois cenários. Todos os checks foram aprovados, demonstrando que os endpoints `/produtos` e `/usuarios` continuaram respondendo corretamente.

Os três thresholds também foram aprovados em ambas as execuções:

- O p95 permaneceu abaixo de 1000 ms.
- A taxa de falhas permaneceu abaixo de 1%, registrando 0%.
- A taxa de checks aprovados permaneceu acima de 99%, atingindo 100%.

Portanto, os resultados demonstram que, dentro das condições avaliadas, a API conseguiu atender ao aumento de requisições sem apresentar problemas perceptíveis de desempenho.

É importante considerar que o resultado depende das características do computador utilizado, da configuração do ServeRest, da quantidade de dados retornados e das condições de execução dos testes.

## 8. Limitações

Durante a realização da atividade, algumas limitações precisam ser consideradas:

- Os testes foram executados em ambiente local, não representando necessariamente o comportamento da API em produção.
- O computador utilizado executa simultaneamente o k6 e o ServeRest, podendo influenciar os resultados.
- Foram avaliados somente dois endpoints GET: `/produtos` e `/usuarios`.
- A quantidade de usuários virtuais foi limitada a 10, conforme solicitado na atividade.
- Os resultados podem variar conforme o processador, a memória RAM e os demais programas em execução.
- O p95 permite observar o comportamento dos tempos de resposta, mas não identifica sozinho as causas de possíveis lentidões.
- Os resultados representam as execuções realizadas no ambiente utilizado e não garantem o mesmo desempenho em outros computadores ou servidores.
- Os testes realizados não representam um teste de estresse, pois utilizaram uma carga controlada e limitada.

## 9. Conclusão

Com a realização desta atividade, foi possível compreender na prática como os testes de desempenho utilizando k6 ajudam a avaliar o comportamento de uma API diante de diferentes quantidades de usuários virtuais.

Os resultados demonstraram que a API ServeRest apresentou um bom comportamento nos dois cenários executados. Mesmo com o aumento progressivo até 10 usuários virtuais, o sistema manteve tempos de resposta baixos e não apresentou falhas nas requisições.

No primeiro cenário, foram realizadas 60 requisições, enquanto no segundo foram realizadas 962 requisições. Apesar do aumento significativo no volume de acessos, o tempo médio e o percentil 95 permaneceram baixos.

Todos os checks foram aprovados e nenhum threshold foi ultrapassado, demonstrando que os critérios de desempenho definidos para esta atividade foram atendidos.

Concluímos que, nas condições testadas, a API conseguiu atender ao aumento da carga sem apresentar problemas perceptíveis de desempenho. A atividade também permitiu colocar em prática conceitos importantes como usuários virtuais, requisições HTTP, checks, thresholds e análise de métricas de desempenho.

## 10. Evidências anexadas

- [ ] `evidencias/status-local.png`
- [ ] `evidencias/cenario1-terminal.png`
- [ ] `evidencias/cenario2-terminal.png`
- [ ] `evidencias/cenario1-summary.json`
- [ ] `evidencias/cenario2-summary.json`

**Observação:** os resultados dos dois cenários foram registrados a partir das saídas reais do terminal do k6. As capturas de tela e os arquivos JSON devem ser adicionados à pasta `evidencias` antes da entrega pelo GitHub.