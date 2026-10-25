# unicesumar-teste-de-software
Repositório utilizado na disciplina de Projeto, Implementação e Teste de Software do curso de Engenharia de Software da Unicesumar Ponta Grossa

## Atividade 02 — Suíte de testes de API

Evolução dos seis cenários da Atividade 01 ([PR #205](https://github.com/QAkarotto/unicesumar-teste-de-software/pull/205)), agora com 11 testes independentes de API no ServeRest.

### Instalação e execução

Requisito: Node.js 22.13 ou superior e acesso à internet.

```sh
npm install
npx playwright test
```

Somente a suíte de API:

```sh
npx playwright test tests/api
# ou
npm run test:api
```

Não é necessário instalar navegadores. Para conferir os tipos, use `npm run typecheck`; para abrir o relatório HTML após executar os testes, use `npm run test:report`.

A URL é configurada apenas em `playwright.config.ts` e pode ser alterada pela variável de ambiente `API_BASE_URL`. Os testes usam caminhos relativos, duas execuções paralelas e nenhuma tentativa automática adicional.

### Organização e melhorias realizadas

- `tests/api/`: cenários e verificações de usuários, login, produtos e carrinhos.
- `tests/data/factories.ts`: dados dinâmicos com Faker e UUIDs nos emails e nomes de produtos.
- `tests/helpers/`: cadastro de recursos e autenticação reutilizável.
- `tests/fixtures/api.fixture.ts`: pré-condições próprias de cada teste e limpeza em ordem inversa (carrinho, produto, usuário), inclusive em falhas.

Os seis cenários anteriores foram mantidos e ajustados para não compartilhar dados. Foram adicionados login inválido, cadastro inválido, cadastro autenticado de produto, atualização com consulta final e fluxo de carrinho com validação de estoque.

As verificações cobrem status, mensagens, identificadores, dados persistidos, email duplicado e restauração do estoque após cancelar uma compra. Cada teste pode ser executado isoladamente, por exemplo:

```sh
npx playwright test tests/api/carrinhos.spec.ts
```

A evidência da execução completa está em [evidencias/execucao-completa.txt](evidencias/execucao-completa.txt). O ServeRest é compartilhado: indisponibilidade externa pode afetar a execução. A limpeza remove apenas os recursos criados pelo próprio teste; interrupção forçada do processo pode impedir o teardown.

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
