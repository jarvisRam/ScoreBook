---
sidebar_position: 3
---

# Project Structure

Understanding the ScoreBook codebase organization.

## Root Structure

```
ScoreBook/
├── backend/                 # Node.js Express backend
├── mobile/                  # React Native mobile app
├── docs/                    # Documentation (you are here!)
└── README.md               # Main project README
```

## Backend Structure

```
backend/
├── src/
│   ├── routes/             # API route handlers
│   │   ├── health.routes.ts
│   │   ├── sports.routes.ts
│   │   ├── matches.routes.ts
│   │   └── match.routes.ts
│   ├── services/           # Business logic
│   │   └── mockDataService.ts
│   ├── mock-data/          # JSON mock data
│   │   ├── cricket/
│   │   ├── football/
│   │   ├── hockey/
│   │   ├── soccer/
│   │   ├── tennis/
│   │   └── badminton/
│   ├── types/              # TypeScript types
│   └── index.ts            # Server entry point
├── .env.example            # Environment variables template
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Mobile Structure

```
mobile/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── MatchCard.tsx
│   │   ├── TeamDisplay.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── LiveIndicator.tsx
│   │   ├── VenueInfo.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── EmptyState.tsx
│   ├── screens/            # Screen components
│   │   └── SportScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── SportTabNavigator.tsx
│   ├── services/           # API services
│   │   ├── api.ts
│   │   └── matchService.ts
│   ├── store/              # State management
│   │   ├── useMatches.ts   # React Query hooks
│   │   └── useAppStore.ts  # Zustand store
│   ├── types/              # TypeScript types
│   │   ├── sport.types.ts
│   │   ├── match.types.ts
│   │   ├── api.types.ts
│   │   └── navigation.types.ts
│   ├── constants/          # App constants
│   │   ├── sports.ts
│   │   └── config.ts
│   └── theme/              # Theme configuration
│       └── theme.ts
├── App.tsx                 # Main app entry point
├── app.json                # Expo configuration
└── package.json            # Dependencies
```

## Key Files

### Backend

| File | Purpose |
|------|---------|
| `src/index.ts` | Express server setup |
| `src/routes/*.routes.ts` | API endpoint definitions |
| `src/services/mockDataService.ts` | Mock data loader |
| `src/mock-data/**/*.json` | Match data for each sport |

### Mobile

| File | Purpose |
|------|---------|
| `App.tsx` | Main app component with providers |
| `src/navigation/RootNavigator.tsx` | Navigation setup |
| `src/screens/SportScreen.tsx` | Main screen for displaying matches |
| `src/components/MatchCard.tsx` | Primary match display component |
| `src/store/useMatches.ts` | React Query hooks for data fetching |

## Understanding the Flow

1. **App starts** → `App.tsx` sets up providers
2. **Navigation** → `RootNavigator` → `SportTabNavigator`
3. **Each sport tab** → `SportScreen` with status tabs
4. **Data fetching** → `useMatches` hook → API call → Backend
5. **Data display** → `MatchCard` components in FlatList

## Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend environment variables |
| `mobile/app.json` | Expo app configuration |
| `backend/tsconfig.json` | TypeScript config for backend |
| `mobile/tsconfig.json` | TypeScript config for mobile |

## Next Steps

- [System Architecture](../architecture/system-architecture.md)
- [API Reference](../api/overview.md)
- [Frontend Components](../frontend/components/MatchCard.md)
