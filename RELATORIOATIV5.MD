# RELATÓRIO – ATIVIDADE 05
## Testes de Desempenho com k6 no ServeRest

### 1. Introdução

Este trabalho apresenta a implementação de testes de desempenho na API ServeRest utilizando a ferramenta k6.

Foram desenvolvidos dois cenários de teste com o objetivo de avaliar o comportamento dos endpoints `/produtos` e `/usuarios` em diferentes condições de carga.

Os testes foram planejados para observar métricas como tempo de resposta, quantidade de requisições, taxa de falhas e percentil 95 (p95).

### 2. Ambiente de testes

| Item | Configuração |
|---|---|
| Ferramenta de testes | k6 |
| API | ServeRest |
| Ambiente | Local |
| Endpoints | GET /produtos e GET /usuarios |
| Linguagem | JavaScript |
| Endereço-base | http://localhost:3000 |

### 3. Cenário 1 – Carga inicial

O primeiro cenário foi configurado com 1 usuário virtual durante 30 segundos.

Durante a execução, são realizadas requisições aos endpoints `/produtos` e `/usuarios`, verificando se ambos retornam o código HTTP 200.

Também foram definidos os seguintes thresholds:

- p95 inferior a 1000 ms.
- Taxa de requisições malsucedidas inferior a 1%.

#### 3.1. Resultados

**A preencher após a execução do teste.**

| Métrica | Resultado |
|---|---|
| Usuários virtuais | 1 |
| Duração | 30 segundos |
| Total de requisições | A preencher |
| Requisições por segundo | A preencher |
| Tempo médio de resposta | A preencher |
| p95 | A preencher |
| Taxa de falhas | A preencher |
| Checks aprovados | A preencher |
| Thresholds | A preencher |

#### 3.2. Evidência

Inserir aqui a captura de tela da execução do cenário 1.

### 4. Cenário 2 – Carga progressiva

O segundo cenário foi configurado para aumentar gradualmente a quantidade de usuários virtuais, passando por 1, 5 e 10 VUs. Após atingir o máximo de usuários, a carga é reduzida gradualmente até chegar a zero.

A duração total planejada é de 70 segundos.

Os endpoints `/produtos` e `/usuarios` continuam sendo consultados durante a execução, com verificações de status HTTP 200.

Os thresholds definidos foram:

- p95 inferior a 1500 ms.
- Taxa de requisições malsucedidas inferior a 1%.

#### 4.1. Resultados

**A preencher após a execução do teste.**

| Métrica | Resultado |
|---|---|
| Máximo de usuários virtuais | 10 |
| Duração | 70 segundos |
| Total de requisições | A preencher |
| Requisições por segundo | A preencher |
| Tempo médio de resposta | A preencher |
| p95 | A preencher |
| Taxa de falhas | A preencher |
| Checks aprovados | A preencher |
| Thresholds | A preencher |

#### 4.2. Evidência

Inserir aqui a captura de tela da execução do cenário 2.

### 5. Comparação dos cenários

**A preencher após a execução dos dois testes.**

A comparação deverá considerar:

- Diferenças na quantidade total de requisições.
- Variação no tempo médio de resposta.
- Comportamento do p95.
- Alterações na taxa de falhas.
- Aprovação ou reprovação dos thresholds.

### 6. Análise dos resultados

Após a execução, será analisado se o aumento da quantidade de usuários virtuais provocou alterações no desempenho da API.

Também serão observados possíveis aumentos no tempo de resposta, ocorrência de falhas e mudanças na capacidade de processamento das requisições.

### 7. Limitações dos testes

Os testes foram planejados para um ambiente local, com até 10 usuários virtuais. Portanto, os resultados representam o comportamento da API nas condições específicas utilizadas e não devem ser considerados uma representação de seu desempenho em produção.

Além disso, o desempenho observado pode variar conforme os recursos disponíveis no computador, as condições do ambiente e outros processos em execução.

### 8. Conclusão

**A preencher após a análise dos resultados reais.**

A conclusão deverá apresentar o comportamento observado nos dois cenários, indicando se os critérios de desempenho estabelecidos foram atendidos e quais diferenças foram identificadas entre a carga inicial e a carga progressiva.