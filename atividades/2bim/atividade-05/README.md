
# Atividade 05 - 2BIM: Testes de Desempenho com k6 no ServeRest

**Alany Moreira Mach - 25362055-2**  
**Samara Ostheimer Kubes - 24159205-2**

## Objetivo

Implementar testes de desempenho utilizando k6 e JavaScript para avaliar o comportamento da API ServeRest sob diferentes condições de carga.

Os testes verificam os endpoints GET /produtos e GET /usuarios, utilizando dois cenários: carga inicial e carga progressiva.

**Importante:** os testes devem ser executados exclusivamente em ambiente local, utilizando http://localhost:3000.

## 1. Pesquisa sobre k6

### 1.1. Finalidade dos testes de desempenho

Os testes de desempenho avaliam a velocidade, estabilidade e capacidade de processamento de um sistema. Os testes de carga verificam como a aplicação se comporta diante de diferentes quantidades de usuários e requisições simultâneas.

Já os testes funcionais verificam se as funcionalidades estão funcionando corretamente, enquanto os testes de carga avaliam o comportamento do sistema sob determinada utilização.

### 1.2. Usuários virtuais (VUs)

Usuários virtuais são usuários simulados pelo k6 que executam as operações definidas no script de teste.

Quanto maior a quantidade de VUs, maior poderá ser o volume de requisições simultâneas, dependendo do tempo de resposta e dos intervalos configurados.

### 1.3. Checks e Thresholds

Checks são verificações utilizadas para validar as respostas das requisições, como conferir se um endpoint retorna o código HTTP 200.

Thresholds são critérios de desempenho definidos para avaliar se os resultados estão dentro dos limites estabelecidos, como tempo de resposta e taxa de falhas.

### 1.4. Métricas do k6

- `http_req_duration`: tempo total de duração das requisições HTTP.
- `http_req_failed`: proporção de requisições consideradas malsucedidas.
- `http_reqs`: quantidade total de requisições e taxa de requisições por segundo.

### 1.5. Percentil 95 (p95)

O p95 representa o tempo de resposta abaixo do qual foram concluídas 95% das requisições.

Essa métrica permite identificar respostas mais lentas que podem não ser percebidas quando analisamos somente o tempo médio.

## 2. Preparação do ambiente

### Requisitos

- Node.js e NPM.
- k6 instalado.
- ServeRest executando localmente.

### Iniciar o ServeRest

```powershell
npx.cmd serverest@latest
```

A API deverá estar disponível em:

http://localhost:3000

Para verificar o funcionamento, acessar:

- http://localhost:3000/status
- http://localhost:3000/produtos
- http://localhost:3000/usuarios

### Instalar o k6 no Windows

```powershell
winget install k6 --source winget
```

Verificar a instalação:

```powershell
k6 version
```

## 3. Implementação

O script está localizado em:

`k6/desempenho.js`

Foram implementados os seguintes recursos:

- Requisições HTTP utilizando `http.get()`.
- Verificação de respostas com `check()`.
- Critérios de desempenho com `thresholds`.
- Configuração de usuários virtuais.
- Progressão de carga utilizando `stages`.
- URL configurável por variável de ambiente.
- Intervalo de um segundo entre as iterações.

### Cenário 1 - Carga inicial

- 1 usuário virtual.
- Duração de 30 segundos.
- Consultas aos endpoints de produtos e usuários.
- Verificação do código HTTP 200.

### Cenário 2 - Carga progressiva

- Início com 1 usuário virtual.
- Aumento para 5 usuários virtuais.
- Manutenção de 5 usuários virtuais.
- Aumento para 10 usuários virtuais.
- Manutenção de 10 usuários virtuais.
- Redução para 5 usuários virtuais.
- Redução gradual até zero usuários.
- Duração total: 90 segundos.

### Thresholds utilizados

| Métrica | Critério |
|---|---|
| http_req_duration | p95 < 1000 ms |
| http_req_failed | rate < 0.01 |
| checks | rate > 0.99 |

Os critérios foram definidos como referências experimentais para verificar o comportamento da API durante os testes.

## 4. Execução dos testes

Executar os comandos dentro da pasta `atividade-05`.

### Carga inicial

```powershell
$env:CENARIO = "carga-inicial"
k6 run --summary-export=.\evidencias\cenario-01.json .\k6\desempenho.js
```

### Carga progressiva

```powershell
$env:CENARIO = "carga-progressiva"
k6 run --summary-export=.\evidencias\cenario-02.json .\k6\desempenho.js
```

A URL também pode ser configurada por variável de ambiente:

```powershell
$env:BASE_URL = "http://localhost:3000"
```

Os arquivos JSON gerados armazenam os resultados agregados das execuções.

## 5. Resultados

Os resultados detalhados e a comparação entre os dois cenários estão documentados em [relatorio.md](relatorio.md).

As evidências das execuções estão armazenadas na pasta `evidencias/`.

## 6. Referências

- [Documentação oficial do k6](https://grafana.com/docs/k6/latest/)
- [Instalação do k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- [Execução de testes com k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- [Métricas do k6](https://grafana.com/docs/k6/latest/using-k6/metrics/)
- [Thresholds do k6](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Repositório oficial do ServeRest](https://github.com/ServeRest/ServeRest)
