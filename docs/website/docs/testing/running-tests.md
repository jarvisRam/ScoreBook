---
sidebar_position: 5
title: Running Tests
---

# Running Tests

## Folder structure

```
ScoreBook/
├── backend/
│   └── test/
│       ├── integration/     # mocked acceptance (BE): Supertest + Nock
│       ├── live/            # live API tests (integrated E2E)
│       ├── contract/        # Pact provider verification
│       ├── third-party/     # provider schema contracts
│       ├── fixtures/
│       ├── utils.ts
│       └── setup.ts
│
├── mobile/
│   ├── src/__tests__/       # unit / component tests (Jest + RNTL)
│   └── pact/consumer/       # Pact consumer specs
│
├── .maestro/                # Maestro flows (mobile E2E)
│   ├── flow.yaml
│   └── flows/
│
├── tests/                   # Playwright specs (web E2E)
└── playwright.config.ts
```

## Commands

### Repo root

| Command | What it runs |
| :--- | :--- |
| `npm test` | Mobile unit tests, then backend mocked acceptance tests |
| `npm run lint` | Lint for mobile and backend |
| `npm run test:contract:local` | Regenerate the pact, then verify the backend against it locally (no broker token) |
| `npm run test:e2e:mobile` | Maestro flows (needs a running emulator/simulator with the app installed) |
| `npm run test:e2e:web` | Playwright (needs the web dev server running) |
| `npm run perf:be` | Backend endpoint load test on a mocked backend (needs [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)) |
| `npm run perf:fe -- --build` | Frontend load test and web vitals on the mocked stack (needs k6 and Chrome) |
| `npm run perf:smoke` | Performance smoke against the hosted environment |
| `npm run perf:grafana:up` | Local Prometheus + Grafana dashboard for the k6 results |

See the [Performance Test Strategy](./performance-testing-strategy.md) for options and what each suite measures.

### Mobile (`cd mobile`)

| Command | What it runs |
| :--- | :--- |
| `npm test` | Unit / component tests |
| `npm run test:coverage` | Same, with coverage |
| `npm test -- --watch` | Watch mode |
| `npm test -- MatchCard.test.tsx` | A single file |
| `npm run test:contract` | Pact consumer specs, which regenerate the pact file |

### Backend (`cd backend`)

| Command | What it runs |
| :--- | :--- |
| `npm test` | Mocked acceptance tests (`test/integration`, providers stubbed with Nock) |
| `npm run test:coverage` | All Jest tests with coverage |
| `npm run test:thirdparty` | Third-party provider schema contracts |
| `npm run test:contract` | Pact provider verification against Pactflow (needs `PACT_BROKER_TOKEN`) |
| `npm run test:contract:local` | Pact provider verification against the local pact file |
| `npm run test:live` | Live API tests ⚠️ consumes RapidAPI quota |
| `npm run check:cricket-drift` | Fresh Cricbuzz response vs. schema ⚠️ consumes quota |
| `npm test -- health.test.ts` | A single file |

## What do I run?

### "I'm fixing a bug in a logic function..."

Add a failing **unit test** that reproduces the bug, fix it, then run:

```bash
cd mobile && npm test        # frontend
cd backend && npm test       # backend
```

### "I'm adding a new screen..."

1. Write **component tests** (RNTL) for the UI states: loading, error, empty, data.
2. Add a **Maestro flow** for navigation to and from the screen, and add it to `.maestro/flow.yaml`.

```bash
maestro test .maestro/flows/new-feature.yaml
```

### "I'm modifying a backend endpoint..."

Run the **mocked acceptance** tests, plus the **contract** check if the response shape changes:

```bash
cd backend && npm test
npm run test:contract:local  # from repo root
```

### "I'm adding or upgrading a dependency..."

CI runs **dependency review** on the PR and fails it if the new version has a known high or critical vulnerability. To find out before you push, audit the package you changed:

```bash
cd backend && npm audit --omit=dev   # or cd mobile / the repo root
```

`npm audit` reports every vulnerability in the tree, including ones that were already there, so only act on what your change introduced. Existing ones arrive as Dependabot PRs. See [Dependency Security](./layers/dependency-security.md#acting-on-findings) for the fix targets.

### "I'm changing what mobile expects from the API..."

Update the consumer spec in `mobile/pact/consumer/`, then follow the [contract testing lifecycle](./layers/contract-testing.md#the-lifecycle).
