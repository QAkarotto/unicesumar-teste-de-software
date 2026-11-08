# Atividade 05 — Testes de Desempenho com k6 no ServeRest

- **Disciplina:** Teste de Software
- **Curso:** Engenharia de Software — Unicesumar
- **Aluno:** Luiz Kaike A.F e Adriano Linpias Roca
- **Ferramenta:** Grafana k6 2.3.0
- **API:** ServeRest v3.2.2

---

## 1. Pesquisa sobre k6

### 1.1 Qual é a finalidade dos testes de desempenho e como os testes de carga se diferenciam dos testes funcionais?

Os testes de desempenho verificam como um sistema se comporta em relação à velocidade, estabilidade, capacidade de processamento e tempo de resposta.

Os testes de carga avaliam o comportamento do sistema quando diferentes quantidades de usuários realizam operações simultaneamente, permitindo identificar possíveis lentidões e limitações.

Já os testes funcionais verificam se as funcionalidades estão funcionando corretamente, conforme os requisitos definidos.

Portanto, os testes funcionais verificam se o sistema faz o que deveria, enquanto os testes de desempenho avaliam como ele se comporta durante a utilização.

### 1.2 O que são usuários virtuais (VUs) e como eles influenciam a carga gerada?

Os usuários virtuais (VUs) representam usuários simulados pelo k6 que executam operações no sistema.

Cada VU executa as instruções definidas no script de teste, realizando requisições à API.

Quanto maior a quantidade de usuários virtuais, maior poderá ser a quantidade de requisições simultâneas, aumentando a carga sobre o sistema.

### 1.3 Qual é a diferença entre checks e thresholds no k6?

Os `checks` verificam se determinada condição foi atendida durante a execução dos testes, como validar se uma requisição retornou o código HTTP 200.

Os `thresholds` estabelecem critérios de desempenho que devem ser respeitados, como limitar o tempo de resposta ou a taxa de falhas.

Portanto, os checks verificam os resultados das operações, enquanto os thresholds avaliam se o desempenho atingiu os critérios estabelecidos.

### 1.4 O que representam as métricas http_req_duration, http_req_failed e http_reqs?

- **http_req_duration:** representa o tempo total gasto na requisição HTTP, considerando o envio, a espera pela resposta e o recebimento dos dados.
- **http_req_failed:** representa a taxa de requisições que falharam durante a execução.
- **http_reqs:** representa a quantidade total de requisições HTTP realizadas pelo teste.

Essas métricas ajudam a identificar problemas de velocidade, falhas e volume de utilização da API.

### 1.5 Qual é a importância do percentil 95 (p95) na análise dos tempos de resposta?

O percentil 95 (p95) representa o tempo de resposta abaixo ou igual ao qual 95% das requisições foram concluídas.

Por exemplo, se o p95 for de 500 ms, significa que 95% das requisições foram concluídas em até 500 milissegundos, enquanto os outros 5% demoraram mais.

Essa métrica é importante porque permite avaliar o comportamento da maioria das requisições, considerando também aquelas que apresentam tempos de resposta mais elevados.

---

## 2. Preparação do ambiente

Para realizar os testes, foi utilizado o ambiente local do ServeRest, conforme a orientação da atividade.

### 2.1 Ferramentas utilizadas

| Ferramenta | Versão |
|---|---|
| Node.js | 24.14.1 |
| npm | 11.11.0 |
| Grafana k6 | 2.3.0 |
| ServeRest | 3.2.2 |
| Sistema operacional | Windows |

### 2.2 Inicialização do ServeRest

O ServeRest foi iniciado utilizando o comando:

```powershell
npx serverest@latest
```

A API ficou disponível no endereço:

```text
http://localhost:3000
```

A página de monitoramento foi consultada em:

```text
http://localhost:3000/status
```

Também foram realizadas requisições para verificar o funcionamento dos endpoints:

- GET `/produtos`
- GET `/usuarios`

Ambos retornaram HTTP 200, confirmando o funcionamento da API local.

**Importante:** nenhum teste de desempenho foi realizado contra o ambiente público `serverest.dev`.

---

## 3. Implementação dos testes

Foram criados dois scripts utilizando JavaScript e k6, armazenados na pasta `tests/performance/`.

### 3.1 Estrutura dos arquivos

```text
tests/
└── performance/
    ├── carga-inicial.js
    └── carga-progressiva.js
```

