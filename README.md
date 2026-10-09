# unicesumar-teste-de-software
Repositório utilizado na disciplina de Projeto, Implementação e Teste de Software do curso de Engenharia de Software da Unicesumar Ponta Grossa

## Atividade 01 — 2º bimestre: Playwright com TypeScript

Pré-requisitos: Node.js 22 ou superior, npm e acesso à internet. Os testes
fazem requisições reais à API pública do [ServeRest](https://serverest.dev/).

```sh
npm install
npx playwright test
```

Executar somente a API e conferir a tipagem:

```sh
npm run test:api
# equivalente: npx playwright test --project=api
npm run typecheck
```

### Organização e cenários

```text
tests/
├── api/
│   ├── fixtures.ts
│   └── serverest.spec.ts
└── web/
    └── README.md
```

Os 9 testes validam status HTTP e corpo da resposta: cadastro com persistência,
consulta por email, atualização, exclusão, email duplicado, email inválido,
nome obrigatório, login válido e senha incorreta. A regra de negócio de email
único também confirma que a tentativa duplicada não altera o registro original.
Atualização e exclusão são verificadas por consultas posteriores.

Cada teste cria seus próprios dados com email único e a fixture remove os
usuários criados ao terminar. Não são utilizadas contas pré-existentes.
Falhas de limpeza também fazem a execução falhar. A disponibilidade e o tempo
de resposta da API pública podem afetar a execução; não há retries que ocultem falhas.

A configuração separa os projetos `api` e `web`. API não requer navegador instalado.
Para futuros testes Web, adicione `*.spec.ts` em `tests/web` e execute:

```sh
npx playwright install chromium
npm run test:web
```

Sem testes Web implementados, `test:web` informa `No tests found`.
As URLs podem ser alteradas por `API_BASE_URL` e `WEB_BASE_URL`. Exemplo no PowerShell:

```powershell
$env:API_BASE_URL = 'https://serverest.dev'
npm run test:api
```

### Relatório e evidência

Depois da execução, `npm run report` abre o relatório HTML em `playwright-report`.
Relatórios locais e traces de falha não são versionados. A evidência desta entrega
está em [evidencias/execucao-api.txt](evidencias/execucao-api.txt).

Referências: [testes de API](https://playwright.dev/docs/api-testing) e
[configuração do Playwright](https://playwright.dev/docs/test-configuration).

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
