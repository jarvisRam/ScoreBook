---
sidebar_position: 99
title: References
description: Links to the quality dashboards, contract broker, AI code review, real-device cloud and every GitHub Actions pipeline used by ScoreBook.
---

# References

Where to look when you want to see the results behind the [testing strategy](./testing/strategy.md): the third-party dashboards and every CI/CD pipeline.

:::note Sign-in required
SonarQube Cloud, Pactflow, Gitar and BrowserStack are private to the ScoreBook account. The links open the right dashboard, but you need to be signed in with access to it.
:::

## Quality tooling

| Tool | What it does for ScoreBook | Layer | Link |
|------|---------------------------|-------|------|
| **SonarQube Cloud** | Quality gate on new code: bugs, vulnerabilities, hotspots, maintainability and unit-test coverage. | [Static checks](./testing/layers/static-checks.md#code-quality--security-analysis) | [Project dashboard](https://sonarcloud.io/project/overview?id=jarvisRam_ScoreBook) |
| **Pact (Pactflow)** | Broker for the consumer-driven contract between the mobile app and the backend. Answers "is it safe to deploy?". | [Contract testing](./testing/layers/contract-testing.md) | [Pactflow broker](https://fanduel-a13fd6f7.pactflow.io/pacticipants?filter=favorites) · [Pact docs](https://docs.pact.io) |
| **Gitar** | AI review of every pull request diff, and fixes for failing CI checks. Advisory, never blocking. | [Static checks](./testing/layers/static-checks.md#ai-code-review) | [Gitar](https://app.gitar.ai/sriram20mail/dashboard) |
| **BrowserStack** | Real Android devices (App Automate) running the Maestro smoke flow nightly. | [Integrated E2E](./testing/layers/integrated-e2e.md) | [App Automate dashboard](https://app-automate.browserstack.com/overview) |

## GitHub Actions pipelines

All pipelines live in [`.github/workflows`](https://github.com/jarvisRam/ScoreBook/tree/main/.github/workflows). The [Actions tab](https://github.com/jarvisRam/ScoreBook/actions) shows every run across all of them.

### Pull request and main-branch gates

| Pipeline | Runs on | What it checks | Runs |
|----------|---------|----------------|------|
| **CI/CD Pipeline** | Push and PR to `main`, `develop` | Lint, type check, unit and integration tests with coverage, SonarQube Cloud scan, web build, Android build | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/ci.yml) |
| **Contract Tests** | PR and push to `main` | Publishes the consumer pact to Pactflow, verifies the provider and runs `can-i-deploy` | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/contract-tests.yml) |
| **Dependency Review** | PR to `main`, `develop` | Blocks a PR that introduces a dependency with a known vulnerability | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/dependency-review.yml) |
| **Web E2E (Mocked)** | PR to `main`, `develop` | Playwright against the web build, with every API call served from fixtures | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/web-e2e.yml) |
| **Web Integration (Candidate API)** | PR and manual | The same Playwright specs against a candidate backend that is not deployed yet | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/web-e2e-integration.yml) |
| **Mobile E2E (Maestro)** | PR to `main`, `develop` (path filtered) | Android emulator smoke test of every sport tab, against the mock backend | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/maestro.yml) |

### Scheduled pipelines

These run against deployed systems and real providers, so they stay out of the PR path. A failure opens an issue rather than blocking a merge.

| Pipeline | Schedule (UTC) | What it checks | Runs |
|----------|----------------|----------------|------|
| **Live API Tests (Hosted)** | Every 6 hours | Unmocked API tests against the deployed backend | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/live-api-tests.yml) |
| **Web E2E (Hosted)** | Daily, 02:30 | Playwright against the deployed site and real backend | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/web-e2e-live.yml) |
| **Mobile E2E (BrowserStack Android)** | Daily, 03:30 | Maestro smoke flow on a real Android device | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/maestro-browserstack.yml) |
| **Third-Party Contract Drift** | Daily, 06:00 | A fresh Cricbuzz response validated against our provider schema | [View runs](https://github.com/jarvisRam/ScoreBook/actions/workflows/thirdparty-contract-drift.yml) |

## Source and project links

- [ScoreBook repository](https://github.com/jarvisRam/ScoreBook)
- [Open issues](https://github.com/jarvisRam/ScoreBook/issues)
- [Pull requests](https://github.com/jarvisRam/ScoreBook/pulls)
- [Hosted documentation](https://scorebook-docs.vercel.app)
