# Atividade 05 – Testes de Desempenho com k6

## 1. Sobre o projeto

Este projeto foi desenvolvido como parte da atividade de testes de software da Unicesumar, com o objetivo de aplicar conceitos de testes de desempenho utilizando a ferramenta k6 na API ServeRest.

Foram implementados dois cenários de teste para avaliar o comportamento dos endpoints de produtos e usuários, considerando diferentes quantidades de usuários virtuais e períodos de execução.

## 2. Tecnologias utilizadas

- JavaScript
- Node.js
- NPM
- ServeRest
- k6 (Grafana)

## 3. Estrutura do projeto

```text
.
├── tests/
│   └── performance/
│       ├── carga-inicial.js
│       └── carga-progressiva.js
├── resultados/
├── evidencias/
│   ├── cenario1-carga-inicial.png
│   └── cenario2-carga-progressiva.png
├── PESQUISAATIV5.MD
├── RELATORIOATIV5.MD
└── READMEATIV5.MD
```

## 4. Preparação do ambiente

### 4.1. Iniciar o ServeRest

Para executar a API localmente, é necessário ter o Node.js e o NPM instalados.

No terminal, execute:

```bash
npx serverest@latest
```

Após iniciar a aplicação, a API estará disponível em:

```text
http://localhost:3000
```

Para verificar se os endpoints estão respondendo, acesse:

```text
http://localhost:3000/produtos
http://localhost:3000/usuarios
```

Ambos devem retornar uma resposta em formato JSON.

**Importante:** mantenha o ServeRest em execução durante os testes.

### 4.2. Instalar e verificar o k6

O k6 pode ser instalado seguindo as instruções da documentação oficial:

https://grafana.com/docs/k6/latest/set-up/install-k6/

Para verificar se a instalação foi realizada corretamente, execute:

```bash
k6 version
```

Se a versão instalada for exibida, a ferramenta está pronta para uso.

## 5. Cenários implementados

### 5.1. Carga inicial

Arquivo: `tests/performance/carga-inicial.js`

O primeiro cenário utiliza um usuário virtual durante 30 segundos.

São realizadas requisições aos seguintes endpoints:

- `GET /produtos`
- `GET /usuarios`

Os dois endpoints possuem verificações para confirmar o retorno do status HTTP 200.

Thresholds configurados:

- Percentil 95 do tempo de resposta inferior a 1000 ms.
- Taxa de falhas HTTP inferior a 1%.

Para executar:

```bash
k6 run tests/performance/carga-inicial.js
```

### 5.2. Carga progressiva

Arquivo: `tests/performance/carga-progressiva.js`

O segundo cenário aumenta gradualmente a quantidade de usuários virtuais, seguindo as etapas:

- 1 usuário virtual durante 10 segundos.
- Aumento para 5 usuários durante 20 segundos.
- Aumento para 10 usuários durante 20 segundos.
- Redução para 5 usuários durante 10 segundos.
- Redução para 0 usuários durante 10 segundos.

Assim como no primeiro cenário, são realizadas requisições aos endpoints de produtos e usuários.

Thresholds configurados:

- Percentil 95 do tempo de resposta inferior a 1500 ms.
- Taxa de falhas HTTP inferior a 1%.

Para executar:

```bash
k6 run tests/performance/carga-progressiva.js
```

## 6. Resultados obtidos

Os dois cenários foram executados localmente e apresentaram os seguintes resultados:

| Indicador | Carga inicial | Carga progressiva |
|---|---:|---:|
| VUs máximos | 1 | 10 |
| Duração | 30 segundos | 70 segundos |
| Total de requisições | 60 | 620 |
| Requisições por segundo | 1,99 | 8,83 |
| Tempo médio | 1,11 ms | 1,08 ms |
| p95 | 1,63 ms | 2,09 ms |
| Falhas HTTP | 0% | 0% |
| Checks aprovados | 100% | 100% |

Os dois cenários tiveram todos os checks aprovados e atenderam aos thresholds configurados.

Mesmo com o aumento da carga, os tempos de resposta permaneceram baixos nas condições avaliadas.

Para uma análise mais detalhada, consulte o arquivo `RELATORIOATIV5.MD`.

## 7. Pesquisa e documentação

O arquivo `PESQUISAATIV5.MD` apresenta os conceitos teóricos relacionados aos testes de desempenho, incluindo:

- Objetivo dos testes de desempenho.
- Diferenças entre testes funcionais e testes de carga.
- Conceito de usuários virtuais (VUs).
- Diferença entre checks e thresholds.
- Principais métricas do k6.
- Importância do percentil 95 (p95).

## 8. Evidências

Os resultados das execuções devem ser registrados por meio de capturas de tela e armazenados na pasta `evidencias/`.

- `cenario1-carga-inicial.png`
- `cenario2-carga-progressiva.png`

## 9. Observações

Os testes foram realizados utilizando o ambiente local do ServeRest, com o endereço `http://localhost:3000`.

Os resultados apresentados correspondem às execuções realizadas durante o desenvolvimento da atividade. Eles não representam uma avaliação dos limites máximos da API em ambiente de produção.

## 10. Referências

- Grafana Labs. **Grafana k6 Documentation**. Disponível em: https://grafana.com/docs/k6/latest/. Acesso em: 12 nov. 2026.
- ServeRest. **Documentação da API**. Disponível em: https://serverest.dev/. Acesso em: 12 nov. 2026.

