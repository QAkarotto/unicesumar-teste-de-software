# Relatório de Testes de Desempenho - ServeRest

**Alany Moreira Mach - 25362055-2**  
**Samara Ostheimer Kubes - 24159205-2**

## 1. Objetivo

Avaliar o comportamento da API ServeRest por meio de testes de desempenho realizados com k6, comparando uma execução com carga inicial e outra com carga progressiva.

Foram utilizados os endpoints `GET /produtos` e `GET /usuarios`, executados exclusivamente no ambiente local.

## 2. Configuração dos testes

### Cenário 1 - Carga inicial

- Usuários virtuais: 1
- Duração: 30 segundos
- Endpoints: `GET /produtos` e `GET /usuarios`

### Cenário 2 - Carga progressiva

- Usuários virtuais: de 1 até 10
- Duração: 90 segundos
- Progressão: 1, 5 e 10 VUs, seguida de redução gradual.
- Endpoints: `GET /produtos` e `GET /usuarios`

## 3. Critérios de desempenho (Thresholds)

Foram definidos três critérios de desempenho no **k6** para avaliar o comportamento da API durante as execuções:

| Métrica | Limite estabelecido | Justificativa |
| :--- | :--- | :--- |
| `http_req_duration` | `p(95)<1000` | Determina que 95% das requisições devem apresentar tempo de resposta inferior a 1.000 ms (1 segundo). |
| `http_req_failed` | `rate<0.01` | Estabelece que a taxa de requisições com falha deve permanecer abaixo de 1%. |
| `checks` | `rate>0.99` | Exige que mais de 99% das verificações realizadas sejam aprovadas. |

Os limites foram definidos como critérios experimentais para esta atividade. O tempo de resposta inferior a 1 segundo para o percentil 95 foi adotado como referência para identificar possíveis lentidões. A taxa de falhas inferior a 1% busca garantir que a API responda adequadamente à grande maioria das solicitações, enquanto o percentual superior a 99% nos *checks* verifica a consistência das respostas em relação às condições estabelecidas no script.

Esses critérios permitem avaliar tanto o desempenho quanto a confiabilidade das respostas durante os testes.

## 4. Resultados obtidos

### 4.1. Cenário 1 - Carga inicial

| Indicador | Resultado |
|---|---:|
| Duração | 30 segundos |
| Usuários virtuais (VUs) | 1 |
| Iterações concluídas | 30 |
| Requisições HTTP | 60 |
| Tempo médio de resposta | 4,86 ms |
| Percentil 95 (p95) | 9,16 ms |
| Requisições com falha | 0% |
| Verificações aprovadas | 100% |

### 4.2. Cenário 2 - Carga progressiva

| Indicador | Resultado |
|---|---:|
| Duração | 1 minuto e 30 segundos |
| Usuários virtuais máximos | 10 |
| Iterações concluídas | 514 |
| Requisições HTTP | 1.028 |
| Tempo médio de resposta | 3,42 ms |
| Percentil 95 (p95) | 6,38 ms |
| Requisições com falha | 0% |
| Verificações aprovadas | 100% |

## 5. Comparação dos cenários

| Indicador | Carga inicial | Carga progressiva |
|---|---:|---:|
| Requisições | 60 | 1.028 |
| VUs máximos | 1 | 10 |
| Tempo médio | 4,86 ms | 3,42 ms |
| p95 | 9,16 ms | 6,38 ms |
| Falhas | 0% | 0% |
| Checks aprovados | 100% | 100% |

## 6. Análise dos resultados

No cenário de carga inicial, a API recebeu 60 requisições HTTP durante 30 segundos, com apenas um usuário virtual. O tempo médio de resposta foi de 4,86 ms, enquanto o percentil 95 (p95) foi de 9,16 ms. Todas as verificações foram aprovadas e não foram registradas falhas.

No cenário de carga progressiva, a quantidade de usuários virtuais aumentou gradualmente até atingir 10 VUs. Durante os 90 segundos de execução, foram realizadas 1.028 requisições HTTP, com tempo médio de resposta de 3,42 ms e p95 de 6,38 ms. Novamente, todas as verificações foram aprovadas e a taxa de falhas permaneceu em 0%.

Comparando os dois cenários, observa-se que a API manteve tempos de resposta baixos mesmo com o aumento da carga. O segundo teste apresentou resultados menores de tempo médio e p95, apesar da maior quantidade de requisições. Entretanto, essa diferença não significa necessariamente que o aumento de usuários melhorou o desempenho, pois os resultados podem variar conforme as condições do ambiente durante cada execução.

Os dois cenários atenderam aos critérios estabelecidos: p95 inferior a 1000 ms, taxa de falhas inferior a 1% e checks aprovados acima de 99%. Portanto, nas condições avaliadas, a API apresentou comportamento estável e respostas consistentes.

## 7. Limitações

Os resultados representam o comportamento observado no ambiente local e não devem ser considerados uma garantia de desempenho em produção.

A análise pode ser influenciada pelas características do computador utilizado, recursos disponíveis, processos em execução, configuração do servidor e condições do ambiente de testes.

Além disso, a quantidade de usuários virtuais e o tempo de execução utilizados representam uma avaliação de carga controlada, não um teste de estresse ou uma determinação da capacidade máxima da API.

## 8. Monitoramento do ServeRest

Além dos testes de desempenho realizados com k6, foi utilizada a página /status do ServeRest para observar indicadores de funcionamento do servidor.

Na consulta realizada ao painel, foram apresentados indicadores de utilização de CPU, consumo de memória, uso de heap, média de carga, tempo gasto no Event Loop, tempo de resposta e requisições por segundo (RPS).

Como exemplo, no momento da consulta, o painel apresentou tempo de resposta de 4,02 ms e aproximadamente 9,91 requisições por segundo. Também indicou CPU em 0,0% e memória em 0,0 MB, enquanto alguns indicadores não apresentaram valores disponíveis.

Essas informações complementam os resultados obtidos com o k6, permitindo observar outros aspectos do funcionamento do servidor. Ressalta-se que os valores apresentados correspondem ao momento da consulta e não representam necessariamente todo o período de execução dos testes.

## 9. Conclusão

Os testes realizados com k6 permitiram avaliar o comportamento da API ServeRest em duas condições de carga: inicial e progressiva.

Em ambos os cenários, a API apresentou tempos de resposta baixos, não registrou falhas nas requisições e obteve 100% de aprovação nas verificações realizadas. Mesmo com o aumento de um para até 10 usuários virtuais, os critérios de desempenho definidos para a atividade continuaram sendo atendidos.

Conclui-se que, durante as execuções realizadas no ambiente local, a API ServeRest apresentou comportamento estável diante da carga aplicada. Os resultados demonstram que os endpoints `GET /produtos` e `GET /usuarios` responderam adequadamente às solicitações, atendendo aos limites experimentais estabelecidos.

Ressalta-se que os resultados são válidos para as condições específicas dos testes realizados e não permitem determinar a capacidade máxima da API ou garantir o mesmo desempenho em ambiente de produção.