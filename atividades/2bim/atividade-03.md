# Atividade 03 - 2BIM: Testes Unitários com Test Doubles no ServeRest

**Valor:** 0,5 ponto  
**Repositório da disciplina:** https://github.com/QAkarotto/unicesumar-teste-de-software  
**Projeto de referência:** https://github.com/ServeRest/ServeRest

## Objetivo

Desenvolver testes unitários sobre o código do ServeRest, isolando dependências quando necessário por meio de **Test Doubles**, como stubs, spies e mocks.

A atividade busca exercitar a validação de comportamentos de forma isolada, com testes rápidos, independentes e direcionados à responsabilidade da unidade testada.

## Pesquisa prévia

Antes da implementação, pesquise sobre **Test Doubles** e identifique:

- o que são Test Doubles;
- para que são utilizados em testes unitários;
- diferenças entre **stub, spy e mock**;
- situações em que cada tipo pode ser aplicado.

Registre de forma breve, na descrição do Pull Request, os principais conceitos compreendidos e os **links das fontes consultadas**.

## Atividade

Analise o código-fonte do ServeRest e selecione funções, serviços ou módulos que possam ser testados de forma isolada.

Implemente **pelo menos 6 testes unitários**, contemplando:

- comportamento esperado;
- cenário alternativo;
- cenário de erro;
- controle do retorno de uma dependência com **stub**;
- observação de chamadas ou argumentos com **spy**;
- uso de **mock**, quando a interação com uma dependência fizer parte do comportamento esperado.

Os Test Doubles devem ser utilizados apenas quando contribuírem para o isolamento do teste.

## Boas práticas

Os testes devem:

- ser independentes entre si;
- preparar seus próprios dados;
- evitar dependências reais desnecessárias, como rede, banco de dados ou serviços externos;
- verificar comportamento relevante, e não apenas execução sem erro;
- deixar claro qual unidade está sendo testada e qual dependência foi substituída.

Exemplo conceitual:

```text
unidade testada
→ dependência substituída por stub
→ retorno controlado
→ comportamento validado
```

## Execução

Utilize a estrutura de testes unitários do projeto ServeRest.

Exemplo:

```bash
npm run test:unit
```

## Entrega

A entrega deverá ser realizada por **Pull Request** para a branch `master` do repositório da disciplina.

O Pull Request deve conter:

- breve síntese da pesquisa sobre Test Doubles e fontes consultadas;
- testes unitários implementados;
- uso justificado de Test Doubles;
- instruções para execução;
- evidência da execução da suíte.

Na descrição do Pull Request, identifique brevemente:

```text
Unidade testada:
Dependência substituída:
Test Double utilizado:
Motivo:
```

## Materiais de apoio

- ServeRest: https://github.com/ServeRest/ServeRest
- Sinon: https://sinonjs.org/
- Sinon — Stubs: https://sinonjs.org/releases/latest/stubs/
- Sinon — Spies: https://sinonjs.org/releases/latest/spies/
- Sinon — Mocks: https://sinonjs.org/releases/latest/mocks/
