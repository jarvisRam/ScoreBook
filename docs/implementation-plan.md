# ScoreBook - Implementation Plan

## Goal

Create a cross-platform React Native application (iOS, Android, Web) for viewing live sports scores across Cricket, American Football, Hockey, Soccer, Tennis, and Badminton. The application will serve as a testing ground for AI-based test automation solutions with comprehensive E2E testing capabilities.

## User Review Required

> [!IMPORTANT]
> **Mac Development Transition**: The initial project will be scaffolded on Windows and pushed to GitHub. Development will continue on Mac after hardware purchase. All project setup will be Mac-compatible from the start.

> [!IMPORTANT]
> **API Strategy**: Backend will support both mock and real data modes via environment variable toggle. Mock data will be used for predictable test automation scenarios.

> [!NOTE]
> **Testing Approach**: Multi-layered testing strategy with mocked tests as first line of defense, followed by integration tests with real APIs. Detox (mobile), Cypress (web), with future Appium/Playwright support.

## Proposed Changes

### Phase 1: Project Scaffolding & Configuration

#### [NEW] Project Root Structure
```
ScoreBook/
├── mobile/          # React Native Expo app
├── backend/         # Node.js Express backend
├── docs/           # Documentation
├── .github/        # GitHub Actions workflows
└── README.md       # Root README
```

---

### Mobile Application (`mobile/`)

#### [NEW] Core Configuration Files

##### [NEW] [package.json](file:///e:/Sriram%20Workspace/ScoreBook/mobile/package.json)
- Expo SDK dependencies
- React Navigation (v6)
- React Query (TanStack Query)
- Zustand state management
- Styled Components
- React Native Paper (UI components)
- Testing dependencies (Jest, Detox, Testing Library)

##### [NEW] [app.json](file:///e:/Sriram%20Workspace/ScoreBook/mobile/app.json)
- App configuration (name: ScoreBook)
- Platform-specific settings (iOS, Android, Web)
- Expo configuration
- App icons and splash screens

##### [NEW] [tsconfig.json](file:///e:/Sriram%20Workspace/ScoreBook/mobile/tsconfig.json)
- TypeScript configuration
- Path aliases (@components, @screens, @services, etc.)
- Strict type checking

##### [NEW] [.detoxrc.js](file:///e:/Sriram%20Workspace/ScoreBook/mobile/.detoxrc.js)
- Detox E2E testing configuration
- Android and iOS build configurations
- Test runner settings

#### [NEW] Source Structure (`mobile/src/`)

##### [NEW] Navigation (`src/navigation/`)
- `RootNavigator.tsx` - Main navigation container
- `SportTabNavigator.tsx` - Top-level sport tabs
- `MatchTabNavigator.tsx` - Live/Upcoming/Completed tabs
- `types.ts` - Navigation type definitions

##### [NEW] Screens (`src/screens/`)
- `SportScreen.tsx` - Main screen showing matches for a sport
- `MatchDetailScreen.tsx` - Detailed match view (future)
- Types: `Live`, `Upcoming`, `Completed` variants

##### [NEW] Components (`src/components/`)

**Common Components:**
- `MatchCard.tsx` - Match display card with score, teams, venue
- `LiveIndicator.tsx` - Red "LIVE" badge component
- `TeamDisplay.tsx` - Team name + logo component
- `ScoreDisplay.tsx` - Current score rendering
- `VenueInfo.tsx` - Location/venue information
- `HomeAwayBadge.tsx` - H/A indicators (conditional by sport)
- `LoadingState.tsx` - Loading skeleton
- `ErrorState.tsx` - Error display
- `EmptyState.tsx` - No matches available

**Navigation Components:**
- `SportTab.tsx` - Individual sport tab with icon
- `MatchStatusTab.tsx` - Live/Upcoming/Completed tab

##### [NEW] Services (`src/services/`)
- `api.ts` - Axios instance with base configuration
- `matchService.ts` - Match data fetching logic
- `sportService.ts` - Sport-specific data handling

##### [NEW] State Management (`src/store/`)

**Zustand Stores:**
- `useAppStore.ts` - Global app state (selected sport, theme, etc.)
- `useUserPreferences.ts` - User preferences (favorites, etc.)

**React Query Hooks:**
- `useMatches.ts` - Fetch matches with auto-refetch
- `useLiveMatches.ts` - Live matches with polling
- `useMatchDetails.ts` - Individual match details

##### [NEW] Types (`src/types/`)
- `match.types.ts` - Match, Team, Score interfaces
- `sport.types.ts` - Sport configuration types
- `api.types.ts` - API response types

##### [NEW] Theme (`src/theme/`)
- `theme.ts` - Design tokens (colors, spacing, typography)
- `sportColors.ts` - Sport-specific accent colors
- `StyledComponents.ts` - Styled component theme provider

