# Instruções de Execução - Atividade 05: Testes de Desempenho com k6

## 1. Objetivo

Este documento apresenta as instruções necessárias para configurar o ambiente e executar os testes de desempenho desenvolvidos na Atividade 05, utilizando a ferramenta Grafana k6 e a API ServeRest.

Foram implementados dois cenários de teste:

- **Cenário 1 – Carga inicial:** execução com 1 usuário virtual durante 30 segundos.
- **Cenário 2 – Carga progressiva:** aumento gradual da quantidade de usuários virtuais, iniciando com 1, chegando a 5 e posteriormente a 10 usuários, seguido pela redução gradual da carga.

Os testes avaliam os endpoints `GET /produtos` e `GET /usuarios` da API ServeRest.

**Importante:** os testes de desempenho devem ser executados exclusivamente em ambiente local. Não execute os scripts contra `https://serverest.dev`.

---
## 2. Pré-requisitos

### 2.1. Verificar o Node.js

Abra o terminal do VS Code e execute:

```
node --version
```

Para verificar o npm:

```
npm --version
```

### 2.2. Verificar o k6
Para instalar o K6 versão windows, execute o comando abaixo:

```
winget install k6 --source winget
```

E então para verificar se a instalação deu certo, execute:

```
k6 version
```

Caso a instalação esteja funcionando corretamente, será apresentada a versão instalada do k6.

---

## 3. Iniciar a API ServeRest localmente

Para executar os testes, primeiro é necessário iniciar a API ServeRest em ambiente local.

Na raiz do projeto, abra um terminal e execute:

```
npx serverest@latest
```

Aguarde a inicialização do servidor.

**Importante:** Mantenha esse terminal aberto durante toda a execução dos testes.

---

## 4. Preparar a pasta de evidências

Antes de executar os testes, verifique se a pasta `evidencias` existe na raiz do projeto.

Caso ainda não exista, execute:

```
New-Item -ItemType Directory -Force -Path evidencias
```

Essa pasta será utilizada para armazenar os arquivos JSON gerados automaticamente pelo k6.

---

## 5. Executar os testes de desempenho

**Importante:** Com o ServeRest em execução, abra um segundo terminal no VS Code. Certifique-se de que o terminal esteja localizado na raiz do repositório.

### 5.1. Cenário 1 – Carga inicial

O primeiro cenário realiza testes com as seguintes configurações:

- 1 usuário virtual.
- Duração de 30 segundos.
- Requisições GET para `/produtos` e `/usuarios`.
- Verificação do código HTTP 200 nas duas requisições.

Para executar o teste, utilize:

```
k6 run -e BASE_URL=http://localhost:3000 --summary-export=evidencias/carga-inicial.json tests/k6/carga-inicial.js
```

Durante a execução, o k6 apresentará informações sobre as requisições, verificações e métricas de desempenho.

Ao finalizar, os resultados resumidos serão exportados para:

```
evidencias/carga-inicial.json
```

### 5.2. Cenário 2 – Carga progressiva

O segundo cenário aumenta gradualmente a quantidade de usuários virtuais.

As etapas configuradas são:

| Etapa | Duração | Quantidade de VUs |
|---|---|---|
| 1 | 10 segundos | 1 |
| 2 | 15 segundos | 5 |
| 3 | 15 segundos | 10 |
| 4 | 10 segundos | 5 |
| 5 | 10 segundos | 0 |

A duração total do teste é de 60 segundos.

Para executar o cenário, utilize:

```
k6 run -e BASE_URL=http://localhost:3000 --summary-export=evidencias/carga-progressiva.json tests/k6/carga-progressiva.js
```

Ao finalizar, os resultados serão exportados para:

```
evidencias/carga-progressiva.json
```
---

## 6. Consultar os resultados

Após executar os dois cenários, é possível consultar os arquivos JSON gerados pelo k6 utilizando o terminal.

### Resultado do cenário 1:

```
Get-Content evidencias/carga-inicial.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Resultado do cenário 2:

```
Get-Content evidencias/carga-progressiva.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```
---