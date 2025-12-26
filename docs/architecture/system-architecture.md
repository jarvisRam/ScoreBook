---
sidebar_position: 1
---

# System Architecture

Overview of the ScoreBook application architecture and design decisions.

## High-Level Architecture

```
┌──────────────────────────────────────────────────┐
│                  Client Layer                    │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   iOS    │  │ Android  │  │   Web    │     │
│  │ Simulator│  │ Emulator │  │ Browser  │     │
│  └─────┬────┘  └─────┬────┘  └────┬─────┘     │
│        │             │              │           │
│        └─────────────┼──────────────┘           │
│                      │                          │
└──────────────────────┼──────────────────────────┘
                       │
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────┐
│             React Native App                    │
│          (Single Codebase)                      │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │         Presentation Layer               │  │
│  │  Screens → Components → UI               │  │
│  └───────────────┬──────────────────────────┘  │
│                  │                              │
│  ┌───────────────▼──────────────────────────┐  │
│  │         State Management                 │  │
│  │  React Query (Server) + Zustand (UI)    │  │
│  └───────────────┬──────────────────────────┘  │
│                  │                              │
│  ┌───────────────▼──────────────────────────┐  │
│  │         Business Logic                   │  │
│  │  Services → API Client → Utilities       │  │
│  └───────────────┬──────────────────────────┘  │
└──────────────────┼──────────────────────────────┘
                   │
                   │ Axios HTTP
                   │
┌──────────────────▼──────────────────────────────┐
│              Backend API                         │
│           (Node.js + Express)                    │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │         API Routes Layer                 │  │
│  │  /health /sports /matches /match         │  │
│  └───────────────┬──────────────────────────┘  │
│                  │                              │
│  ┌───────────────▼──────────────────────────┐  │
│  │         Service Layer                    │  │
│  │  MockDataService → Validation            │  │
│  └───────────────┬──────────────────────────┘  │
│                  │                              │
│  ┌───────────────▼──────────────────────────┐  │
│  │         Data Layer                       │  │
│  │  JSON Files (6 Sports × 3 Statuses)     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Root)
└── QueryClientProvider (React Query Setup)
    └── RootNavigator (NavigationContainer)
        └── SportTabNavigator (Horizontal Scrollable Tabs)
            ├── Cricket Tab → SportScreen(cricket)
            ├── Football Tab → SportScreen(football)
            ├── Hockey Tab → SportScreen(hockey)
            ├── Soccer Tab → SportScreen(soccer)
            ├── Tennis Tab → SportScreen(tennis)
            └── Badminton Tab → SportScreen(badminton)

SportScreen(sport)
└── StatusTabNavigator (Material Top Tabs)
    ├── Live Tab → MatchList(sport, 'live')
    ├── Upcoming Tab → MatchList(sport, 'upcoming')
    └── Completed Tab → MatchList(sport, 'completed')

MatchList(sport, status)
└── FlatList
    └── MatchCard[]
        ├── LiveIndicator
        ├── TeamDisplay (home)
        ├── ScoreDisplay (home)
        ├── TeamDisplay (away)
        ├── ScoreDisplay (away)
        └── VenueInfo
```

### Data Flow

```
User Action
    │
    ▼
UI Component
    │
    ▼
React Query Hook (useMatches)
    │
    ├──→ Cache Check ──→ Return Cached Data
    │
    ▼
API Service (matchService)
    │
    ▼
Axios HTTP Client
    │
    ▼
Backend API
    │
    ▼
Mock Data Service
    │
    ▼
JSON Files
    │
    ▼
Response ──→ React Query Cache ──→ Component Re-render
```

### State Management Strategy

#### Server State (React Query)

**Purpose:** API data, caching, synchronization

**Features:**
- Automatic caching with stale-time
- Background refetching
- Auto-polling for live data
- Optimistic updates
- Error retry logic

```typescript
const { data, isLoading, error, refetch } = useMatches(sport, status);
```

**Configuration:**
```typescript
{
  staleTime: 30000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: status === 'live' ? 30000 : false,
  retry: 3,
}
```

#### Client State (Zustand)

**Purpose:** UI state, user preferences

**Usage:**
```typescript
const selectedSport = useAppStore(state => state.selectedSport);
const setSelectedSport = useAppStore(state => state.setSelectedSport);
```

**Store:**
```typescript
interface AppStore {
  selectedSport: Sport | null;
  selectedStatus: MatchStatus;
  setSelectedSport: (sport: Sport) => void;
  setSelectedStatus: (status: MatchStatus) => void;
}
```

## Backend Architecture

### Layered Structure