##### [NEW] Constants (`src/constants/`)
- `sports.ts` - Sport configurations (hasHomeAway, icons, etc.)
- `config.ts` - App configuration (API URL, polling interval)

##### [NEW] Assets (`src/assets/`)
```
assets/
├── icons/
│   └── sports/
│       ├── cricket.svg
│       ├── football.svg
│       ├── hockey.svg
│       ├── soccer.svg
│       ├── tennis.svg
│       └── badminton.svg
├── logos/
│   └── teams/
│       └── (popular team logos)
└── images/
    ├── icon.png
    └── splash.png
```

##### [NEW] Testing (`src/__tests__/`, `e2e/`)

**Unit Tests:**
- `components/__tests__/MatchCard.test.tsx`
- `services/__tests__/matchService.test.ts`
- `store/__tests__/useAppStore.test.ts`

**E2E Tests (Detox):**
- `e2e/sportNavigation.e2e.ts` - Tab navigation tests
- `e2e/liveMatches.e2e.ts` - Live match display tests
- `e2e/matchFiltering.e2e.ts` - Filter by status tests

---

### Backend Application (`backend/`)

#### [NEW] Backend Structure

##### [NEW] [package.json](file:///e:/Sriram%20Workspace/ScoreBook/backend/package.json)
- Express.js
- TypeScript
- Node-cron (for data updates)
- Axios (for external APIs)
- Dotenv (environment variables)
- CORS middleware

##### [NEW] Source Structure (`backend/src/`)

##### [NEW] Server Configuration
- `index.ts` - Express server entry point
- `config.ts` - Configuration management
- `routes.ts` - API route definitions

##### [NEW] Services (`src/services/`)
- `dataService.ts` - Main data service with mock/real toggle
- `mockDataService.ts` - Returns mock data fixtures
- `realDataService.ts` - Fetches from external APIs
- `cacheService.ts` - Response caching logic

##### [NEW] Routes (`src/routes/`)
- `matches.routes.ts` - Match endpoints
- `sports.routes.ts` - Sports metadata endpoints
- `health.routes.ts` - Health check endpoint

##### [NEW] Mock Data (`src/mock-data/`)
```
mock-data/
├── cricket/
│   ├── live.json
│   ├── upcoming.json
│   └── completed.json
├── football/
│   └── (similar structure)
├── hockey/
├── soccer/
├── tennis/
└── badminton/
```

##### [NEW] Types (`src/types/`)
- `match.types.ts` - Backend match types
- `api.types.ts` - API response types

##### [NEW] API Endpoints

**Core Endpoints:**
```
GET  /api/health
     → { status: 'ok', mode: 'mock' | 'real' }

GET  /api/sports
     → [{ id: 'cricket', name: 'Cricket', icon: '...' }, ...]

GET  /api/matches/live
     → All live matches across sports

GET  /api/matches/:sport
     Query params: status=live|upcoming|completed
     → Matches for specific sport

GET  /api/match/:id
     → Detailed match information
```

##### [NEW] Environment Configuration
- `.env.example` - Example environment variables
- `.env` - Actual configuration (gitignored)

```env
# API Mode
USE_MOCK_DATA=true

# External API Keys (when using real data)
API_SPORTS_KEY=your_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Polling/Cache Settings
CACHE_TTL=60
```

---

### Documentation (`docs/`)

#### [NEW] [technical-architecture.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/technical-architecture.md)
- System architecture overview
- Component hierarchy diagrams
- Data flow diagrams
- Technology stack details
- Design decisions rationale

#### [NEW] [api-documentation.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/api-documentation.md)
- Complete API endpoint documentation
- Request/response examples
- Error handling
- Mock vs real data modes

#### [NEW] [testing-strategy.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/testing-strategy.md)
- Testing philosophy (mock as first defense)
- Unit testing guidelines
- E2E testing approach
- Detox setup and usage
- Cypress setup for web
- Future Appium/Playwright integration

#### [NEW] [mac-setup-guide.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/mac-setup-guide.md)
- Mac environment setup steps
- Installing Xcode
- Installing Node.js/npm
- Installing dependencies
- Running the app locally
- Running tests

#### [NEW] [component-library.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/component-library.md)
- Documentation of all reusable components
- Props, usage examples
- Design guidelines

#### [NEW] [antigravity-handoff.md](file:///e:/Sriram%20Workspace/ScoreBook/docs/antigravity-handoff.md)
- Complete project context for AntiGravity
- Architecture overview
- Key decisions made
- Next steps for development
- How to continue with AntiGravity on Mac

---

### GitHub Configuration

