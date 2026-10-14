---
sidebar_position: 5
title: Backend Testing
---

# Backend Testing Guide

This page covers the backend's **unit** and **mocked acceptance (BE)** layers, plus the live smoke tests that form part of **integrated E2E**. The goal is API reliability without spending RapidAPI quota on every run. We use **Jest**, **Supertest** and **Nock**.

Tests live under `backend/test/` (`integration/`, `live/`, `contract/`, `third-party/`), with shared helpers in `test/utils.ts` and fixtures in `test/fixtures/`.

## Strategy Overview

| Layer | Command | Frameworks | Purpose | Runs On |
|-------|---------|------------|---------|---------|
| **Mocked acceptance** | `npm test` | Jest, Supertest, Nock | Validates logic using mocked responses. Zero cost. | **CI (GitHub Actions)**, Local Dev |
| **Live smoke (integrated E2E)** | `npm run test:live` | Jest, Supertest | Validates connectivity to real RapidAPI endpoints. Consumes quota. | Manual / Scheduled |

## 1. Mocked Acceptance Tests (Supertest + Nock)
These are the default tests. They simulate external API responses to verify that the backend handles data transformation and errors correctly.

### Key Features
- **Deterministic**: Tests behave the same way every time.
- **Isolates Dependencies**: Nock intercepts HTTP requests, so no network calls are made.
- **Safety**: Can simulate errors like 500, Rate Limits (429), or Missing Subscription (403) without waiting for them to actually happen.

### Running Mocked Tests
```bash
cd backend
npm test
```

### Example Test (Cricket)
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

## 2. Live Smoke Tests
These tests hit the **real** production endpoints. They are used to verify that the upstream API contract hasn't changed.

### ⚠️ Warning
> These tests consume your RapidAPI quota. Run them sparingly!

### Running Live Tests
```bash
cd backend
npm run test:live
```

## 3. Cache Isolation in Tests

`DataService` maintains a TTL cache when running in real-API mode. To prevent stale cached data from leaking between test cases, call `clearCache()` in `afterEach`:

```typescript
import { dataService } from '../../src/services/dataService';

afterEach(() => {
    dataService.clearCache();
});
```

> **Note:** In mock mode (`USE_MOCK_DATA=true`) the cache is bypassed entirely, so `clearCache()` is a no-op. It's still safe to call it unconditionally.

## CI/CD Integration
Our GitHub Actions workflow (`.github/workflows/ci.yml`) automatically runs the **Mocked Acceptance Tests** (`npm test`) on every Pull Request to `main` or `develop`. This ensures no broken code is merged.

## Must-test scenarios

1. Health check returns 200
2. Sports list returns all 6 sports
3. Matches endpoint filters by sport correctly
4. Matches endpoint filters by status correctly
5. Invalid sport returns 400 error
6. Invalid status returns 400 error
7. Mock data loads correctly on server start
8. Upstream provider errors (500, 429, 403) degrade gracefully instead of crashing

## Unit tests

Pure logic, such as data transformers in `realDataService.ts`, the simulation engine and utilities, should be tested directly with Jest and no HTTP layer. There are none yet: every backend test today goes through Supertest. New transformation logic should come with unit tests, which keeps the acceptance suite focused on API behaviour.

## Related

- [Test Strategy](./strategy.md)
- [Contract Testing](./contract-testing.md): mobile ↔ backend and third-party contracts
- [Test Data](./test-data.md): fixtures and data modes
