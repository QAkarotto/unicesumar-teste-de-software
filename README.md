# unicesumar-teste-de-software
Repositório utilizado na disciplina de Projeto, Implementação e Teste de Software do curso de Engenharia de Software da Unicesumar Ponta Grossa

# Materiais

- ## [Mind Map](https://app.xmind.com/share/0ThrBL00) da Disciplina

# Materiais Complementares
- ## Curso de Git e GitHub do Goku
    - [Instruções para configuração de ambiente e atividades das aulas](https://booming-blouse-e16.notion.site/390cf9ad8d508083ad3de85713c19a4a?v=390cf9ad8d5080349a8b000ccb843083&pvs=143)
    - [Aulas gravadas](https://drive.google.com/drive/folders/1jcjCtkjueHFcE28LDyLnI9Dx-F3WBIlF?usp=sharing)
    - [Formulário para ter acesso ao repositório do curso](https://docs.google.com/forms/d/e/1FAIpQLSetBGH_UzZEZFoJuQERJhLkpFImu__nDS-dW8UZHjtJruDnbw/viewform?usp=sharing&ouid=115907476640584517407)

- ## Curso de Testes de API do Goku
    - [Aulas gravadas](https://drive.google.com/drive/folders/18D9ZJ1F-pVPy0S_DndA2mLCTLe7aBtkX?usp=sharing)
    - [Mind Map utilizado no treinamento](https://app.xmind.com/share/FGhdypvt) - senha: dojodoqame

## Manifesto Oficial

### Lista de alunos que concordam que o Professor Goku é o melhor professor do universo
Adicione seu nome, turma (ESOFT6S) e ano (2026) em ordem alfabética:

1. Aluno Exemplo (ESOFT6S - 2026)
2. 

## Atividade 04 — Automação de Testes E2E com Playwright

Esta atividade implementa três jornadas E2E para o frontend do ServeRest (`https://front.serverest.dev`): cadastro e autenticação de cliente, cadastro de produto como administrador e tentativa de login inválida.

### Instalação e execução

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Use `npm test` para executar todos os testes automatizados e `npm run test:api` para executar somente os testes de API. Para usar outro frontend, defina `SERVEREST_FRONT_URL`; a API padrão é `https://serverest.dev`.

A fixture `tests/fixtures/admin.fixture.ts` prepara um administrador pela API e fornece uma página autenticada para o cenário de produto. As ações de cadastro e login dos cenários ocorrem pela interface, com seletores `data-testid` e dados únicos gerados pelo Faker.

### Evidência

O resultado da execução dos três testes está em [`evidencias/atividade-04-e2e.txt`](evidencias/atividade-04-e2e.txt).
