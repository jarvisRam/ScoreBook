---
sidebar_position: 8
title: Test Data
---

# Test Data

Every layer below integrated E2E runs against committed, deterministic data. That keeps runs repeatable and free of RapidAPI quota costs. This page lists where that data lives and how to switch between data sources.

## Backend data modes

The backend chooses its data source from environment variables (`backend/src/config.ts`):

| Mode | How to set it | Data source | Used by |
| :--- | :--- | :--- | :--- |
| `mock` | `DATA_MODE=mock` or `USE_MOCK_DATA=true` | Static fixtures in `backend/src/mock-data/<sport>/` (cache bypassed) | Local dev, mocked acceptance (FE) in Maestro, Pact provider verification |
| `real` | `DATA_MODE=real` (default) | Live RapidAPI providers via `realDataService.ts` | Mocked acceptance (BE), with Nock intercepting the provider calls; integrated E2E and live API tests, with no interception |
| `simulation` | `DATA_MODE=simulation` | Generated, evolving match state (`simulationService.ts`), 5 s cache TTL | Local demos of live-updating scores |

## Fixtures

| Fixture | Path | Purpose |
| :--- | :--- | :--- |
| Per-sport mock data | `backend/src/mock-data/<sport>/` | What the app shows in mock mode. Maestro flows assert on its content. |
| Cricbuzz Nock payload | `backend/test/fixtures/cricbuzzMock.ts` | Hand-typed provider response for acceptance tests, verified against the real schema by `test/third-party/consumer.test.ts` |
| Captured Cricbuzz response | `backend/test/third-party/fixtures/cricbuzz-recent.real.json` | A real response captured with `npm run capture:cricket-fixture`, the ground truth for the provider schema |
| Pact contract | `mobile/pact/pacts/ScoreBookMobile-ScoreBookBackend.json` | Generated from the consumer specs. Don't edit by hand. |

## Frontend mock match

Reuse a typed fixture like this one in component tests instead of building ad-hoc objects in each test:

```typescript
export const mockCricketMatch: Match = {
  id: 'cricket-test-1',
  sport: 'cricket',
  tournament: 'Test Tournament',
  homeTeam: {
    name: 'India',
    initials: 'IND',
    score: { runs: 285, wickets: 6, overs: '48.3' }
  },
  awayTeam: {
    name: 'Australia',
    initials: 'AUS',
    score: { runs: 198, wickets: 4, overs: '35.2' }
  },
  venue: {
    name: 'Test Ground',
    city: 'Test City',
    country: 'Test Country'
  },
  status: 'live',
  startTime: '2024-01-01T10:00:00Z',
  format: 'ODI'
};
```

## Guidelines

- **Keep fixtures honest.** A mock that has drifted from the real provider shape gives false confidence. That's why the Cricbuzz mock is schema-checked on every PR.
- **One change, all consumers.** Changing `backend/src/mock-data/` can affect Maestro assertions and Pact verification. Run both before pushing.
- **No live data below the top layer.** If a test needs the network, it belongs in integrated E2E.

## Related

- [Backend Testing](./backend-testing.md)
- [Contract Testing](./contract-testing.md)
- [E2E Testing](./e2e-testing.md)
