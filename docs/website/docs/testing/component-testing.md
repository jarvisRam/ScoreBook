---
sidebar_position: 4
title: Component Testing
---

# Component Testing Guide

Frontend **unit** tests for the React Native app: pure logic, hooks and components rendered in isolation with Jest and React Native Testing Library (RNTL).

## Why RNTL

RNTL encourages testing how the user *uses* the app (tapping buttons, reading text) rather than implementation details. It renders components in a JS environment, with no native build or emulator, so tests run instantly.

## Tooling

- **Test runner:** Jest (`jest-expo` preset, `mobile/jest.config.js`)
- **Component testing:** React Native Testing Library
- **Mocking:** `jest.mock()` (MSW, Mock Service Worker, is the recommended option for network-level mocks but isn't installed yet)

Tests live in `mobile/src/__tests__/`, mirroring the `src/` folder they test (for example `__tests__/components/MatchCard.test.tsx`).

```bash
cd mobile
npm test                       # all tests
npm run test:coverage          # with coverage (feeds SonarCloud)
npm test -- MatchCard.test.tsx # one file
```

## Test utilities

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

## Must-test scenarios

### Components

1. MatchCard renders all team information
2. LiveIndicator shows for live matches only
3. ScoreDisplay renders correct format per sport
4. TeamDisplay shows home/away badges correctly
5. Loading state shows while fetching data
6. Error state shows retry button
7. Empty state shows appropriate message

### Screen-level behaviour

These run as RNTL tests with the API mocked. They are still unit-level, with no device involved:

1. SportScreen loads matches on mount
2. Status tab switching loads correct data
3. Pull-to-refresh reloads match list
4. Live matches auto-poll every 30 seconds
5. Navigation between sports works
6. Error retry refetches data

## Related

- [Test Strategy](./strategy.md)
- [Test Data](./test-data.md): shared match fixtures
- [E2E Testing](./e2e-testing.md): the same journeys on a real build
