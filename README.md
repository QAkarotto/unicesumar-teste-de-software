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

# Testes automatizados com Playwright + TypeScript

Projeto de testes com Playwright separado em **API** e **Web**.
A API testada é a [ServeRest](https://serverest.dev).

### Estrutura

```
tests/
├── api/    # testes de API (usuários, login, produtos)
└── web/    # estrutura preparada para testes Web futuros
playwright.config.ts   # projetos "api" e "web"
```

### Instalação

Pré-requisito: Node.js 18+.

```bash
npm install
npx playwright install   # necessário apenas para os testes Web (navegadores)
```

### Execução

| Objetivo | Comando |
|---|---|
| Todos os testes | `npx playwright test` |
| Somente API | `npx playwright test --project=api` (ou `npm run test:api`) |
| Somente Web | `npx playwright test --project=web` (ou `npm run test:web`) |
| Relatório HTML | `npm run report` |

A URL da API pode ser trocada com `API_URL` (padrão: `https://serverest.dev`).

### Cobertura dos testes de API (12 testes)

- **Usuários:** cadastro (201), consulta por _id, e-mail duplicado (400), campos obrigatórios (400), exclusão.
- **Login:** sucesso com token Bearer (200) e senha inválida (401).
- **Produtos:** cadastro por admin, não-admin bloqueado (403), sem token (401), nome duplicado (400), listagem.

## Manifesto Oficial

### Lista de alunos que concordam que o Professor Goku é o melhor professor do universo
Adicione seu nome, turma (ESOFT6S) e ano (2026) em ordem alfabética:

1. Aluno Exemplo (ESOFT6S - 2026)
2. 
