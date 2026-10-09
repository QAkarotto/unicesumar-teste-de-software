# Playwright API Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure a TypeScript Playwright project with seven ServeRest API tests and a separate Web project ready for future tests.

**Architecture:** Use one Playwright configuration with `api` and `web` projects mapped to separate test directories. API calls use Playwright's `request` fixture; a test-scoped fixture removes temporary users after each test.

**Tech Stack:** Node.js, npm, TypeScript, `@playwright/test`, ServeRest API.

**Spec:** `docs/superpowers/specs/2026-10-09-playwright-api-tests-design.md`

## Global Constraints

- Use `@playwright/test` and the `request` fixture for HTTP requests.
- Require Node.js 20 or newer, matching the supported runtime for the dependencies.
- Define `api` and `web` projects rooted at `tests/api` and `tests/web`.
- Default the API base URL to `https://serverest.dev` and allow `SERVEREST_BASE_URL` to override it.
- Include seven scenarios that assert status and response data.
- Support `npm install`, `npx playwright test`, and `npx playwright test --project=api`; keep the Web command strict while its test directory is empty.
- Do not publish the branch or open a PR without explicit authorization.

## Review Focus

- Product listing response has an inconsistent count or missing fields — exercise `lista produtos com quantidade e campos coerentes`.
- User registration omits its ID or success message — exercise `cadastra e consulta usuário pelo ID`.
- ServeRest accepts a duplicate email or returns a different rule message — exercise `bloqueia cadastro de e-mail duplicado`.
- Invalid credentials return success or an unexpected body — exercise `rejeita credenciais de login inválidas`.
- A missing token or a non-admin token can create a product — exercise `bloqueia cadastro de produto sem token` and `bloqueia cadastro de produto para usuário não administrador`.

---

### Task 1: Add Playwright setup and ServeRest scenarios

**Files:**
- Create: `package.json` and generated `package-lock.json`
- Create: `playwright.config.ts`, `tsconfig.json`, `.gitignore`
- Create: `tests/api/serverest.spec.ts`
- Create: `tests/web/README.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: ServeRest endpoints documented at `https://serverest.dev`.
- Produces: npm scripts `test`, `test:api`, `test:web`, and `typecheck`; Playwright projects `api` and `web`; test fixture `createdUserIds: string[]`; helper `registerUser(request, createdUserIds)` returning a newly registered non-admin user with its ID, email, password, and name.

- [ ] Add `tests/api/serverest.spec.ts` with seven named scenarios: list products and validate count/fields; register and fetch a user by ID; reject duplicate email with status `400` and its message; reject invalid login with status `401` and its message; login a registered user and validate a Bearer token; reject product registration without a token with status `401`; reject product registration by a non-admin token with status `403`. Use `randomUUID()` for test data and remove registered users in a test-scoped fixture.
- [ ] Add `package.json`, `tsconfig.json`, `playwright.config.ts`, and `.gitignore`. Use strict TypeScript checks, scripts for all/API/Web/typecheck, an API project with the configurable ServeRest base URL, and a Desktop Chrome Web project with `WEB_BASE_URL` support.
- [ ] Run `npm install` and confirm the lockfile is generated.
- [ ] Add `tests/web/README.md` and document installation, commands, environment variables, and future Chromium installation in the root README.
- [ ] Run `npm run typecheck`, `npm run test:api`, and `npx playwright test`; expected: typecheck succeeds, all seven API tests pass, and the full run discovers the API tests while the Web project has no tests yet.
- [ ] Run `git diff --check` and commit the completed setup as `feat: add Playwright API tests`.
