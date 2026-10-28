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

## Atividade 01 - Automação de Testes de API com Playwright

### Descrição

Este projeto utiliza o framework Playwright com TypeScript para realizar testes automatizados na API ServeRest.

O objetivo é validar o funcionamento das requisições HTTP, conferir os dados retornados pela API e verificar regras de negócio.

### Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright
- API ServeRest

### Testes implementados

Foram desenvolvidos 7 testes automatizados:

1. Listar usuários cadastrados.
2. Cadastrar um usuário com sucesso.
3. Consultar um usuário pelo ID.
4. Validar a tentativa de cadastro com e-mail duplicado.
5. Validar a tentativa de login com credenciais inválidas.
6. Excluir um usuário cadastrado.
7. Listar produtos cadastrados.

Os testes validam os códigos de status HTTP, as informações retornadas no corpo das respostas e regras de negócio da API.

### Instalação e execução

**1. Instalar as dependências**

Após clonar o repositório, abra o terminal na pasta do projeto e execute:

```bash
npm install
```

**2. Executar todos os testes**

```bash
npx playwright test
```

**3. Executar somente os testes de API**

```bash
npx playwright test --project=api
```

**4. Executar um teste específico**

```bash
npx playwright test tests/api/02-cadastrar-usuario.spec.ts --project=api
```

**5. Listar os testes disponíveis**

```bash
npx playwright test --list
```

### Organização do projeto

Os testes estão separados em duas pastas:

- `tests/api/` — testes automatizados da API ServeRest.
- `tests/web/` — estrutura reservada para futuros testes Web.

A configuração dos projetos está no arquivo `playwright.config.ts`.

### Resultados

Os 7 testes de API foram executados e aprovados durante o desenvolvimento.

A evidência da execução está anexada à descrição do Pull Request da atividade.

### Autores

Victor Matheus da Mata e Nicolas Moreira.