### 3.2 Configuração da URL

Os scripts utilizam a variável de ambiente `BASE_URL`, permitindo configurar o endereço da API sem modificar diretamente a lógica dos testes.

```javascript
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
```

Dessa forma, os testes podem ser executados utilizando o endereço local do ServeRest.

### 3.3 Cenário 1 — Carga inicial

O primeiro cenário foi configurado com:

- 1 usuário virtual;
- duração de 30 segundos;
- requisições aos endpoints `/produtos` e `/usuarios`;
- validação dos códigos HTTP 200;
- pausa de 1 segundo entre as iterações.

O objetivo foi verificar o comportamento inicial da API com uma carga constante e reduzida.

### 3.4 Cenário 2 — Carga progressiva

O segundo cenário utiliza stages para aumentar e reduzir gradualmente a quantidade de usuários virtuais.

| Etapa | Duração | Usuários virtuais |
|---|---:|---:|
| Inicial | 15 segundos | 1 |
| Crescimento | 15 segundos | 5 |
| Aumento | 15 segundos | 10 |
| Redução | 15 segundos | 0 |

O teste possui duração total de 60 segundos e permite observar o comportamento da API diante do aumento gradual de requisições.

### 3.5 Checks e thresholds

Foram implementados checks para verificar se os endpoints retornaram HTTP 200.

Também foram definidos os seguintes thresholds:

| Métrica | Critério | Justificativa |
|---|---|---|
| http_req_duration | p(95)<1000 | Espera-se que 95% das requisições sejam concluídas em menos de 1 segundo. |
| http_req_failed | rate<0.01 | Limita a taxa de falhas a menos de 1%. |
| checks | rate>0.99 | Exige aprovação superior a 99% das verificações. |

Esses limites foram definidos como critérios de avaliação para a atividade, considerando a execução local e o volume controlado de requisições. Não representam níveis de serviço oficiais da API.

---

## 4. Execução e análise dos resultados

Os dois cenários foram executados separadamente, utilizando o ServeRest local.

### 4.1 Resultado do cenário 1 — Carga inicial

Comando utilizado:

```powershell
k6 run -e BASE_URL=http://localhost:3000 tests/performance/carga-inicial.js
```

Resultados obtidos:

| Métrica | Resultado |
|---|---:|
| Usuários virtuais | 1 |
| Duração | 30 segundos |
| Iterações | 30 |
| Total de requisições | 60 |
| Requisições por segundo | 1,99 |
| Tempo médio de resposta | 1,31 ms |
| Tempo mínimo | 0 ms (conforme saída do k6) |
| Tempo máximo | 6,39 ms |
| Percentil 95 (p95) | 2,09 ms |
| Taxa de falhas | 0,00% |
| Checks aprovados | 60 de 60 (100%) |

**Resultado dos checks:** as verificações dos endpoints `/produtos` e `/usuarios` foram aprovadas.

**Resultado dos thresholds:** todos foram aprovados.

### 4.2 Resultado do cenário 2 — Carga progressiva

Comando utilizado:

```powershell
k6 run -e BASE_URL=http://localhost:3000 tests/performance/carga-progressiva.js
```

Resultados obtidos:

| Métrica | Resultado |
|---|---:|
| Usuários virtuais máximos | 10 |
| Duração | 60 segundos |
| Iterações | 243 |
| Total de requisições | 486 |
| Requisições por segundo | 8,07 |
| Tempo médio de resposta | 1,13 ms |
| Tempo mínimo | 0 ms (conforme saída do k6) |
| Tempo máximo | 39,4 ms |
| Percentil 95 (p95) | 1,83 ms |
| Taxa de falhas | 0,00% |
| Checks aprovados | 486 de 486 (100%) |

**Resultado dos checks:** as verificações dos endpoints `/produtos` e `/usuarios` foram aprovadas.

**Resultado dos thresholds:** todos foram aprovados.

### 4.3 Comparação dos resultados

| Métrica | Carga inicial | Carga progressiva |
|---|---:|---:|
| Usuários virtuais máximos | 1 | 10 |
| Duração | 30 s | 60 s |
| Requisições | 60 | 486 |
| Requisições/s | 1,99 | 8,07 |
| Tempo médio | 1,31 ms | 1,13 ms |
| Tempo mínimo | 0 ms | 0 ms |
| Tempo máximo | 6,39 ms | 39,4 ms |
| p95 | 2,09 ms | 1,83 ms |
| Taxa de falhas | 0,00% | 0,00% |
| Checks aprovados | 100% | 100% |
| Thresholds | Aprovados | Aprovados |

