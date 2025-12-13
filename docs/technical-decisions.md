# ScoreBook - Technical Decisions Summary

## ✅ Confirmed Decisions

| Category | Decision | Notes |
|----------|----------|-------|
| **Framework** | Expo (React Native) | Custom Development Client for flexibility |
| **Language** | TypeScript | Type safety + better testing automation |
| **Navigation** | React Navigation v6 | Proven, stable, community standard |
| **Styling** | Styled Components | Consistent theming across platforms |
| **Testing IDs** | Yes - All interactive elements | For Appium/Detox compatibility |
| **E2E Framework** | Detox (primary) | Appium support planned for future |
| **Web Testing** | Cypress (initial) | Playwright migration planned |
| **Android Testing** | Detox + Appium | Local testing on Windows |
| **Backend** | Node.js (custom) | Support both mocked & real data |
| **Real-time Updates** | Polling (30-60 sec) | Auto-refresh when app active |
| **Repository** | ScoreBook (monorepo) | Single repo for all platforms |
| **CI/CD** | GitHub Actions | Automated testing pipeline |
| **Git Strategy** | Git Flow | Feature branches → develop → main |
| **App Name** | ScoreBook | Consistent across all platforms |
| **Web Approach** | Mobile-first | Simple, no visual distortions |

---

## 🤔 Pending Decisions

### 1. State Management (Need Explanation)

You asked for more information on **React Query + Zustand**. Here's the breakdown:

#### Option A: React Query + Zustand (Recommended) ⭐

**React Query** (TanStack Query):
- **Purpose**: Manages server/API state
- **Handles**: Data fetching, caching, synchronization, background updates
- **Benefits**: 
  - Automatic polling/refetching (perfect for live scores!)
  - Built-in caching (reduces API calls)
  - Loading/error states handled automatically
  - Optimistic updates
- **Example**: Fetch live match scores every 30 seconds automatically

**Zustand**:
- **Purpose**: Manages client/UI state
- **Handles**: User preferences, selected tab, theme, filters
- **Benefits**:
  - Lightweight (1KB)
  - No boilerplate
  - Easy to test
- **Example**: Remember which sport tab user selected

**Why This Combo?**
```
React Query = "What data from the server?"
Zustand = "What's the app doing right now?"
```

Separation of concerns makes code cleaner and testing easier.

#### Option B: Redux Toolkit (Traditional)

- **Purpose**: Manages all state (server + client)
- **Benefits**: 
  - Industry standard
  - Excellent DevTools
  - Widely documented
- **Drawbacks**:
  - More boilerplate code
  - Heavier bundle size
  - Manual cache management
  - Steeper learning curve

#### Option C: Zustand Only (Simpler)

- **Purpose**: Manages everything in one store
- **Benefits**: Minimal setup
- **Drawbacks**: Manual API caching, no automatic refetching

#### My Recommendation: React Query + Zustand

For ScoreBook specifically:
- ✅ Auto-polling perfect for live scores
- ✅ Background sync when app returns to foreground
- ✅ Cache management (avoid excessive API calls)
- ✅ Easy to mock for testing (just mock fetch)
- ✅ Less code to maintain

**Would you like to go with React Query + Zustand, or prefer one of the alternatives?**

---

### 2. Git Flow Clarification

You asked what I meant by "Git Flow" strategy:

#### Git Flow (What I'm Proposing)

```
main (production)
  ├── develop (integration)
      ├── feature/live-scores
      ├── feature/match-details
      ├── feature/api-integration
      └── bugfix/score-display
```

**Workflow**:
1. Create feature branch from `develop`
2. Work on feature, commit changes
3. PR to `develop` for review
4. After testing, merge `develop` → `main` for release
5. Tag releases (v1.0.0, v1.1.0, etc.)

**Benefits**:
- Clean separation of work-in-progress vs production
- Easy to review changes
- Can test multiple features before release
- Matches GitHub Actions CI/CD well

**Alternative: Trunk-Based (Simpler)**
```
main (only branch)
  ├── feature/live-scores (short-lived)
  └── feature/match-details (short-lived)
```
- Commit directly to main or very short-lived branches
- Faster for solo development
- Less overhead

**For ScoreBook**: Git Flow is better since you want proper CI/CD and test automation demos. Shows professional workflow.

**Is standard Git Flow okay, or do you prefer something simpler?**

---

## 📝 Technical Clarifications

### Team Logos Strategy

**Your Question**: "How are we planning to get the icons of these teams? Should it just be stored in a specific section of the repo as the assets of this app?"

**Answer**:

#### Approach: Hybrid (Recommended)

