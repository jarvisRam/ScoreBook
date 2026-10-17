---
sidebar_position: 7
title: Integrated E2E
description: The full stack with nothing mocked. The app and API run against the deployed backend and live providers, on a schedule and before release.
---

# Integrated E2E Testing

The top of the pyramid: the full stack with nothing mocked. These tests run the app against the **deployed backend** and **live sports providers**, and they're the only layer that spends RapidAPI quota. They prove the system works as a whole in a production-like environment. They're deliberately few, slow and scheduled, and never block a PR.

| Suite | What it runs | Tool | Cadence |
| :--- | :--- | :--- | :--- |
| Live API tests | Backend endpoints on the hosted backend, against real providers | Jest + Supertest (`backend/test/live/`) | Every 6 h, plus manual dispatch |
| App E2E (integrated) | The [mocked acceptance flows](./frontend-acceptance.md), pointed at the deployed backend | Maestro, Playwright | Nightly, and on merge to `main` |
| Release suite | Critical journeys on **real devices** | Maestro on a device farm | Release tag / manual |

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

## Decision matrix: live API tests

| Criteria | **Jest + Supertest** | Postman / Newman | k6 |
| :--- | :--- | :--- | :--- |
| Same language, types and runner as the rest of the backend | ✅ | ❌ JSON collections | ⚠️ JS, but its own runtime |
| Assertions on response shape | ✅ can reuse our TypeScript types and Zod schemas | ⚠️ JS snippets | ⚠️ checks |
| Runs unattended in GitHub Actions | ✅ | ✅ | ✅ |
| Fits a functional (not load) check | ✅ | ✅ | ⚠️ designed for load testing |

### Why Jest + Supertest

- **No second toolchain.** Live tests use the same Jest + Supertest setup as the [mocked acceptance tests](./backend-acceptance.md), minus the stubs. They're written and reviewed like every other backend test and can reuse the same types and schemas.
- **One test, two targets.** By default the app is exercised in-process against real providers. Setting `API_BASE_URL` points the same tests at the hosted backend.
- **The scheduled runner is just a workflow.** `.github/workflows/live-api-tests.yml` health-checks the hosted backend, then runs `npm run test:live` against it. Nothing extra to host.

## Decision matrix: app E2E against the deployed stack

| Criteria | **Reuse Maestro + Playwright flows** | Separate E2E suite / tool |
| :--- | :--- | :--- |
| One set of journeys to maintain | ✅ | ❌ duplicated journeys |
| Handles changing live data | ⚠️ assert on testIDs and structure, not on fixture values | ⚠️ same problem |

### Why reuse the acceptance flows

- **A journey is defined once.** The only difference from [mocked acceptance](./frontend-acceptance.md) is which backend the app points at, so a new screen gets one flow that serves both layers.
- **It forces resilient assertions.** Live data changes constantly, so integrated runs push flows towards testID and structural checks. That also makes the mocked runs less brittle when fixtures change.

## Candidate API check (before a backend change deploys)

The scheduled suites above only see what is already deployed. To test a backend or provider change **before** it ships, `.github/workflows/web-e2e-integration.yml` builds the web app from the branch with its API URL pointed at the backend under test, then runs the same Playwright specs as the hosted run (`tests/live`).

- **How the URL gets in.** The app reads `EXPO_PUBLIC_API_BASE_URL` at build time (`mobile/src/constants/config.ts`) and falls back to the hosted backend when it's unset.
- **Which backend.** A manual run takes an `api_base_url` input (for example a Vercel preview deployment of the backend). With the input blank, and on every PR that touches `backend/**`, the workflow starts the backend from the checkout on the runner in **mock mode**, so it needs no secrets, spends no RapidAPI quota and is deterministic.
- **Proof it hit the right backend.** `tests/live/api-target.spec.ts` fails if any `/api` request leaves the expected origin, so a bad URL can't silently fall back to production and pass.
- **Run it locally.**

  ```bash
  cd backend && DATA_MODE=mock npm run dev          # terminal 1
  EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api npm run build:web
  EXPECTED_API_ORIGIN=http://localhost:3000 npm run test:e2e:web:integration -- --project=chromium
  ```

It's advisory by default. It's path-filtered, and a skipped path-filtered check would leave a required status pending, so remove the `paths` filter before adding it to branch protection.

## Real devices (release suite)

Emulators miss performance, memory and native-integration issues, so a release gets one pass of the critical journeys on real hardware. The device farm hasn't been chosen yet. The criteria for choosing:

| Criteria | Maestro Cloud | BrowserStack App Automate | AWS Device Farm | Firebase Test Lab |
| :--- | :--- | :--- | :--- | :--- |
| Runs our existing Maestro flows unchanged | ✅ native | ⚠️ check current Maestro support | ⚠️ custom test spec | ⚠️ |
| iOS and Android real devices | ✅ | ✅ | ✅ | ⚠️ iOS limited |
| Triggered from GitHub Actions | ✅ | ✅ | ✅ | ✅ |

The leading option is **Maestro Cloud**, because it runs the flows we already maintain with no translation. Confirm pricing and device coverage before adopting it.

## Handling failures

- A failure opens an issue and notifies the owning team. It doesn't block unrelated PRs.
- Triage within 1 business day: **our bug** (fix, and add a regression test at the lowest layer that reproduces it), **provider change** (update the schema and fixtures, see [contract drift](./contract-testing.md#third-party-provider-contracts)), or **provider outage / quota** (no code change; note it on the issue and close).

## Running

```bash
cd backend
npm run test:live              # ⚠️ consumes RapidAPI quota
```

## Related

- [Mocked Acceptance (FE)](./frontend-acceptance.md): the flows reused here
- [Contract Testing](./contract-testing.md): catches provider drift before these tests do
