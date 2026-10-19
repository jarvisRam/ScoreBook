---
sidebar_position: 1
title: Testing Overview
---

# Testing Overview

ScoreBook's testing approach rests on one principle: **catch each class of defect at the cheapest layer that can catch it.** A type error should never wait for an emulator to find it, and a broken user journey should never reach an app store review.

This page is the testing philosophy. It defines the layers and the model we use to balance them. For who runs what, when and how fast, see the [Test Strategy](./strategy.md).

## Testing Philosophy

### The layers

| # | Layer | What it is |
|---|-------|------------|
| 1 | **Static checks** | Analysis of the code without running it, in four parts. **Compilation & lint** proves the code compiles and follows our rules. **Code quality & security analysis** catches bugs, vulnerabilities and maintainability problems in new code. **AI code review** gives an automated review of every pull request diff. **Dependency security** checks the third-party packages we import for known vulnerabilities. |
| 2 | **Unit** | A single function, hook or component tested in isolation, with every dependency mocked. Runs in milliseconds and pins down logic and edge cases. |
| 3 | **Mocked acceptance (FE)** | The real app (mobile build on an emulator, web build in a browser) driven through user journeys the way a user would, against a mock backend. Proves the UI, navigation and state hang together without depending on live data. |
| 4 | **Mocked acceptance (BE)** | The real HTTP API exercised end-to-end in-process, with the third-party sports providers stubbed. Proves routing, validation, data transformation and error handling. |
| 5 | **Contract** | Checks that two sides of a boundary agree on its shape: the mobile app ↔ our backend (consumer-driven, with Pact), and our backend ↔ third-party providers (schema checks). Catches integration breaks without running both sides together. |
| 6 | **Integrated E2E** | The full stack with nothing mocked: the app against the deployed backend and live providers. The final proof that the system works as a whole in a production-like environment. |

### The test pyramid

We follow the **test pyramid** model: a broad base of fast, cheap, isolated checks, and progressively fewer tests as they become slower, costlier and more realistic.

<div className="test-pyramid" role="img" aria-label="Test pyramid: static checks at the base, then unit, mocked acceptance, contract, and integrated E2E at the top">
  <div className="test-pyramid__tier test-pyramid__tier--e2e">Integrated E2E<small>a handful of critical journeys</small></div>
  <div className="test-pyramid__tier test-pyramid__tier--contract">Contract<small>every consumed endpoint and provider</small></div>
  <div className="test-pyramid__tier test-pyramid__tier--acceptance">Mocked acceptance (FE &amp; BE)<small>key user journeys and API behaviours</small></div>
  <div className="test-pyramid__tier test-pyramid__tier--unit">Unit<small>the bulk of our tests</small></div>
  <div className="test-pyramid__tier test-pyramid__tier--static">Static checks<small>compilation &amp; lint · code quality &amp; security · dependency security · AI review, on every change</small></div>
</div>
<div className="test-pyramid__axis">
  <span>⬇ Base: more tests · faster · cheaper · more isolated</span>
  <span>Top: fewer tests · slower · higher confidence · more brittle ⬆</span>
</div>

The pyramid leads to four rules:

- **Push tests down.** Write each test at the lowest layer that can prove the behaviour. If a unit test can prove it, it doesn't belong in E2E.
- **E2E covers only the critical journeys.** The top of the pyramid proves the system is wired together. It doesn't try to cover every edge case.
- **Fix a bug at its lowest layer.** A defect found by E2E or in production gets a regression test at the lowest layer that can reproduce it.
- **Avoid the ice-cream cone.** A suite that leans on slow, flaky UI tests with a thin base of unit tests is slow to run and slow to diagnose. If the top grows faster than the base, rebalance.

## Where to go next

- [Test Strategy](./strategy.md): every layer's trigger, owner, tooling and runtime target
- [Testing Layers](/testing/layers): one page per layer, each with a decision matrix behind its tool choice
  - [Static Checks](./layers/static-checks.md)
    - [Dependency Security](./layers/dependency-security.md)
  - [Unit Testing](./layers/unit-testing.md)
  - [Mocked Acceptance (FE)](./layers/frontend-acceptance.md)
  - [Mocked Acceptance (BE)](./layers/backend-acceptance.md)
  - [Contract Testing](./layers/contract-testing.md)
  - [Integrated E2E](./layers/integrated-e2e.md)
- [Performance Test Strategy](./performance-testing-strategy.md): k6 suites for the backend, the frontend and the hosted environment, with baseline monitoring and a Grafana dashboard
- [Test Data](./test-data.md): fixtures, mock data and data modes
- [Running Tests](./running-tests.md): commands, folder layout and "what do I run?"
