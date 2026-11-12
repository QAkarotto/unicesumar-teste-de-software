# Atividade 05 – Testes de Desempenho com k6

## 1. Objetivo

Realizar testes de desempenho na API ServeRest utilizando a ferramenta k6, analisando o comportamento dos endpoints `/produtos` e `/usuarios` em diferentes condições de carga.

A atividade contempla dois cenários:

- **Cenário 1 – Carga inicial:** execução com 1 usuário virtual durante 30 segundos.
- **Cenário 2 – Carga progressiva:** aumento gradual da quantidade de usuários virtuais, chegando a 10 VUs e reduzindo a carga ao final.

## 2. Tecnologias utilizadas

- **k6:** ferramenta utilizada para executar os testes de desempenho.
- **ServeRest:** API utilizada como aplicação de teste.
- **JavaScript:** linguagem utilizada na implementação dos scripts.
- **Node.js e NPM:** utilizados para iniciar o ServeRest localmente.

## 3. Estrutura do projeto

```text
unicesumar-teste-de-software/
│
├── tests/
│   └── performance/
│       ├── carga-inicial.js
│       └── carga-progressiva.js
│
├── resultados/
│
├── evidencias/
│
├── PESQUISAATIV5.MD
├── RELATORIOATIV5.MD
└── READMEATIV5.MD
```

## 4. Preparação do ambiente

Os testes devem ser executados exclusivamente contra uma instância local do ServeRest.

### 4.1. Iniciar o ServeRest

Com o Node.js e o NPM instalados, execute:

```bash
npx serverest@latest
```

Aguarde a inicialização da aplicação.

### 4.2. Verificar a API

Com o ServeRest em execução, acesse:

```text
http://localhost:3000
```

Também verifique o endpoint de status:

```text
http://localhost:3000/status
```

A API deverá estar disponível antes da execução dos testes.

### 4.3. Instalar o k6

Instale o k6 seguindo as instruções oficiais:

https://grafana.com/docs/k6/latest/set-up/install-k6/

Verifique a instalação com:

```bash
k6 version
```

## 5. Execução dos testes

Com o ServeRest em execução, abra outro terminal na raiz do repositório.

### 5.1. Cenário 1 – Carga inicial

Execute:

```bash
k6 run tests/performance/carga-inicial.js
```

Esse cenário utiliza 1 usuário virtual durante 30 segundos, realizando requisições aos endpoints `/produtos` e `/usuarios`.

O teste verifica se ambos retornam o código HTTP 200 e avalia os limites de desempenho configurados no script.

### 5.2. Cenário 2 – Carga progressiva

Execute:

```bash
k6 run tests/performance/carga-progressiva.js
```

Esse cenário aumenta gradualmente a quantidade de usuários virtuais até atingir 10 VUs. Ao final, a carga é reduzida progressivamente.

O objetivo é observar como o tempo de resposta e a taxa de falhas se comportam conforme aumenta a concorrência.

## 6. Métricas analisadas

Durante os testes, serão observadas as seguintes métricas:

- **VUs:** quantidade de usuários virtuais ativos.
- **Duração:** tempo total de execução.
- **http_reqs:** quantidade total de requisições realizadas.
- **Req/s:** média de requisições por segundo.
- **http_req_duration:** tempo de resposta das requisições.
- **p95:** percentil 95 do tempo de resposta.
- **http_req_failed:** proporção de requisições malsucedidas.
- **Checks:** percentual de verificações aprovadas.

Os resultados serão utilizados para comparar os dois cenários e identificar possíveis alterações no comportamento da API.

## 7. Resultados e evidências

Os resultados reais das execuções serão registrados em `RELATORIOATIV5.MD`.

As capturas de tela dos testes serão armazenadas no diretório `evidencias/`, enquanto eventuais arquivos de saída serão armazenados em `resultados/`.

## 8. Observações

- Os testes devem ser executados somente contra o ServeRest local.
- Não utilizar a API pública `serverest.dev` para os testes de desempenho.
- Os resultados devem corresponder às execuções reais.
- Os limites definidos nos scripts representam critérios de aprovação estabelecidos para a atividade, não resultados previamente medidos.

## 9. Documentação oficial

- k6: https://grafana.com/docs/k6/latest/
- ServeRest: https://github.com/ServeRest/ServeRest