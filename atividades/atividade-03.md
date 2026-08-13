# Atividade 03: Testes Exploratórios de UI — ServeRest

## Objetivo

Realizar sessões de **testes exploratórios de UI** na funcionalidade de **Produtos** do ServeRest, utilizando **Session-Based Testing** e diferentes estratégias de exploração.

A atividade busca desenvolver a capacidade de **aprender sobre o comportamento da aplicação, questionar suas respostas, identificar possíveis riscos e adaptar a estratégia de teste a partir dos aprendizados obtidos durante a exploração**.

## Aplicação

[ServeRest — Frontend](https://front.serverest.dev/)

A exploração deverá ser focada no ciclo de vida de **Produtos**, incluindo cadastro, consulta, edição e exclusão.

## Organização

A atividade pode ser realizada **individualmente ou em duplas**.
Devem ser realizadas **duas sessões de exploração**.

Em duplas:

- cada integrante deverá conduzir sua própria sessão;
- cada integrante deverá criar uma Issue individual para cada sessão;
- as sessões podem compartilhar o conhecimento obtido durante a exploração, mas devem representar a atuação efetiva de cada integrante.

## Estratégia

As duas sessões deverão utilizar **estratégias diferentes**.

### Sessão 1 — Heurística CHIQUE

A primeira sessão deverá utilizar a heurística **CHIQUE** como principal guia de exploração:

| Heurística | Foco |
|---|---|
| **C** — Campos obrigatórios | Campos vazios e validações |
| **H** — Habilitar/Desabilitar | Estados dos controles e botões |
| **I** — Interrupção da ação | Cancelar, voltar, atualizar, interromper |
| **Q** — Quebra de fluxos | Ações fora da sequência esperada |
| **U** — Usabilidade dos menus | Navegação e organização da interface |
| **E** — Estouro de campos | Valores extremos e entradas inesperadas |

A heurística deve ser utilizada como **guia para exploração**, e não como uma lista de casos de teste.

### Sessão 2 — Nova estratégia

A segunda sessão deverá partir dos **resultados e aprendizados da primeira sessão** e utilizar uma estratégia diferente de exploração.

Algumas possibilidades:

- **Hipótese:** formular uma hipótese sobre um possível comportamento ou risco e investigá-la;
- **Persona:** explorar a aplicação assumindo o comportamento de um determinado perfil de usuário;
- **Heurística:** utilizar outra heurística de teste;
- **Risco:** direcionar a exploração para uma área considerada de maior risco;
- **Estado:** explorar diferentes estados e transições da aplicação;
- **Resultados da sessão 1:** aprofundar uma descoberta, comportamento ou questionamento identificado anteriormente.

O aluno deverá explicar no relatório **qual estratégia escolheu e por que ela é adequada para a segunda sessão**.

> A segunda sessão não deve simplesmente repetir a exploração realizada na primeira. Ela deve demonstrar como os resultados da primeira sessão podem gerar novas ideias e direcionar investigações posteriores.

## Charter

Cada sessão deverá possuir seu próprio **charter**, estabelecendo:

**Explore:** o que será explorado.

**Com:** estratégia, heurística, hipótese ou perspectiva utilizada.

**Para descobrir:** o que se pretende aprender, questionar ou investigar.

## Relatório das sessões

Cada sessão deverá ser registrada em uma **Issue individual**, utilizando o template fornecido.

O relatório deverá apresentar:

- charter da sessão;
- duração;
- estratégia utilizada;
- achados relevantes;
- questionamentos;
- evidências;
- aprendizados;
- possíveis riscos;
- próximas investigações.

Na **segunda sessão**, explique também como os resultados da primeira sessão influenciaram a nova estratégia de exploração.

## Shift-Left

Para pelo menos uma descoberta relevante, reflita:

> **Como esse comportamento poderia ter sido descoberto, questionado ou prevenido mais cedo no ciclo de desenvolvimento?**

Considere possibilidades como:

- refinamento;
- critérios de aceitação;
- exemplos;
- testes automatizados;
- code review;
- testes de integração;
- testes exploratórios.

## Entrega

**Individual ou em Dupla:** mínimo de **2 sessões + 2 Issues**.

Cada integrante deverá conduzir sua própria sessão e registrar individualmente seus resultados em issues no [projeto da disciplina no Github](https://github.com/QAkarotto/unicesumar-teste-de-software/projects) e enviar no link da issues no Studeo.

## Critérios

Será considerada a capacidade de:

- explorar além dos fluxos óbvios;
- utilizar a CHIQUE de forma consciente na primeira sessão;
- selecionar e justificar uma estratégia diferente na segunda sessão;
- utilizar os aprendizados da primeira sessão para direcionar novas investigações;
- compreender e questionar os comportamentos observados;
- identificar possíveis riscos;
- registrar descobertas e evidências de maneira clara;
- relacionar descobertas à prevenção e ao feedback antecipado.

> **O objetivo não é encontrar a maior quantidade de bugs, mas aprender sobre o comportamento do produto, questioná-lo e utilizar esse aprendizado para direcionar novas investigações e melhorar sua qualidade.**