### 4.4 Análise dos resultados

Comparando os dois cenários, foi possível observar que o aumento da quantidade de usuários virtuais elevou a taxa de requisições de aproximadamente 1,99 para 8,07 por segundo.

Mesmo com esse aumento, o tempo médio de resposta permaneceu baixo, passando de 1,31 ms para 1,13 ms.

O percentil 95 também apresentou uma pequena redução, passando de 2,09 ms para 1,83 ms. Apesar disso, o tempo máximo registrado foi maior no cenário progressivo, chegando a 39,4 ms.

Também não foram registradas requisições com falha e todos os checks foram aprovados.

Com esses resultados, podemos observar que a API ServeRest conseguiu atender ao aumento de carga nas condições utilizadas, sem apresentar degradação significativa no tempo de resposta.

---

## 5. Limitações dos testes

Apesar dos resultados positivos, alguns fatores precisam ser considerados na interpretação dos dados:

- Os testes foram realizados localmente, portanto, os resultados dependem dos recursos de hardware e software disponíveis no computador.
- A base de dados utilizada possuía apenas dois produtos e um usuário, não representando necessariamente um ambiente real com grande volume de informações.
- O teste progressivo utilizou no máximo 10 usuários virtuais, não sendo suficiente para determinar o limite máximo de capacidade da API.
- Os resultados representam as condições específicas do experimento e não garantem o mesmo comportamento em um ambiente de produção.
- A execução local reduz a influência de fatores externos, como latência de rede, mas não elimina outras variáveis do ambiente.

---

## 6. Conclusão

A atividade permitiu compreender na prática a utilização do k6 para realizar testes de desempenho em APIs.

Com os dois cenários implementados, foi possível observar o comportamento do ServeRest com diferentes quantidades de usuários virtuais e analisar métricas como tempo médio de resposta, p95, quantidade de requisições e taxa de falhas.

Os resultados demonstraram que a API manteve um comportamento estável durante os testes realizados, sem falhas e com todos os critérios de desempenho aprovados.

Concluo que os testes de desempenho são importantes para identificar possíveis limitações de um sistema e avaliar seu comportamento diante de diferentes níveis de utilização. Também foi possível compreender a importância de utilizar métricas e critérios objetivos para interpretar os resultados.

---

## 7. Evidências

As evidências das execuções estão armazenadas na seguinte estrutura:

```text
evidencias/
└── atividade-05/
    ├── evidencia-ambiente-local.png
    ├── evidencia-carga-inicial_01.PNG
    ├── evidencia-carga-inicial_02.PNG
    ├── evidencia-carga-progressiva_01.PNG
    ├── evidencia-carga-progressiva_02.PNG
    ├── preparação_do_ambiente_Produtos.PNG
    ├── preparação_do_ambiente_Status.PNG
    ├── preparação_do_ambiente_Usuarios.PNG
    ├── Primeiro cenário_carga-inicial_terminal_01.PNG
    ├── Primeiro cenário_carga-inicial_terminal_02.PNG
    ├── Segundo cenário_carga-progressiva_terminal_01.PNG
    └── Segundo cenário_carga-progressiva_terminal_03.PNG
```

As capturas demonstram:

1. A inicialização do ServeRest e a verificação do ambiente local.
2. O funcionamento dos endpoints de produtos e usuários.
3. A execução e os resultados do cenário de carga inicial.
4. A execução e os resultados do cenário de carga progressiva.

---

## 8. Referências

- GRAFANA LABS. **Documentação oficial do k6**. Disponível em: https://grafana.com/docs/k6/latest/
- GRAFANA LABS. **Running k6**. Disponível em: https://grafana.com/docs/k6/latest/get-started/running-k6/
- GRAFANA LABS. **Checks**. Disponível em: https://grafana.com/docs/k6/latest/using-k6/checks/
- GRAFANA LABS. **Thresholds**. Disponível em: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- SERVEREST. **Repositório oficial**. Disponível em: https://github.com/ServeRest/ServeRest
- SERVEREST. **Documentação da API**. Disponível em: https://serverest.dev/