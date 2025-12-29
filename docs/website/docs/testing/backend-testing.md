---
sidebar_position: 1
title: Backend Testing
---

# Backend Testing Guide

ScoreBook's backend testing strategy relies on a dual-layer approach to ensure API reliability without consuming excessive RapidAPI quota. We use **Jest**, **Supertest**, and **Nock** to achieve this.

## Strategy Overview

| Layer | Command | Frameworks | Purpose | Runs On |
|-------|---------|------------|---------|---------|
| **Integration (Mocked)** | `npm test` | Jest, Nock | Validates logic using mocked responses. Zero cost. | **CI (GitHub Actions)**, Local Dev |
| **Live Smoke (Real)** | `npm run test:live` | Jest, Supertest | Validates connectivity to real RapidAPI endpoints. Consumes quota. | Manual / Scheduled |

## 1. Mocked Integration Tests
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

## CI/CD Integration
Our GitHub Actions workflow (`.github/workflows/ci.yml`) automatically runs the **Mocked Integration Tests** (`npm test`) on every Pull Request to `main` or `develop`. This ensures no broken code is merged.
