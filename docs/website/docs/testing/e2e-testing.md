---
sidebar_position: 7
title: E2E Testing
---

# E2E Testing Guide

Two layers of the pyramid drive the real, built app as a black box:

| Layer | Backend | Runs | Purpose |
| :--- | :--- | :--- | :--- |
| **Mocked acceptance (FE)** | Local backend in mock mode (`USE_MOCK_DATA=true`) | PR (smoke) · nightly (full) | Deterministic proof that the UI, navigation and state work, independent of live data |
| **Integrated E2E** | Deployed backend with live providers | Nightly · release tag · real devices before store release | Proof that the whole system works in a production-like environment |

The same flows serve both layers. Only the backend the app points at changes.

## Tooling

- **Mobile:** [Maestro](https://maestro.mobile.dev), with YAML flows run on an Android emulator (CI) or any simulator or device (local)
- **Web:** [Playwright](https://playwright.dev), running the React Native Web build in Chromium, WebKit and mobile viewports (`playwright.config.ts`)

## Maestro (mobile)

### Flow layout

```
.maestro/
├── flow.yaml           # entry point: launch, check sport tabs, then run each sport flow
└── flows/
    ├── cricket.yaml    # LIVE / UPCOMING / COMPLETED tabs for one sport
    ├── football.yaml
    ├── hockey.yaml
    ├── soccer.yaml
    ├── tennis.yaml
    └── badminton.yaml
```

Each sport flow taps the sport tab, then each status tab, and asserts on list and card testIDs plus known fixture data (team names, tournaments). Because the assertions depend on mock fixture content, a fixture change in `backend/src/mock-data/` may need a matching flow update.

### Running locally

```bash
# 1. Start the backend in mock mode
cd backend && USE_MOCK_DATA=true npm run dev

# 2. Start the app on an emulator / simulator
cd mobile && npm run android   # or npm run ios

# 3. Run the flows (from repo root)
npm run test:e2e:mobile        # = maestro test .maestro/flow.yaml
maestro test .maestro/flows/cricket.yaml   # a single sport
```

### In CI

`.github/workflows/maestro.yml` runs on PRs to `main` / `develop` that touch `mobile/`, `backend/`, `.maestro/` or the workflow itself. It:

1. Starts the backend with `USE_MOCK_DATA=true` and waits for `/api/health` to report `"mode":"mock"`.
2. Runs `expo prebuild` and `./gradlew assembleDebug` to build a debug APK.
3. Enables KVM so the emulator runs hardware-accelerated.
4. Boots an API 30 emulator (`reactivecircus/android-emulator-runner`), installs the APK and runs `maestro test .maestro/flow.yaml`.

A debug APK doesn't embed its JS bundle; it loads it from Metro on port 8081 at launch. Any job that runs a debug build must have Metro running and reachable from the emulator (`adb reverse tcp:8081 tcp:8081`).

## Playwright (web)

```bash
# Start the web dev server first
cd mobile && npm run web

# From repo root
npm run test:e2e:web           # = playwright test
```

Specs live in `tests/`. Only a placeholder smoke spec exists today (`tests/web-smoke.spec.ts`), and Playwright isn't yet part of any CI workflow. See [current status and gaps](./strategy.md#current-status-and-gaps).

## TestID convention

All interactive elements have consistent testIDs for E2E automation.

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

Prefer asserting on testIDs over display text where the text comes from data. Text assertions break whenever fixtures change.

## Critical E2E paths

Keep this list short: it's the top of the pyramid. Anything that can be proven lower down belongs in [component](./component-testing.md) or [backend](./backend-testing.md) tests.

1. App launches and shows cricket matches
2. User can navigate to all 6 sports
3. User can switch between Live/Upcoming/Completed
4. Pull-to-refresh updates match list
5. Live matches update automatically
6. Error states allow retry
7. Empty states show when no matches

## Related

- [Test Strategy](./strategy.md)
- [Test Data](./test-data.md): mock mode and fixtures
- [Running Tests](./running-tests.md)
