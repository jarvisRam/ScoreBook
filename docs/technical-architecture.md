# ScoreBook - Technical Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagrams](#architecture-diagrams)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Navigation Architecture](#navigation-architecture)
8. [Testing Architecture](#testing-architecture)
9. [Deployment Strategy](#deployment-strategy)
10. [Technology Stack](#technology-stack)
11. [Design Decisions](#design-decisions)

---

## System Overview

ScoreBook is a cross-platform mobile and web application built with React Native (Expo) that provides real-time sports scores across six major sports. The application is specifically designed as a testbed for AI-based test automation solutions.

### Key Characteristics

- **Cross-Platform**: iOS, Android, and Web from a single codebase
- **Real-Time Updates**: Auto-polling mechanism for live score updates
- **Test-Friendly**: Comprehensive testID attributes and E2E test coverage
- **Flexible Data**: Toggle between mock (predictable) and real API data
- **Multi-Layered Testing**: Unit, Integration, and E2E tests

### Supported Sports

1. Cricket
2. American Football
3. Hockey
4. Soccer
5. Tennis
6. Badminton

---

## Architecture Diagrams

### High-Level System Architecture

\`\`\`mermaid
graph TB
    subgraph Client["Client Applications"]
        iOS["iOS App<br/>(React Native)"]
        Android["Android App<br/>(React Native)"]
        Web["Web App<br/>(React Native Web)"]
    end
    
    subgraph Backend["Backend Services"]
        API["Node.js API Server<br/>(Express)"]
        MockData["Mock Data Service"]
        RealData["Real API Service"]
    end
    
    subgraph External["External Services"]
        SportsAPI["Sports APIs<br/>(API-Sports, etc.)"]
    end
    
    subgraph Testing["Testing Infrastructure"]
        Detox["Detox<br/>(Mobile E2E)"]
        Cypress["Cypress<br/>(Web E2E)"]
        Jest["Jest<br/>(Unit Tests)"]
    end
    
    iOS --> API
    Android --> API
    Web --> API
    
    API --> MockData
    API --> RealData
    RealData --> SportsAPI
    
    Detox -.-> iOS
    Detox -.-> Android
    Cypress -.-> Web
    Jest -.-> Client
    Jest -.-> Backend
\`\`\`

### Component Hierarchy

\`\`\`mermaid
graph TD
    App["App Root<br/>(Theme Provider)"]
    App --> QueryProvider["React Query Provider"]
    QueryProvider --> RootNav["Root Navigator"]
    
    RootNav --> SportTabs["Sport Tab Navigator"]
    
    SportTabs --> Cricket["Cricket Screen"]
    SportTabs --> Football["Football Screen"]
    SportTabs --> Hockey["Hockey Screen"]
    SportTabs --> Soccer["Soccer Screen"]
    SportTabs --> Tennis["Tennis Screen"]
    SportTabs --> Badminton["Badminton Screen"]
    
    Cricket --> StatusTabs["Match Status Tabs<br/>(Live/Upcoming/Completed)"]
    Football --> StatusTabs
    Hockey --> StatusTabs
    Soccer --> StatusTabs
    Tennis --> StatusTabs
    Badminton --> StatusTabs
    
    StatusTabs --> MatchList["Match List"]
    MatchList --> MatchCard["Match Card Component"]
    
    MatchCard --> TeamDisplay["Team Display"]
    MatchCard --> ScoreDisplay["Score Display"]
    MatchCard --> LiveIndicator["Live Indicator"]
    MatchCard --> VenueInfo["Venue Info"]
    MatchCard --> HomeAwayBadge["Home/Away Badge"]
\`\`\`

---

## Frontend Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React Native (Expo) | Cross-platform app development |
| Language | TypeScript | Type safety and developer experience |
| Navigation | React Navigation v6 | Screen routing and navigation |
| State (Server) | React Query (TanStack Query) | API data fetching, caching, polling |
| State (Client) | Zustand | Local app state (UI, preferences) |
| Styling | Styled Components | Component-level styling with theming |
| UI Components | React Native Paper | Pre-built accessible components |
| Web Support | React Native Web | Browser compatibility |

### Directory Structure

\`\`\`
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MatchCard.tsx
│   │   ├── TeamDisplay.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── LiveIndicator.tsx
│   │   └── ...
│   ├── screens/            # Screen components
│   │   ├── SportScreen.tsx
│   │   └── MatchDetailScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── SportTabNavigator.tsx
│   │   └── types.ts
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── matchService.ts
│   │   └── sportService.ts
│   ├── store/              # State management
│   │   ├── useAppStore.ts       # Zustand
│   │   ├── useMatches.ts        # React Query
│   │   └── useLiveMatches.ts
│   ├── types/              # TypeScript types
│   │   ├── match.types.ts
│   │   ├── sport.types.ts
│   │   └── api.types.ts
│   ├── theme/              # Design system
│   │   ├── theme.ts
│   │   ├── sportColors.ts
│   │   └── StyledComponents.ts
│   ├── constants/          # App configuration
│   │   ├── sports.ts
│   │   └── config.ts
│   ├── assets/             # Static assets
│   │   ├── icons/
│   │   ├── logos/
│   │   └── images/
│   └── __tests__/          # Unit tests
├── e2e/                    # E2E tests (Detox)
├── App.tsx                 # App entry point
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json
\`\`\`

### Component Architecture

#### Core Components

**1. MatchCard Component**
\`\`\`typescript
interface MatchCardProps {
  match: Match;
  sport: Sport;
  onPress?: () => void;
  testID?: string;
}
\`\`\`

Renders:
- Team names and logos
- Current score (or scheduled time)
- Live indicator (if ongoing)
- Venue/location
- Home/Away badges (sport-dependent)

**2. SportTabNavigator**
- Horizontal scrollable tabs for each sport
- Active tab indicator
- Sport-specific icons
- Lazy loading of tab content

**3. MatchStatusTabs**
- Three tabs: Live Now, Upcoming, Completed
- Badge counts for each category
- Filters matches by status

### Responsive Design

- **Mobile**: Optimized for 375px-428px width
- **Tablet**: Adjusts layout for larger screens
- **Web**: Mobile-first design, centered layout

---

## Backend Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Framework | Express.js | HTTP server and routing |
| Language | TypeScript | Type safety |
| Data Fetching | Axios | HTTP client for external APIs |
| Caching | In-memory / Redis | Response caching |
| Scheduling | node-cron | Periodic data updates |

### Directory Structure

\`\`\`
backend/
├── src/
│   ├── routes/              # API routes
│   │   ├── matches.routes.ts
│   │   ├── sports.routes.ts
│   │   └── health.routes.ts
│   ├── services/            # Business logic
│   │   ├── dataService.ts         # Main orchestrator
│   │   ├── mockDataService.ts     # Mock data provider
│   │   ├── realDataService.ts     # Real API integration
│   │   └── cacheService.ts        # Caching logic
│   ├── mock-data/           # JSON fixtures
│   │   ├── cricket/
│   │   ├── football/
│   │   ├── hockey/
│   │   ├── soccer/
│   │   ├── tennis/
│   │   └── badminton/
│   ├── types/               # TypeScript types
│   │   ├── match.types.ts
│   │   └── api.types.ts
│   ├── middleware/          # Express middleware
│   │   ├── cors.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── config.ts            # Configuration
│   ├── routes.ts            # Route aggregator
│   └── index.ts             # Server entry point
├── .env.example
├── package.json
└── tsconfig.json
\`\`\`

### API Endpoints

\`\`\`
GET  /api/health
     Returns: { status: 'ok', mode: 'mock' | 'real', timestamp: number }

GET  /api/sports
     Returns: Sport[]

GET  /api/matches/live
     Returns: Match[] (all sports)

GET  /api/matches/:sport?status=live|upcoming|completed
     Returns: Match[] (filtered)

GET  /api/match/:id
     Returns: MatchDetail
\`\`\`

### Data Service Architecture

\`\`\`mermaid
graph LR
    Request["HTTP Request"] --> Router["Express Router"]
    Router --> Controller["Route Controller"]
    Controller --> DataService["Data Service"]
    
    DataService --> EnvCheck{USE_MOCK_DATA?}
    
    EnvCheck -->|true| MockService["Mock Data Service"]
    EnvCheck -->|false| RealService["Real API Service"]
    
    MockService --> Cache["Cache Layer"]
    RealService --> Cache
    
    Cache --> Response["HTTP Response"]
\`\`\`

### Mock vs Real Data Toggle

**Environment Variable:**
\`\`\`env
USE_MOCK_DATA=true   # Use mock data
USE_MOCK_DATA=false  # Use real APIs
\`\`\`

**Implementation:**
\`\`\`typescript
// dataService.ts
export function getMatches(sport: Sport, status: Status) {
  if (config.USE_MOCK_DATA) {
    return mockDataService.getMatches(sport, status);
  } else {
    return realDataService.getMatches(sport, status);
  }
}
\`\`\`

---

## Data Flow

### Data Fetching Flow

\`\`\`mermaid
sequenceDiagram
    participant UI as React Component
    participant RQ as React Query
    participant API as Backend API
    participant Service as Data Service
    participant External as External API / Mock Data
    
    UI->>RQ: useMatches('cricket', 'live')
    RQ->>RQ: Check cache (stale?)
    
    alt Cache valid
        RQ-->>UI: Return cached data
    else Cache stale/missing
        RQ->>API: GET /api/matches/cricket?status=live
        API->>Service: getMatches('cricket', 'live')
        
        alt Mock Mode
            Service->>External: Load cricket/live.json
        else Real Mode
            Service->>External: API call to external service
        end
        
        External-->>Service: Match data
        Service-->>API: Processed data
        API-->>RQ: JSON response
        RQ->>RQ: Update cache
        RQ-->>UI: Return fresh data
    end
    
    Note over RQ,UI: Auto-refetch after 30-60 seconds
\`\`\`

### State Update Flow

\`\`\`mermaid
graph LR
    UserAction["User Action<br/>(Select Tab)"] --> Zustand["Zustand Store<br/>(Update selectedSport)"]
    Zustand --> Component["Component Re-render"]
    Component --> ReactQuery["React Query<br/>(Trigger new query)"]
    ReactQuery --> API["Backend API"]
    API --> Update["UI Update with New Data"]
\`\`\`

---

## State Management

### State Separation Strategy

| State Type | Library | Examples | Persistence |
|------------|---------|----------|-------------|
| **Server State** | React Query | Live matches, upcoming matches, scores | Cache (memory) |
| **Client State** | Zustand | Selected sport tab, theme, UI flags | Memory |
| **User Preferences** | Zustand + AsyncStorage | Favorite teams, notification settings | Local storage |

### React Query Configuration

\`\`\`typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // Data fresh for 30 seconds
      cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
    },
  },
});
\`\`\`

### Auto-Polling Implementation

\`\`\`typescript
// useLiveMatches.ts
export function useLiveMatches(sport: Sport) {
  return useQuery({
    queryKey: ['matches', sport, 'live'],
    queryFn: () => fetchLiveMatches(sport),
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: true,           // Always poll when component mounted
  });
}
\`\`\`

### Zustand Store Example

\`\`\`typescript
interface AppState {
  selectedSport: Sport;
  selectedStatus: MatchStatus;
  setSelectedSport: (sport: Sport) => void;
  setSelectedStatus: (status: MatchStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedSport: 'cricket',
  selectedStatus: 'live',
  setSelectedSport: (sport) => set({ selectedSport: sport }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
}));
\`\`\`

---

## Navigation Architecture

### Navigation Structure

\`\`\`mermaid
graph TD
    Root["Root Navigator<br/>(Stack)"]
    Root --> SportTabs["Sport Tab Navigator<br/>(Material Top Tabs)"]
    
    SportTabs --> Cricket["Cricket Stack"]
    SportTabs --> Football["Football Stack"]
    SportTabs --> Hockey["Hockey Stack"]
    SportTabs --> Soccer["Soccer Stack"]
    SportTabs --> Tennis["Tennis Stack"]
    SportTabs --> Badminton["Badminton Stack"]
    
    Cricket --> CricketScreen["Cricket Screen<br/>(with Status Tabs)"]
    CricketScreen --> MatchDetail["Match Detail Screen<br/>(Future)"]
\`\`\`

### Navigation Types (TypeScript)

\`\`\`typescript
export type RootStackParamList = {
  Home: undefined;
  MatchDetail: { matchId: string };
};

export type SportTabParamList = {
  Cricket: undefined;
  Football: undefined;
  Hockey: undefined;
  Soccer: undefined;
  Tennis: undefined;
  Badminton: undefined;
};
\`\`\`

---

## Testing Architecture

### Testing Pyramid

\`\`\`mermaid
graph TD
    E2E["E2E Tests<br/>(Detox, Cypress)<br/>10% - Critical User Flows"]
    Integration["Integration Tests<br/>(React Testing Library)<br/>30% - Component Integration"]
    Unit["Unit Tests<br/>(Jest)<br/>60% - Business Logic"]
    
    E2E --> Integration
    Integration --> Unit
\`\`\`

### Test Coverage Strategy

| Test Type | Framework | Coverage | Purpose |
|-----------|-----------|----------|---------|
| **Unit Tests** | Jest | 60% | Services, utilities, pure functions |
| **Component Tests** | React Testing Library | 30% | Component rendering, props, events |
| **E2E Tests (Mobile)** | Detox | 10% | Critical user flows, navigation |
| **E2E Tests (Web)** | Cypress | 10% | Web-specific interactions |

### TestID Convention

All interactive elements have testID attributes following this pattern:

\`\`\`typescript
testID="{component}_{element}_{descriptor}"

Examples:
- testID="matchCard_container_cricket_123"
- testID="sportTab_button_cricket"
- testID="statusTab_button_live"
- testID="matchCard_teamName_home"
- testID="matchCard_score_current"
\`\`\`

### E2E Test Example (Detox)

\`\`\`typescript
describe('Sport Navigation', () => {
  it('should navigate between sport tabs', async () => {
    await element(by.id('sportTab_button_cricket')).tap();
    await expect(element(by.id('sportScreen_cricket'))).toBeVisible();
    
    await element(by.id('sportTab_button_football')).tap();
    await expect(element(by.id('sportScreen_football'))).toBeVisible();
  });
  
  it('should display live matches', async () => {
    await element(by.id('statusTab_button_live')).tap();
    await expect(element(by.id('matchCard_container_0'))).toBeVisible();
    await expect(element(by.id('liveIndicator_badge'))).toBeVisible();
  });
});
\`\`\`

### Mock vs Real Data for Testing

\`\`\`typescript
// Test with mock data (predictable)
beforeAll(() => {
  process.env.USE_MOCK_DATA = 'true';
});

// Test with real data (integration)
beforeAll(() => {
  process.env.USE_MOCK_DATA = 'false';
});
\`\`\`

---

## Deployment Strategy

### Mobile Deployment

\`\`\`mermaid
graph LR
    Code["Code Changes"] --> Build["EAS Build<br/>(Cloud)"]
    Build --> iOS["iOS Build<br/>(.ipa)"]
    Build --> Android["Android Build<br/>(.apk/.aab)"]
    
    iOS --> TestFlight["TestFlight<br/>(Beta Testing)"]
    Android --> PlayBeta["Google Play<br/>(Internal Testing)"]
    
    TestFlight --> AppStore["App Store<br/>(Production)"]
    PlayBeta --> PlayStore["Google Play Store<br/>(Production)"]
\`\`\`

### Web Deployment

\`\`\`
mobile/ (Expo Web)
  ↓
npx expo export:web
  ↓
Build Output (static files)
  ↓
Deploy to Vercel / Netlify
\`\`\`

### Backend Deployment

Options:
- **Vercel** (Serverless functions)
- **Railway** / **Render** (Container deployment)
- **AWS EC2** / **DigitalOcean** (VPS)

### CI/CD Pipeline

\`\`\`mermaid
graph LR
    Push["Git Push"] --> GHA["GitHub Actions"]
    GHA --> Lint["Lint & Type Check"]
    GHA --> Test["Run Tests"]
    GHA --> Build["Build Apps"]
    
    Build --> BuildPass{Pass?}
    BuildPass -->|Yes| Deploy["Deploy to Staging"]
    BuildPass -->|No| Notify["Notify Developer"]
    
    Deploy --> Manual["Manual Approval"]
    Manual --> Prod["Deploy to Production"]
\`\`\`

---

## Technology Stack

### Complete Stack Overview

#### Frontend
- **React Native**: v0.72+
- **Expo SDK**: v49+
- **TypeScript**: v5.0+
- **React Navigation**: v6
- **React Query**: v4
- **Zustand**: v4
- **Styled Components**: v6
- **React Native Paper**: v5

#### Backend
- **Node.js**: v18 LTS
- **Express.js**: v4
- **TypeScript**: v5
- **Axios**: API requests
- **node-cron**: Scheduled tasks
- **dotenv**: Environment configuration

#### Testing
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Detox**: Mobile E2E testing
- **Cypress**: Web E2E testing
- **Appium** (Future): Cross-platform E2E

#### Development Tools
- **VS Code**: Primary IDE
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **GitHub Actions**: CI/CD

---

## Design Decisions

### 1. Why Expo over React Native CLI?

**Decision**: Use Expo Managed Workflow with Custom Development Client

**Rationale**:
- ✅ Faster development setup
- ✅ Built-in React Native Web support
- ✅ EAS Build (cloud builds for iOS on Windows/Mac)
- ✅ Expo Go for rapid testing
- ✅ Regular updates and excellent documentation
- ✅ Can still add custom native code via Development Builds

### 2. Why React Query + Zustand over Redux?

**Decision**: Separate server state (React Query) from client state (Zustand)

**Rationale**:
- ✅ React Query specialized for API data (caching, polling, refetching)
- ✅ Built-in auto-polling perfect for live scores
- ✅ Zustand lightweight for UI state (1KB)
- ✅ Less boilerplate than Redux
- ✅ Easier to test (mock fetch vs complex Redux actions)
- ✅ Better developer experience

### 3. Why Styled Components?

**Decision**: Styled Components for styling

**Rationale**:
- ✅ Component-scoped styles
- ✅ Dynamic theming support
- ✅ TypeScript integration
- ✅ No global namespace conflicts
- ✅ Works seamlessly with React Native Web

### 4. Why Mock Data Support?

**Decision**: Backend supports both mock and real data modes

**Rationale**:
- ✅ Predictable test scenarios (mocked data)
- ✅ No API rate limits during development
- ✅ Offline development capability
- ✅ Fast test execution
- ✅ Easy to add edge cases (ties, overtime, etc.)
- ✅ Realistic production testing (real data)

### 5. Why Material Top Tabs for Sports?

**Decision**: Material Top Tabs for sport navigation

**Rationale**:
- ✅ Swipeable tabs (mobile-friendly)
- ✅ Horizontal scrolling for 6 sports
- ✅ Visual active indicator
- ✅ Standard mobile pattern
- ✅ Works on web (clickable)

### 6. Why 30-60 Second Polling?

**Decision**: Auto-poll every 30-60 seconds for live matches

**Rationale**:
- ✅ Balance between freshness and API usage
- ✅ Sports scores don't change every second (unlike stock prices)
- ✅ Reduces server load
- ✅ Still feels real-time to users
- ✅ Avoids API rate limits

### 7. Why Detox over Appium Initially?

**Decision**: Start with Detox, add Appium later

**Rationale**:
- ✅ Detox faster and more reliable for React Native
- ✅ Gray-box testing (better synchronization)
- ✅ Excellent developer experience
- ✅ Appium support planned for future (broader tool coverage)

### 8. Why Monorepo?

**Decision**: Single repository for mobile + backend

**Rationale**:
- ✅ Shared TypeScript types
- ✅ Atomic commits across frontend/backend
- ✅ Easier to keep API contracts in sync
- ✅ Single CI/CD pipeline
- ✅ Simpler for solo development

---

## Security Considerations

1. **API Keys**: Never commit API keys (use .env files, gitignored)
2. **CORS**: Properly configure CORS in backend
3. **Rate Limiting**: Implement rate limiting on backend endpoints
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Use HTTPS in production

---

## Performance Optimization

1. **Lazy Loading**: Lazy load tab content
2. **Image Optimization**: Use WebP for logos, SVG for icons
3. **Memoization**: Use React.memo for expensive components
4. **Virtualized Lists**: Use FlatList for long match lists
5. **Code Splitting**: Split bundles for web
6. **Caching**: Aggressive caching with React Query

---

## Accessibility

1. **AccessibilityLabel**: All interactive elements
2. **Screen Reader Support**: Proper semantic HTML for web
3. **Color Contrast**: WCAG AA compliant
4. **Text Scaling**: Support system text scaling
5. **Keyboard Navigation**: Web keyboard support

---

## Future Enhancements

1. **Push Notifications**: Score alerts for favorite teams
2. **Detailed Match View**: In-depth statistics, lineups
3. **Search**: Search for specific teams/matches
4. **Favorites**: Save favorite teams
5. **Historical Data**: Browse past matches
6. **Social Features**: Share scores
7. **Dark/Light Mode Toggle**: User preference
8. **Multiple Languages**: i18n support

---

## Conclusion

This architecture provides a solid foundation for a cross-platform sports score application with comprehensive testing capabilities. The separation of concerns, flexible data sources, and multi-layered testing strategy make it ideal for demonstrating AI-based test automation solutions.

The architecture is designed to be:
- **Scalable**: Easy to add new sports or features
- **Testable**: Comprehensive test coverage at all levels
- **Maintainable**: Clear separation of concerns
- **Flexible**: Toggle between mock and real data
- **Cross-Platform**: Single codebase for iOS, Android, Web