```
HTTP Request
    │
    ▼
├── Middleware Layer
│   ├── CORS
│   ├── Body Parser
│   ├── Request Logging
│   └── Error Handling
    │
    ▼
├── Routes Layer
│   ├── health.routes.ts
│   ├── sports.routes.ts
│   ├── matches.routes.ts
│   └── match.routes.ts
    │
    ▼
├── Service Layer
│   └── MockDataService
│       ├── loadMockData()
│       ├── getMatches()
│       ├── getMatchById()
│       └── getSports()
    │
    ▼
├── Data Layer
│   └── JSON Files
│       ├── cricket/{live,upcoming,completed}.json
│       ├── football/{live,upcoming,completed}.json
│       └── ...
    │
    ▼
HTTP Response
```

### Request/Response Cycle

```
1. Client sends GET /api/matches/cricket?status=live

2. Express routes request to matches.routes.ts

3. Route handler:
   - Validates sport parameter
   - Validates status parameter
   - Calls MockDataService.getMatches(sport, status)

4. MockDataService:
   - Checks in-memory cache
   - If not cached, reads from JSON file
   - Filters by status if provided
   - Caches result

5. Route handler formats response:
   { success: true, data: [...matches] }

6. Express sends JSON response

7. Client receives data
   - React Query caches response
   - Component re-renders with data
```

## Cross-Platform Considerations

### Platform Detection

```typescript
import { Platform } from 'react-native';

const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api', // Android emulator host
  web: 'http://localhost:3000/api',
});
```

### Platform-Specific Code

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
});
```

## Design Patterns

### 1. Container/Presentational Pattern

**Container (Smart Component):**
```typescript
const MatchListContainer = ({ sport, status }) => {
  const { data, isLoading } = useMatches(sport, status);
  return <MatchList data={data} isLoading={isLoading} />;
};
```

**Presentational (Dumb Component):**
```typescript
const MatchList = ({ data, isLoading }) => {
  if (isLoading) return <LoadingState />;
  return <FlatList data={data} />;
};
```

### 2. Composition Pattern

```typescript
<MatchCard match={match}>
  <MatchCard.Header />
  <MatchCard.Body />
  <MatchCard.Footer />
</MatchCard>
```

### 3. Custom Hooks Pattern

```typescript
// useMatches - Data fetching
// useAppStore - Global state
// useNavigation - Navigation
// useTheme - Theming
```

## Performance Optimizations

### 1. React Query Caching

```typescript
{
  staleTime: 30000, // Don't refetch for 30 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
}
```

### 2. Component Memoization

```typescript
export const MatchCard = React.memo(MatchCardComponent);
```

### 3. FlatList Optimization

```typescript
<FlatList
  data={matches}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 4. Image Optimization

```typescript
// Use lowercase initials instead of images
<Text>{team.initials}</Text>
// Future: Implement react-native-fast-image
```

## Security Considerations

### Backend

1. **CORS Configuration:** Whitelist allowed origins
2. **Input Validation:** Validate all route parameters
3. **Rate Limiting:** Implement rate limiting (future)
4. **Authentication:** JWT tokens (future)

### Frontend

1. **API Key Storage:** Use secure storage (future)
2. **HTTPS Only:** Production should use HTTPS
3. **Input Sanitization:** Sanitize user inputs

## Scalability Considerations

### Current Capacity

- **Mock Data:** 42 matches total
- **Concurrent Users:** Unlimited (read-only, no auth)
- **Response Time:** < 10ms (in-memory cache)

### Future Scaling

1. **Database:** Replace JSON with MongoDB/PostgreSQL
2. **Caching:** Add Redis for distributed caching
3. **Load Balancing:** Multiple backend instances
4. **CDN:** Static assets via CDN
5. **Microservices:** Split by sport if needed

## Technology Choices

### Why React Native + Expo?

✅ Single codebase for iOS, Android, Web
✅ Fast development with hot reload
✅ Large ecosystem and community
✅ TypeScript support
✅ Easy to test

### Why React Query?

✅ Automatic caching and synchronization
✅ Built-in loading/error states
✅ Auto-polling for live data
✅ Optimistic updates
✅ DevTools for debugging

### Why Express?

✅ Minimal and flexible
✅ Large middleware ecosystem
✅ Easy to understand
✅ Great for RESTful APIs
✅ TypeScript support

### Why Mock Data?

✅ No external dependencies
✅ Consistent test data
✅ Fast development
✅ Easy to modify
✅ No API costs

## Future Architecture Enhancements

1. **GraphQL API:** Replace REST with GraphQL
2. **WebSocket:** Real-time score updates
3. **Microservices:** Separate services per sport
4. **Event Sourcing:** Track all score changes
5. **CQRS:** Separate read/write models
6. **Server-Side Rendering:** Next.js for web
7. **Progressive Web App:** Add service worker

## Related Documentation

- [Frontend Structure](../frontend/structure.md)
- [Backend Structure](../backend/structure.md)
- [State Management](../frontend/state-management.md)
- [API Design](../api/design-principles.md)
