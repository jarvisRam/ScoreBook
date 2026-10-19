---
sidebar_position: 2
title: Demo Video
description: A short walkthrough of ScoreBook on the web, an iOS simulator and an Android emulator, running against the mocked backend.
---

# Demo Video

A walkthrough of ScoreBook running on all three platforms, about 80 seconds long.

<video
  controls
  preload="metadata"
  poster="/video/scorebook-demo-poster.jpg"
  style={{ width: '100%', maxWidth: 960, borderRadius: 8 }}
>
  <source src="/video/scorebook-demo.mp4" type="video/mp4" />
  Your browser does not support embedded video. [Download the demo](/video/scorebook-demo.mp4).
</video>

## What you are watching

| Segment | Platform | How it was run |
|---------|----------|----------------|
| 1 | **Web** | A local production build (`npx expo export --platform web`) served from localhost, in Chromium |
| 2 | **iOS** | A debug build on the iPhone 17 Pro simulator, loading JavaScript from Metro |
| 3 | **Android** | A debug build on the Pixel 9 Pro emulator, loading JavaScript from Metro |

In every segment the app browses the Live, Upcoming and Completed tabs and steps through the sports.

## Mocked backend

All three clients talk to the same local backend started in mock mode, so the scores are the deterministic data from the [mock data service](./api/overview.md) and never touch a live provider:

```bash
cd backend
DATA_MODE=mock PORT=3000 npx ts-node src/index.ts
```

The iOS simulator and the web build reach it at `http://localhost:3000/api`. The Android emulator reaches it at `http://10.0.2.2:3000/api`, the emulator's alias for the host machine. See [Environment Switching](./mobile/environment-switching.md) for how the app picks its endpoint.

The same flow is what the [Maestro](./testing/layers/frontend-acceptance.md) and Playwright suites drive in CI, with assertions added.

## Re-recording

| Platform | Capture |
|----------|---------|
| Web | Playwright with `recordVideo` against the served build |
| iOS | `xcrun simctl io booted recordVideo demo-ios.mp4` |
| Android | `adb shell screenrecord /sdcard/demo.mp4` |

The three clips were driven by the same Maestro flow on iOS and Android, trimmed, and joined with `ffmpeg`.
