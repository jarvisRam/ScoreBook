---
sidebar_position: 9
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

### "I'm changing what mobile expects from the API..."

Update the consumer spec in `mobile/pact/consumer/`, then follow the [contract testing lifecycle](./contract-testing.md#the-lifecycle).
