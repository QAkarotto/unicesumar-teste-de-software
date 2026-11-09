
# Atividade 05 – Relatório de Testes de Desempenho

**Disciplina:** Testes de Software  
**Alunos:** Luiz Gustavo Becher Bolzani e Jefferson Luis Namur Junior  
**Ferramenta:** Grafana k6 v2.3.0  
**Sistema:** ServeRest v3.2.2  
**Ambiente:** GitHub Codespaces – API local

## 1. Objetivo

Avaliar o comportamento da API ServeRest sob diferentes níveis de carga, utilizando a ferramenta k6 para medir tempos de resposta, quantidade de requisições, taxa de falhas e cumprimento dos critérios de desempenho.

## 2. Cenários executados

### Cenário 1 – Carga inicial

- Usuários virtuais: 1
- Duração configurada: 30 segundos
- Endpoints: GET /produtos e GET /usuarios
- Total de requisições: 60
- Taxa de requisições: 1,99 req/s

### Cenário 2 – Carga progressiva

- Usuários virtuais: crescimento gradual até 10 VUs
- Duração configurada: 70 segundos
- Etapas: 1, 5, 10, 5 e 0 VUs
- Endpoints: GET /produtos e GET /usuarios
- Total de requisições: 620
- Taxa de requisições: 8,82 req/s

## 3. Resultados comparativos

| Métrica | Carga inicial | Carga progressiva |
|---|---|---|
| VUs máximos | 1 | 10 |
| Duração configurada | 30 s | 70 s |
| Requisições | 60 | 620 |
| Requisições por segundo | 1,99 | 8,82 |
| Tempo médio | 1,65 ms | 1,44 ms |
| Percentil 95 (p95) | 3,09 ms | 3,13 ms |
| Taxa de falhas HTTP | 0% | 0% |
| Checks aprovados | 60/60 | 620/620 |
| Thresholds aprovados | 2/2 | 2/2 |

## 4. Critérios de desempenho

Foram configurados dois thresholds:

- http_req_duration: p(95)<500
- http_req_failed: rate<0.01

O primeiro estabelece que pelo menos 95% das requisições devem apresentar tempo de resposta inferior a 500 ms.

O segundo estabelece que a taxa de falhas HTTP deve permanecer abaixo de 1%.

Esses valores foram escolhidos como critérios de aceitação para os testes locais, considerando a baixa complexidade das consultas realizadas e a necessidade de identificar possíveis degradações de desempenho.

Ambos os critérios foram atendidos nos dois cenários.

## 5. Análise dos resultados

No cenário inicial, com um usuário virtual, foram realizadas 60 requisições, com tempo médio de resposta de 1,65 ms e p95 de 3,09 ms.

No cenário progressivo, a quantidade máxima de usuários virtuais aumentou para 10, resultando em 620 requisições e taxa de aproximadamente 8,82 requisições por segundo.

O tempo médio de resposta diminuiu ligeiramente para 1,44 ms, enquanto o p95 apresentou pequeno aumento, chegando a 3,13 ms.

A taxa de falhas permaneceu em 0% nos dois cenários, e todas as verificações de código HTTP 200 foram aprovadas.

Os resultados indicam que o ServeRest manteve tempos de resposta baixos e estabilidade durante o aumento controlado da carga.

A pequena diferença entre os tempos médios não permite concluir que o aumento de usuários melhorou o desempenho, pois variações de execução, cache, agendamento de processos e condições do ambiente podem influenciar os resultados.

## 6. Limitações

Os testes foram realizados em ambiente local, utilizando o GitHub Codespaces.

Os resultados podem variar conforme os recursos computacionais disponíveis, o estado da aplicação e as condições do ambiente.

Além disso, os cenários apresentaram durações e quantidades de usuários diferentes, o que limita comparações diretas de volume total de requisições.

O teste utilizou apenas operações GET e não avaliou operações de escrita, autenticação ou cenários de estresse.

Portanto, os resultados não devem ser interpretados como garantia de desempenho em produção ou sob cargas superiores às avaliadas.

## 7. Conclusão técnica

A execução dos testes de desempenho com k6 demonstrou que a API ServeRest apresentou comportamento estável nos dois cenários avaliados.

Mesmo com o aumento gradual até 10 usuários virtuais, não foram registradas falhas HTTP, e todos os checks e thresholds foram atendidos.

O percentil 95 permaneceu muito abaixo do limite estabelecido de 500 ms.

Conclui-se que o ServeRest suportou adequadamente a carga controlada aplicada no ambiente local, sem degradação relevante dos tempos de resposta.

Para uma avaliação mais abrangente, seriam necessários testes adicionais com diferentes operações, repetições e monitoramento de recursos computacionais.

## 8. Evidências

Os resultados completos foram exportados pelo k6 para os arquivos:

- resultado-inicial.json
- resultado-progressivo.json

Esses arquivos contêm as métricas registradas durante a execução dos respectivos cenários.
