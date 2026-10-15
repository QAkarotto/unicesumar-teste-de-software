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


## Atividade 01 — 2º Bimestre: Automação de Testes de API com Playwright

### Objetivo

Automatizar testes de API utilizando Playwright e TypeScript, verificando códigos de status HTTP, estrutura das respostas, dados retornados e regras de negócio da API ServeRest.

### Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright Test
- API ServeRest: https://serverest.dev/

### Estrutura dos arquivos

```text
unicesumar-teste-de-software/
├── tests/
│   ├── api/
│   │   └── serverest.spec.ts
│   └── web/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── .gitignore
```

### Instalação

Após clonar o repositório e acessar a pasta do projeto, execute:

```bash
npm install
```

### Execução dos testes

Executar todos os testes:

```bash
npx playwright test
```

Executar somente os testes da API:

```bash
npm run test:api
```

Verificar os tipos do TypeScript:

```bash
npm run typecheck
```

Abrir o relatório HTML:

```bash
npm run test:report
```

### Cenários automatizados da API

1. Listagem de usuários e validação dos dados.
2. Listagem de produtos e validação dos dados.
3. Pesquisa de usuários inexistentes, validando o retorno de lista vazia.
4. Tentativa de login com credenciais inválidas.
5. Tentativa de cadastro de usuário sem os campos obrigatórios.
6. Tentativa de cadastro de produto sem autorização.

### Resultado da execução

Na última execução registrada, os seis testes de API passaram. A verificação do TypeScript também foi concluída sem erros.

### Evidências

As capturas de tela das execuções e do relatório HTML podem ser anexadas ao Pull Request para demonstrar os resultados da atividade.