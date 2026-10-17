---
sidebar_position: 4
title: Mocked Acceptance (FE)
description: The real app driven through user journeys with Maestro (mobile) and Playwright (web), against the backend in mock mode.
---

# Mocked Acceptance Testing (Frontend)

These tests drive the real, built app as a black box through user journeys: the Android build on an emulator and the web build in a browser. The backend runs in mock mode (`USE_MOCK_DATA=true`), so every run sees the same data. The tests prove the UI, navigation and state hang together, and when they fail, the cause is our code rather than live data.

The same flows are reused against the deployed backend in [Integrated E2E](./integrated-e2e.md).

| Platform | Tool | Runs |
| :--- | :--- | :--- |
| Mobile (Android / iOS) | Maestro | PR: smoke flows · nightly: full flows |
| Web (React Native Web) | Playwright | PR: smoke specs · nightly: full suite across browsers |

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

## Decision matrix: mobile

| Criteria | **Maestro** | Detox | Appium |
| :--- | :--- | :--- | :--- |
| Black-box: no test code inside the app | ✅ | ❌ gray-box, links a native test library into the app | ✅ |
| Works with Expo prebuild without native config | ✅ installs any APK / app | ⚠️ needs native build config and an Expo config plugin | ✅ |
| Built-in waiting / flake tolerance | ✅ automatic waits and retries | ✅ idle synchronization | ⚠️ manual waits |
| One flow for Android and iOS | ✅ | ✅ | ⚠️ often platform branches |
| Authoring effort | ✅ declarative YAML, readable by non-developers | ⚠️ JS, with a Detox-specific API | ❌ WebDriver boilerplate |
| Runs on real devices and cloud farms | ✅ incl. Maestro Cloud | ⚠️ simulators/emulators mainly | ✅ broadest farm support |
| CI setup effort | ✅ one CLI install | ⚠️ native build + Detox CLI | ❌ Appium server + drivers |

### Why Maestro

- **It treats the app as a black box.** Maestro installs the same APK we ship and drives it through the accessibility layer, so there's nothing to link into the app and no native config to maintain on top of Expo prebuild.
- **Flows are short, declarative YAML.** Testers and developers can both read and write them, and built-in waits remove most of the hand-tuned sleeps that make mobile E2E flaky.
- **The same flows scale from emulator to real devices**, which lets us reuse them for the [release suite](../strategy.md#-release-pre-production).

## Decision matrix: web

| Criteria | **Playwright** | Cypress | Selenium WebDriver |
| :--- | :--- | :--- | :--- |
| Chromium, Firefox **and WebKit (Safari)** | ✅ | ⚠️ WebKit experimental | ✅ with real browsers |
| Mobile viewport and device emulation | ✅ device profiles (Pixel 5, iPhone 12) | ⚠️ viewport only | ⚠️ |
| Auto-waiting assertions | ✅ | ✅ | ❌ |
| Parallel runs in CI without a paid service | ✅ workers and sharding | ⚠️ parallelization via Cypress Cloud | ⚠️ needs a Grid |
| Network interception per test | ✅ `page.route` | ✅ `cy.intercept` | ❌ |
| Debugging failed CI runs | ✅ trace viewer | ✅ time-travel UI | ⚠️ |

### Why Playwright

- **It covers real Safari behaviour.** WebKit support plus mobile device profiles let us check the React Native Web build the way iPhone users see it. That's where RN Web layout bugs tend to appear.
- **Parallelism and traces are free.** Sharding across CI workers and the trace viewer for failed runs come built in, with no paid dashboard needed to stay inside the time budget.

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

Specs live in `tests/`. Only a placeholder smoke spec exists today (`tests/web-smoke.spec.ts`), and Playwright isn't yet part of any CI workflow.

## TestID convention

All interactive elements have consistent testIDs for automation.

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

Prefer asserting on testIDs over display text where the text comes from data. Text assertions break whenever fixtures change, and they can't work against live data at all.

## Critical journeys

Keep this list short. Anything that can be proven lower down belongs in [unit tests](./unit-testing.md).

1. App launches and shows cricket matches
2. User can navigate to all 6 sports
3. User can switch between Live/Upcoming/Completed
4. Pull-to-refresh updates match list
5. Live matches update automatically
6. Error states allow retry
7. Empty states show when no matches

## Related

- [Integrated E2E](./integrated-e2e.md): the same flows against the deployed backend
- [Test Data](../test-data.md): mock mode and fixtures
- [Running Tests](../running-tests.md)
