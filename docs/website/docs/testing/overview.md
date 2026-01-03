---
sidebar_position: 1
---

# Testing Overview

Comprehensive testing strategy for the ScoreBook application.

## Testing Philosophy

The ScoreBook app follows a multi-layered testing approach:

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test component interactions and data flow
3. **E2E Tests** - Test complete user workflows across the app
4. **API Tests** - Test backend endpoints and data integrity

## Test Coverage Goals

| Layer | Target Coverage | Current Status |
|-------|----------------|----------------|
| Backend API | 90%+ | 🟢 Tooling Ready |
| Frontend Components | 80%+ | 🟡 Not implemented |
| Business Logic | 95%+ | 🟡 Not implemented |
| E2E Critical Paths | 100% | 🟢 Tooling Ready |

## Tech Stack

### Backend Testing

- **Test Runner:** Jest
- **Assertions:** expect (Jest)
- **HTTP Testing:** supertest
- **Mocking:** jest.mock()

### Frontend Testing

- **Test Runner:** Jest
- **Component Testing:** React Native Testing Library
- **Mocking:** jest.mock(), MSW (Mock Service Worker)

### E2E Testing

- **Mobile:** Maestro
- **Web:** Playwright

## Test Structure

```
ScoreBook/
├── backend/
│   ├── src/
│   │   └── __tests__/
│   │       └── ...
│   └── test/
│       └── integration/
│           └── health.test.ts
│
├── mobile/
│   ├── src/
│   │   └── __tests__/
│   │       └── ...
│   └── app.json
│
├── .maestro/
│   └── flow.yaml
│
├── tests/
│   └── web-smoke.spec.ts
│
└── playwright.config.ts
```

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- health.test.ts
```

### Frontend Tests

```bash
cd mobile

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- MatchCard.test.tsx
```

### E2E Tests

```bash
# Mobile (Maestro)
# Ensure Android Emulator or iOS Simulator is running
npm run test:e2e:mobile

# Web (Playwright)
# Ensure Web Development Server is running (npm run web)
npm run test:e2e:web
```

## TestID Convention

All interactive elements have consistent testIDs for E2E automation:

### Format

```
{componentName}_{context}_{identifier}
```

### Examples

```typescript
// Match card
testID="matchCard_cricket_live_0"

// Team display
testID="teamDisplay_home_name"

// Score display
testID="scoreDisplay_cricket_runs"

// Navigation tabs
testID="sportTab_cricket"
testID="statusTab_cricket_live"

// Buttons
testID="button_retry"
testID="button_refresh"
```

## Critical Test Scenarios

### Backend API

✅ **Must Test:**
1. Health check returns 200
2. Sports list returns all 6 sports
3. Matches endpoint filters by sport correctly
4. Matches endpoint filters by status correctly
5. Invalid sport returns 400 error
6. Invalid status returns 400 error
7. Mock data loads correctly on server start

### Frontend Components

✅ **Must Test:**
1. MatchCard renders all team information
2. LiveIndicator shows for live matches only
3. ScoreDisplay renders correct format per sport
4. TeamDisplay shows home/away badges correctly
5. Loading state shows while fetching data
6. Error state shows retry button
7. Empty state shows appropriate message

### Frontend Integration

✅ **Must Test:**
1. SportScreen loads matches on mount
2. Status tab switching loads correct data
3. Pull-to-refresh reloads match list
4. Live matches auto-poll every 30 seconds
5. Navigation between sports works
6. Error retry refetches data

### E2E Critical Paths

✅ **Must Test:**
1. App launches and shows cricket matches
2. User can navigate to all 6 sports
3. User can switch between Live/Upcoming/Completed
4. Pull-to-refresh updates match list
5. Live matches update automatically
6. Error states allow retry
7. Empty states show when no matches

## Test Data

### Mock Match Data

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

## Continuous Integration

### GitHub Actions Workflow

- **Backend**: Runs `npm test` on push.
- **Mobile E2E**: Runs Maestro tests on Android Emulator (`ubuntu-latest`) for Pull Requests.

```yaml
# .github/workflows/maestro.yml
name: Mobile E2E (Maestro)
# ... checks out code, installs Maestro, builds APK, runs flow.yaml
```

## Test Utilities

### Custom Render Function

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

### Mock API Responses

```typescript
// __mocks__/api.ts
export const mockAPI = {
  getMatches: jest.fn(),
  getMatchDetail: jest.fn(),
  getSports: jest.fn(),
  health: jest.fn(),
};
```

## Next Steps

1. [Backend Testing Guide](./backend-testing.md)
2. [Component Testing Guide](./component-testing.md)
3. [E2E Testing Guide](./e2e-testing.md)
4. [Test Data Factories](./test-data.md)
