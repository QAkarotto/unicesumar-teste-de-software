# Atividade 03 e 04 - 2BIM

## Observação importante

O repositório da disciplina contém os enunciados da atividade e materiais da turma, mas não o código da aplicação do ServeRest. As implementações reais dos testes foram realizadas nos repositórios de referência do projeto:

- Backend: `/home/gustavo/Faculdade/teste_software/ServeRest`
- Frontend: `/home/gustavo/Faculdade/teste_software/front`

## Status da entrega

### Atividade 03 - Testes unitários com Test Doubles
- Arquivo de testes: `teste_software/ServeRest/test/unit/test-doubles-atividade-03.test.js`
- 7 testes implementados com uso de stub, spy e mock
- Evidência: `npm run test:unit` -> 19 passing

### Atividade 04 - E2E com Playwright
- Arquivo de testes: `teste_software/front/tests/e2e/atividade-04.spec.js`
- Fixture customizada com `test.extend()`
- 3 cenários implementados
- Evidência: `npm run test:e2e` -> 3 passed

## Como subir a entrega

1. Fazer commit nesta branch do repositório da disciplina;
2. Incluir o resumo e as evidências do PR;
3. Abrir o Pull Request para `master` no repositório da disciplina.

## Evidência de execução

- Backend: `npm run test:unit` → 19 passing
- Frontend: `npm run test:e2e` → 3 passing
