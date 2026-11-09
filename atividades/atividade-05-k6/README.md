
# Atividade 05 – Testes de Desempenho com k6 no ServeRest

**Disciplina:** Testes de Software – 2º Bimestre  
**Alunos:** Luiz Gustavo Becher Bolzani e Jefferson Luis Namur Junior

## Objetivo

Implementar e executar testes de carga utilizando Grafana k6 para avaliar o desempenho da API ServeRest em diferentes condições de utilização.

## Tecnologias utilizadas

- JavaScript
- Grafana k6
- Node.js e NPM
- ServeRest
- GitHub Codespaces

## Estrutura dos arquivos

- `pesquisa-k6.md`: respostas às cinco questões teóricas.
- `carga-inicial.js`: teste com 1 VU durante 30 segundos.
- `carga-progressiva.js`: teste com aumento gradual até 10 VUs.
- `resultado-inicial.json`: resultados do cenário inicial.
- `resultado-progressivo.json`: resultados do cenário progressivo.
- `relatorio.md`: análise comparativa e conclusão técnica.

## Preparação do ambiente

### 1. Iniciar o ServeRest localmente

Em um terminal, execute:

```bash
npx serverest@latest
```

A API deverá estar disponível em:

http://localhost:3000

Para verificar o funcionamento:

```bash
curl -I http://localhost:3000/status
```

### 2. Instalar o k6

Siga as instruções oficiais de instalação:

https://grafana.com/docs/k6/latest/set-up/install-k6/

Verifique a instalação:

```bash
k6 version
```

## Execução dos testes

Mantenha o ServeRest funcionando em um terminal e execute os comandos abaixo em outro terminal.

### Cenário 1 – Carga inicial

```bash
k6 run --summary-export=atividades/atividade-05-k6/resultado-inicial.json atividades/atividade-05-k6/carga-inicial.js
```

Configuração:
- 1 usuário virtual.
- Duração de 30 segundos.
- Requisições GET /produtos e GET /usuarios.

### Cenário 2 – Carga progressiva

```bash
k6 run --summary-export=atividades/atividade-05-k6/resultado-progressivo.json atividades/atividade-05-k6/carga-progressiva.js
```

Configuração:
- Aumento gradual até 10 usuários virtuais.
- Duração configurada de 70 segundos.
- Redução gradual da carga ao final.

## Configuração da URL

Os scripts utilizam a variável de ambiente BASE_URL.

Exemplo:

```bash
k6 run -e BASE_URL=http://localhost:3000 atividades/atividade-05-k6/carga-inicial.js
```

O endereço padrão é http://localhost:3000.

## Critérios de desempenho

- p95 inferior a 500 ms.
- Taxa de falhas HTTP inferior a 1%.
- Checks verificando respostas HTTP 200.

## Resultados

Os dois cenários foram executados com sucesso.

- Carga inicial: 60 requisições, p95 de 3,09 ms e 0% de falhas.
- Carga progressiva: 620 requisições, p95 de 3,13 ms e 0% de falhas.

Todos os checks e thresholds foram atendidos.

Consulte o arquivo `relatorio.md` para a análise completa.

## Importante

Os testes de carga devem ser executados exclusivamente contra uma instância local do ServeRest.

Não execute testes de desempenho contra https://serverest.dev.

## Referências

- https://grafana.com/docs/k6/latest/
- https://github.com/ServeRest/ServeRest