1. **Generic Sport Icons** (stored in repo)
   - Cricket ball, football, tennis racket, etc.
   - Used as fallbacks when team logos unavailable
   - Stored in `assets/icons/sports/`

2. **Team Logos** (dynamic from API or CDN)
   - If API provides logo URLs → fetch and cache
   - If API doesn't provide → use team color + initials
   - Example: "Michigan State" → Green circle with "MS"

3. **Popular Teams** (stored in repo)
   - Top 50-100 popular teams (NFL, NBA, Premier League, etc.)
   - Small PNG/SVG logos (~10KB each)
   - Stored in `assets/logos/teams/`
   - Use as priority over generic icons

**File Structure**:
```
assets/
  icons/
    sports/
      cricket.svg
      football.svg
      tennis.svg
  logos/
    teams/
      nfl/
        patriots.png
        cowboys.png
      nba/
        lakers.png
```

**Dynamic Logic**:
```typescript
1. Check if API provides logo URL → use it
2. Check if we have logo in assets → use it
3. Generate colored circle with team initials
4. Fallback to sport icon
```

**Benefits**:
- Fast loading (cached assets)
- Works offline
- Professional look for major teams
- Graceful degradation for unknown teams

**Sound good?**

---

### Home/Away Indicators

**Your Comment**: "Home/Away indicators wouldn't apply for games such as tennis/badminton."

**You're absolutely right!** ✅

**Updated Logic**:

#### Team Sports (Show H/A)
- ✅ Cricket (Test/ODI/T20)
- ✅ American Football
- ✅ Hockey  
- ✅ Soccer

#### Individual Sports (No H/A)
- ❌ Tennis
- ❌ Badminton

**Implementation**:
```typescript
const sportConfig = {
  cricket: { hasHomeAway: true, hasVenue: true },
  football: { hasHomeAway: true, hasVenue: true },
  hockey: { hasHomeAway: true, hasVenue: true },
  soccer: { hasHomeAway: true, hasVenue: true },
  tennis: { hasHomeAway: false, hasVenue: true }, // Show venue only
  badminton: { hasHomeAway: false, hasVenue: true }
};
```

For tennis/badminton, we'll show:
- Player names / pairing
- Current score
- Set scores
- Tournament name
- Venue/location
- Round (Quarterfinal, Semifinal, etc.)

**This makes sense, right?**

---

## 🔧 Backend Architecture (Node.js)

**Your Request**: "Build a simple backend on Node.js for both mocked & unmocked testing"

**Proposed Stack**:

```typescript
Backend:
- Node.js + Express.js
- TypeScript
- REST API endpoints

Data Sources:
- Real: API-Sports (RapidAPI) or similar
- Mock: JSON fixtures in /mock-data

Features:
- Environment flag: USE_MOCK_DATA=true/false
- Rate limiting (to avoid API overages)
- Response caching (Redis or in-memory)
- Health check endpoint
```

**API Endpoints**:
```
GET /api/sports          → List of supported sports
GET /api/matches/live    → Live matches (all sports)
GET /api/matches/cricket → Cricket matches (live/upcoming/completed)
GET /api/match/:id       → Detailed match info
GET /api/health          → Backend health status
```

**Mock Data Strategy**:
```
src/
  backend/
    services/
      real-data-service.ts   → Calls real APIs
      mock-data-service.ts   → Returns fixtures
      data-service.ts        → Switches based on config
    mock-data/
      cricket-live.json
      football-live.json
      tennis-live.json
```

**Testing Scenarios**:
1. **Mock Mode**: Predictable data, test edge cases (tie scores, overtime, etc.)
2. **Real Mode**: Live integration testing, verify real API handling
3. **Hybrid Mode**: Mock certain sports, real others

**Deployment Options**:
- **Local**: Run on `localhost:3000` during development
- **Cloud**: Deploy to Vercel/Railway/Render (free tier)
- **Docker**: Containerize for consistent environments

**Does this backend approach work for your needs?**

---

## 🎯 Next Steps

Once you confirm the pending decisions:

1. ✅ **State Management**: React Query + Zustand (or alternative?)
2. ✅ **Git Flow**: Standard Git Flow (or simpler?)
3. ✅ **Team Logos**: Hybrid approach (repo + dynamic)
4. ✅ **Backend**: Node.js with mock/real toggle

I'll create:
- 📋 Detailed implementation plan
- 🏗️ Project scaffolding
- 🎨 Component architecture
- 🧪 Testing setup
- 📚 Complete documentation

**Ready to proceed once you confirm the above! Any other questions?**
