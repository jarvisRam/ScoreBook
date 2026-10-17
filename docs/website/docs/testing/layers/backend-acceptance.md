---
sidebar_position: 5
title: Mocked Acceptance (BE)
description: The real HTTP API exercised in-process with Supertest, third-party providers stubbed with Nock.
---

# Mocked Acceptance Testing (Backend)

These tests exercise the real Express app through its HTTP API. Routing, validation, data transformation and error handling all run for real. Only the third-party sports providers (RapidAPI) are stubbed, so the tests are deterministic and cost no quota.

Tests live in `backend/test/integration/`, with shared helpers in `test/utils.ts` and fixtures in `test/fixtures/`.

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

## Decision matrix: driving the API

| Criteria | **Supertest** | HTTP client against a running server (axios / fetch) | Postman / Newman |
| :--- | :--- | :--- | :--- |
| Runs in-process: no port, no server lifecycle | ✅ takes the `app` directly | ❌ must start and stop a server | ❌ needs a running server |
| Can stub outbound provider calls in the same process | ✅ | ⚠️ only if the server runs in the test process | ❌ |
| Lives in Jest alongside the other tests | ✅ | ✅ | ❌ separate runner and format |
| Type-safe, code-reviewed tests | ✅ TypeScript | ✅ TypeScript | ⚠️ JSON collections |
| Coverage counted towards SonarCloud | ✅ | ⚠️ | ❌ |

### Why Supertest

- **It runs in-process.** It calls the Express `app` directly, with no port binding, no startup wait and no orphaned servers in CI, so the suite stays well under 3 minutes.
- **It shares the test process with the stubs.** Nock interceptors registered in a test apply to the app's outbound calls, which makes error paths (500, 429, 403) trivial to reproduce.

## Decision matrix: stubbing third-party providers

| Criteria | **Nock** | MSW (Node) | WireMock | Mock data mode (`USE_MOCK_DATA`) |
| :--- | :--- | :--- | :--- | :--- |
| Intercepts real outbound HTTP, so `realDataService.ts` code runs | ✅ | ✅ | ✅ via a proxied base URL | ❌ bypasses the real service entirely |
| Per-test error injection (500 / 429 / 403) | ✅ one line per case | ✅ | ⚠️ separate stub files | ❌ |
| Runs in-process, no extra container | ✅ | ✅ | ❌ JVM / Docker | ✅ |
| Works with axios and native fetch | ✅ v14 is built on MSW's interceptors | ✅ | ✅ | n/a |
| Assert that a provider was (or wasn't) called | ✅ `isDone()`, scopes | ⚠️ manual | ✅ | ❌ |

### Why Nock

- **It exercises the real data path.** Unlike the backend's mock data mode, Nock lets the actual `realDataService.ts` request building, response mapping and error handling run, with only the network replaced.
- **Failure cases cost one line.** `setupRapidApiMock(host, path, body, 429)` is all it takes to test rate limiting, which is the scenario most likely to bite in production.
- Nock 14 uses the same interceptor engine as MSW, so we get MSW's modern internals with Nock's concise, assertion-friendly API.

The stubs are kept honest by the [third-party contract checks](./contract-testing.md#third-party-provider-contracts), which validate the hand-typed Nock payloads against the real provider schema.

## Running

```bash
cd backend
npm test                       # = DATA_MODE=real jest integration
npm test -- health.test.ts     # one file
```

### Example test (Cricket)

```typescript
it('should return cricket matches', async () => {
    // Setup Mock
    setupRapidApiMock(mockHosts.cricket, '/matches/v1/recent', cricketMockData);

    // Call API
    const res = await request(app).get('/api/matches/cricket');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data[0].sport).toBe('cricket');
});
```

### Cache isolation

`DataService` maintains a TTL cache when running in real-API mode. To prevent stale cached data from leaking between test cases, call `clearCache()` in `afterEach`:

```typescript
import { dataService } from '../../src/services/dataService';

afterEach(() => {
    dataService.clearCache();
});
```

> **Note:** In mock mode (`USE_MOCK_DATA=true`) the cache is bypassed entirely, so `clearCache()` is a no-op. It's still safe to call it unconditionally.

## Must-test scenarios

1. Health check returns 200
2. Sports list returns all 6 sports
3. Matches endpoint filters by sport correctly
4. Matches endpoint filters by status correctly
5. Invalid sport returns 400 error
6. Invalid status returns 400 error
7. Mock data loads correctly on server start
8. Upstream provider errors (500, 429, 403) degrade gracefully instead of crashing

## In CI

`.github/workflows/ci.yml` runs `npm test` in the `lint-and-test` job on every PR to `main` or `develop`.

## Related

- [Contract Testing](./contract-testing.md): mobile ↔ backend and third-party contracts
- [Integrated E2E](./integrated-e2e.md): the live API tests that run without stubs
- [Test Data](../test-data.md): fixtures and data modes
