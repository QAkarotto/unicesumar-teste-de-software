# Atividade 05 - Testes de Desempenho com k6

**Disciplina:** Projeto, Implementação e Teste de Software

**Integrantes:**
- Severo Junior
- Bruno Laroca Rosa

## Objetivo

Realizar testes de carga na API ServeRest utilizando k6, verificando os tempos de resposta e o comportamento do sistema com diferentes quantidades de usuários virtuais.

## Cenários implementados

1. Carga inicial com 1 usuário virtual durante 30 segundos.
2. Carga progressiva de 1 até 10 usuários virtuais, com redução gradual ao final.

Os testes realizam requisições GET para `/produtos` e `/usuarios`.

## Como executar

É necessário ter Node.js e k6 instalados.

Inicie o ServeRest localmente em um terminal:

```bash
npx serverest@latest
```

Confirme o funcionamento em:

`http://localhost:3000/status`

Em outro terminal, dentro da pasta da atividade, execute:

**Carga inicial:**

```bash
k6 run ./tests/carga-inicial.js
```

**Carga progressiva:**

```bash
k6 run ./tests/carga-progressiva.js
```

A URL da API pode ser configurada pela variável de ambiente `BASE_URL`, mantendo os testes restritos ao ServeRest local.

**Importante:** os testes de carga devem ser executados exclusivamente em ambiente local. Não execute contra a API pública.

## Organização

- `tests/`: scripts de carga inicial e progressiva.
- `pesquisa.md`: respostas sobre os conceitos do k6.
- `relatorio.md`: resultados e análise comparativa.
- `evidencias/`: capturas das execuções dos testes.

## Resultados

Os dois cenários foram executados com sucesso.

- Carga inicial: 60 requisições, sem falhas.
- Carga progressiva: 478 requisições, sem falhas.
- Checks: 100% aprovados nos dois cenários.
- Thresholds: aprovados nos dois cenários.

Os dados completos estão no relatório.