---
sidebar_position: 1
title: Introduction
description: What ScoreBook is, how the repository is laid out, and where to start reading.
---

# ScoreBook

ScoreBook is a cross-platform sports scoreboard. One React Native (Expo) codebase runs on **iOS, Android and the web**, and talks to a Node.js / Express backend that serves live, upcoming and completed matches for six sports: cricket, American football, hockey, soccer, tennis and badminton.

It is also a worked example of a **test automation strategy**: every layer of the test pyramid, from static checks to integrated E2E, is implemented and documented here.

:::tip See it running
[Watch the short demo](./demo.md) of the app on an iOS simulator, an Android emulator and a local web build, all against the mocked backend.
:::

## How the repository is laid out

| Folder | What lives there |
|--------|------------------|
| `mobile/` | The Expo app (iOS, Android, web): screens, components, hooks, state |
| `backend/` | The Express API, the mock data service and the provider integrations |
| `tests/` | Playwright web E2E specs |
| `.maestro/` | Maestro mobile E2E flows (local emulator and BrowserStack) |
| `.github/workflows/` | The CI/CD pipelines described in [References](./references.md) |
| `docs/website/` | This documentation site |

## Where to start

| I want to… | Read |
|------------|------|
| Run the app locally | [Installation](./getting-started/installation.md) and [Quick Start](./getting-started/quick-start.md) |
| Understand how it fits together | [System Architecture](./architecture/system-architecture.md) |
| Call or extend the API | [API Overview](./api/overview.md) |
| Understand the testing approach | [Testing Overview](./testing/overview.md) and [Test Strategy](./testing/strategy.md) |
| Assess or raise the quality of a project | [Quality Maturity Model](./testing/quality-maturity-model.md) |
| Find the dashboards and pipelines | [References](./references.md) |
