# Automação de API com Playwright — Especificação

## Objetivo

Adicionar ao repositório da disciplina uma base TypeScript com Playwright Test, testes HTTP para a API ServeRest e projetos separados para API e futuros testes Web. A instalação deve funcionar com `npm install`; os testes completos e os testes de API devem ter comandos próprios.

## Decisões

- Usar `@playwright/test` e o fixture `request` para enviar requisições HTTP sem abrir navegador nos testes de API.
- Definir dois projetos no `playwright.config.ts`: `api`, apontando para `tests/api`, e `web`, apontando para `tests/web` com Chromium Desktop.
- Permitir configurar `SERVEREST_BASE_URL`, mantendo `https://serverest.dev` como padrão; reservar `WEB_BASE_URL` para a futura aplicação Web.
- Fornecer scripts npm para executar toda a suíte e filtrar por projeto.
- Gerar e versionar o `package-lock.json`; ignorar dependências e saídas de execução.
- Criar usuários com e-mails exclusivos durante os testes e removê-los no teardown para reduzir dados residuais na API compartilhada.

## Cenários de API

Os testes devem verificar status HTTP e conteúdo de resposta:

1. Listar produtos: validar `quantidade`, tamanho de `produtos` e campos relevantes de um produto.
2. Cadastrar usuário e consultá-lo pelo ID: validar mensagem, ID, e-mail, nome e perfil.
3. Rejeitar cadastro de e-mail duplicado: validar `400` e a mensagem de regra de negócio.
4. Rejeitar login com credenciais inválidas: validar `401` e mensagem.
5. Autenticar usuário cadastrado: validar `200`, mensagem e token Bearer.
6. Rejeitar cadastro de produto sem token: validar `401` e mensagem.
7. Impedir usuário não administrador de cadastrar produto: validar `403` e mensagem de autorização.

## Arquivos

- `package.json` e `package-lock.json`: dependências e comandos.
- `playwright.config.ts` e `tsconfig.json`: projetos API/Web e compilação de tipos.
- `.gitignore`: dependências, relatórios e resultados do Playwright.
- `tests/api/serverest.spec.ts`: cenários e limpeza dos usuários temporários.
- `tests/web/README.md`: propósito da pasta e instruções para instalar Chromium ao começar testes Web.
- `README.md`: instalação, execução completa, execução de API, execução futura de Web e variáveis de ambiente.

## Critérios de aceite

- `npm install` instala as dependências a partir do lockfile.
- `npx playwright test` executa os projetos configurados.
- `npx playwright test --project=api` executa somente os testes HTTP.
- Os sete cenários acima verificam status e dados relevantes.
- As instruções explicam que testes Web futuros precisam do browser Chromium (`npx playwright install chromium`).
- A saída da execução da suíte de API fica disponível para registrar como evidência na descrição da PR, que só será criada após autorização do usuário.

## Fora de escopo

- Criar testes Web sem uma aplicação alvo.
- Publicar a branch ou abrir uma Pull Request sem autorização explícita.
