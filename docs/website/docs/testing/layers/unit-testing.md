---
sidebar_position: 3
title: Unit Testing
description: Functions, hooks and components tested in isolation with Jest and React Native Testing Library. The bulk of our tests.
---

# Unit Testing

Unit tests check a single function, hook or component in isolation, with every dependency mocked. They make up the bulk of the pyramid: they run in milliseconds, pinpoint failures exactly, and are where edge cases belong.

| Side | Scope | Tools | Location |
| :--- | :--- | :--- | :--- |
| Frontend | Components, hooks, screen-level behaviour with the API mocked | Jest (`jest-expo`) + React Native Testing Library | `mobile/src/__tests__/` |
| Backend | Data transformers, simulation engine, utilities | Jest (`ts-jest`) | `backend/test/` |

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

## Decision matrix: test runner

| Criteria | **Jest** | Vitest | Node test runner (`node:test`) |
| :--- | :--- | :--- | :--- |
| Official React Native / Expo support | ✅ `jest-expo` preset maintained by Expo | ⚠️ community setups, RN transforms not first-class | ❌ |
| TypeScript backend support | ✅ `ts-jest` | ✅ native | ⚠️ needs a loader |
| Mocking (modules, timers) | ✅ built in | ✅ Jest-compatible API | ⚠️ basic |
| Ecosystem fit (Supertest, Nock, Pact examples) | ✅ | ✅ | ⚠️ |
| Coverage (LCOV for SonarCloud) | ✅ | ✅ | ⚠️ experimental |
| Speed | ⚠️ good | ✅ faster, especially in watch mode | ✅ |
| One runner across mobile and backend | ✅ | ❌ can't cover the RN side cleanly | ❌ |

### Why Jest

- **It's the only runner Expo supports first-class.** `jest-expo` handles the React Native transforms and native-module mocks that other runners need custom setups for.
- **One runner and one API across the repo.** The mobile unit tests, backend tests, Pact consumer tests and live API tests all share the same syntax, mocking model and coverage output.
- Vitest is faster. On the backend only, it's worth reconsidering if test time ever threatens the < 2 min budget.

## Decision matrix: component rendering (frontend)

| Criteria | **React Native Testing Library** | `react-test-renderer` | Enzyme |
| :--- | :--- | :--- | :--- |
| Tests what the user sees (text, roles, labels) | ✅ user-centric queries | ❌ walks the component tree | ❌ implementation-focused |
| Supports React 19 / RN 0.81 | ✅ | ⚠️ deprecated as of React 19 | ❌ no adapter for modern React |
| Resilient to refactors | ✅ | ⚠️ | ❌ |
| Runs without a device or emulator | ✅ | ✅ | ✅ |
| Community standard for RN | ✅ recommended in RN docs | ⚠️ legacy | ❌ abandoned |

### Why React Native Testing Library

- **It tests behaviour, not implementation.** Queries like `getByText` and `getByRole` survive internal refactors, so tests break only when the user-visible behaviour does.
- **It's the maintained option.** `react-test-renderer` is deprecated in React 19 and Enzyme has no adapter for modern React. RNTL is what the React Native docs point to.

## Coverage gate

Coverage is a **unit-layer gate**: it measures how much of the logic our fastest tests exercise.

- **Target:** ≥ 80% line coverage on **new code** in every PR. Measuring new code only means legacy gaps don't block unrelated work.
- **Measured by:** `jest --coverage` (`npm run test:coverage` in each package) producing LCOV reports.
- **Enforced in:** the SonarCloud quality gate, which reads the LCOV reports (see [Code quality & security analysis](./static-checks.md#code-quality--security-analysis)).

Coverage shows which code went untested; it doesn't prove the tested code works. Untested branches show where to add a test, but a high number on its own doesn't excuse weak assertions.

## Frontend

### Running

```bash
cd mobile
npm test                       # all tests
npm run test:coverage          # with coverage (feeds SonarCloud)
npm test -- MatchCard.test.tsx # one file
```

Mocking uses `jest.mock()`. MSW (Mock Service Worker) is the recommended option for network-level mocks but isn't installed yet.

### Custom render function

Wrap components that use React Query in a fresh `QueryClient` with retries disabled, so failures surface immediately:

```typescript
// test-utils.tsx
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};
```

### Mock API responses

```typescript
// __mocks__/api.ts
export const mockAPI = {
  getMatches: jest.fn(),
  getMatchDetail: jest.fn(),
  getSports: jest.fn(),
  health: jest.fn(),
};
```

### Must-test scenarios: components

1. MatchCard renders all team information
2. LiveIndicator shows for live matches only
3. ScoreDisplay renders correct format per sport
4. TeamDisplay shows home/away badges correctly
5. Loading state shows while fetching data
6. Error state shows retry button
7. Empty state shows appropriate message

### Must-test scenarios: screen-level behaviour

These run as RNTL tests with the API mocked. They're still unit-level, with no device involved:

1. SportScreen loads matches on mount
2. Status tab switching loads correct data
3. Pull-to-refresh reloads match list
4. Live matches auto-poll every 30 seconds
5. Navigation between sports works
6. Error retry refetches data

## Backend

Pure logic, such as data transformers in `realDataService.ts`, the simulation engine and utilities, should be tested directly with Jest and no HTTP layer. There are none yet: every backend test today goes through Supertest (see [Mocked Acceptance (BE)](./backend-acceptance.md)). New transformation logic should come with unit tests, which keeps the acceptance suite focused on API behaviour.

## Related

- [Test Data](../test-data.md): shared match fixtures
- [Mocked Acceptance (FE)](./frontend-acceptance.md): the same journeys on a real build