#### [NEW] [.github/workflows/ci.yml](file:///e:/Sriram%20Workspace/ScoreBook/.github/workflows/ci.yml)
GitHub Actions CI/CD pipeline:
- Lint checking (ESLint, Prettier)
- TypeScript type checking
- Unit tests (Jest)
- E2E tests (Detox on Android)
- Build validation
- Triggered on: push, pull_request to develop/main

#### [NEW] [.github/workflows/deploy.yml](file:///e:/Sriram%20Workspace/ScoreBook/.github/workflows/deploy.yml)
Deployment workflow (future):
- EAS Build triggers
- Backend deployment

---

### Root Configuration Files

#### [NEW] [README.md](file:///e:/Sriram%20Workspace/ScoreBook/README.md)
- Project overview
- Features list
- Tech stack
- Getting started (Quick Start)
- Project structure
- Development commands
- Testing commands
- Contributing guidelines
- Links to detailed documentation

#### [NEW] [.gitignore](file:///e:/Sriram%20Workspace/ScoreBook/.gitignore)
- Node modules
- Environment files
- Build artifacts
- OS files
- IDE configurations
- Expo cache

#### [NEW] [package.json](file:///e:/Sriram%20Workspace/ScoreBook/package.json) (Root)
- Monorepo scripts
- Workspaces configuration (if using)
- Shared dependencies

## Implementation Workflow

### Step 1: Initial Setup (This Session - Windows)
1. Create directory structure
2. Initialize Expo project in `mobile/`
3. Initialize Node.js backend in `backend/`
4. Install all dependencies
5. Create basic configuration files
6. Set up TypeScript configurations

### Step 2: Core Infrastructure
1. Implement backend API with mock data
2. Set up React Navigation structure
3. Configure state management (React Query + Zustand)
4. Implement theme system
5. Create basic component library

### Step 3: UI Implementation
1. Build sport tab navigation
2. Build match status tabs
3. Implement MatchCard component
4. Implement all supporting components
5. Wire up navigation flow

### Step 4: Data Integration
1. Connect frontend to backend API
2. Implement auto-polling for live matches
3. Add loading/error states
4. Implement pull-to-refresh
5. Add caching strategy

### Step 5: Testing Setup
1. Configure Detox for mobile E2E
2. Configure Cypress for web
3. Add testID attributes to all interactive elements
4. Write sample E2E tests
5. Write unit tests for components

### Step 6: Documentation & Handoff
1. Write all documentation files
2. Create comprehensive README
3. Document architecture decisions
4. Create Mac setup guide
5. Create AntiGravity handoff document

### Step 7: Git & GitHub
1. Initialize git repository
2. Create .gitignore
3. Make initial commit
4. Create GitHub repository
5. Push to remote
6. Set up branch protection rules

## Verification Plan

### Automated Tests

**Unit Tests:**
```bash
cd mobile && npm test
cd backend && npm test
```

**E2E Tests (Mobile):**
```bash
cd mobile && npm run test:e2e
```

**Web Tests:**
```bash
cd mobile && npm run test:web
```

### Manual Verification

1. **Mobile App (Android)**
   - Run `npx expo start` in mobile directory
   - Open on Android emulator
   - Verify all 6 sport tabs render
   - Verify Live/Upcoming/Completed tabs work
   - Verify match cards display correctly
   - Verify navigation between screens

2. **Mobile App (iOS - via Expo Go)**
   - Scan QR code with Expo Go on iPhone
   - Verify same functionality as Android

3. **Web App**
   - Open in browser (localhost:8081)
   - Verify mobile-first layout renders
   - Verify all interactions work

4. **Backend API**
   - Start backend server
   - Test all endpoints with curl/Postman
   - Verify mock data returns correctly
   - Verify health check endpoint

5. **GitHub Repository**
   - Verify all files pushed correctly
   - Verify README renders properly
   - Verify documentation is accessible
   - Verify CI workflow runs successfully

### Success Criteria

✅ All components render without errors  
✅ Navigation works across all tabs  
✅ Mock data displays in match cards  
✅ Backend API returns expected responses  
✅ Tests pass (unit + E2E samples)  
✅ TypeScript compiles without errors  
✅ All documentation is complete  
✅ GitHub repository is properly configured  
✅ Mac setup guide is comprehensive  
✅ AntiGravity handoff document provides full context  

## Next Steps After Mac Setup

Once development continues on Mac:

1. **Environment Setup**: Follow `docs/mac-setup-guide.md`
2. **First Run**: Verify app builds and runs on iOS Simulator
3. **Feature Development**: Start implementing additional features
4. **Real API Integration**: Integrate real sports APIs
5. **Enhanced Testing**: Expand test coverage
6. **UI Polish**: Refine design and animations
7. **Performance Optimization**: Optimize rendering and data fetching
