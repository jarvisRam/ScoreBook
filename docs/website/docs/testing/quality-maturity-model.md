---
sidebar_position: 3
title: Quality Maturity Model
description: Four maturity levels (Bronze, Silver, Gold, Platinum) for every test layer, so teams that own different features can see where they are and agree where to go next.
---

# Quality Maturity Model (QMM)

The [Test Strategy](./strategy.md) says what good looks like for each layer of the pyramid. The Quality Maturity Model says **how a team gets there**, in four steps: 🥉 **Bronze**, 🥈 **Silver**, 🥇 **Gold** and 💎 **Platinum**.

The model measures how mature a team's **test automation practice** is. It doesn't measure which scenarios a team tests. Many teams own different features, so the model asks *when tests run, how new tests are found, and when they get written*, which any team can answer for its own area.

- **Bronze** is the entry level. **Platinum** is the target, and matches the "what good looks like" in the Test Strategy.
- Each level includes everything in the levels below it.

## The levels at a glance

Test layers are the rows and maturity levels are the columns.

| Layer | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| [**Compile & lint**](#compile--lint) | Errors block merge | Warnings can't grow | No warnings in changed files | No warnings anywhere |
| [**Code quality & security**](#code-quality--security) | Ratings C, ≤ 8% duplication | Ratings B, ≤ 5% | Ratings A, ≤ 4% | Ratings A, ≤ 3% |
| [**AI code review**](#ai-code-review) | Runs, advisory | Every comment answered | Fast feedback, custom rules | Required check, rules reviewed |
| [**Unit**](#unit) | ≥ 30% new-code coverage | ≥ 45% | ≥ 60% | ≥ 80% |
| [**Mocked acceptance (FE)**](#mocked-acceptance-fe) | Smoke tests for existing features, **on a schedule** | Smoke tests **on every PR** | **New scenarios identified**, scripted as separate tasks | New scenarios **scripted in the sprint** |
| [**Mocked acceptance (BE)**](#mocked-acceptance-be) | Smoke tests for existing endpoints, **on a schedule** | Smoke tests **on every PR** | **New scenarios identified**, scripted as separate tasks | New scenarios **scripted in the sprint** |
| [**Contract**](#contract) | Provider schema tests for existing providers, on a schedule | Schema and Pact checks on every PR | New contracts identified, `can-i-deploy` blocks | Contracts changed in the same sprint |
| [**Integrated E2E**](#integrated-e2e) | Existing journeys scripted, run before a release | Run on a schedule and every release | **New journeys identified**, scripted as separate tasks | New journeys **scripted in the sprint** |

:::note Dependency security is not in the model
[Dependency security](./layers/dependency-security.md) applies in full to every piece of code, so it has no levels. A **Security rating of A** and **100% of security hotspots reviewed** are also the same at every level.
:::

## The automation ladder

The acceptance, contract and E2E layers all climb the same ladder, so it's defined once here. Each layer's table below applies it to that layer.

| | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| **Existing features** | A smoke test for each feature the team already owns | Same | Same | Same |
| **When the tests run** | On a schedule | **On every PR** | On every PR | On every PR |
| **New scenarios** | Not yet identified | Not yet identified | **Identified for every story**, in refinement or on the PR | Identified for every story |
| **Writing the tests** | Not yet planned | Not yet planned | **Separate automation tasks**, picked up after the feature ships | **In the same sprint**, part of the Definition of Done |

- **Smoke test**: one quick happy-path check that a feature still works. It isn't a full regression suite.
- **Existing** means the features in production on the day the team adopts the model. Everything built afterwards is a **new scenario**.
- **Identified** means each story is assessed for the acceptance scenarios it adds, and the list is written on the ticket.

## How to use the model

1. **Assess each layer on its own.** A team might be Gold on static checks and Bronze on contract. That profile shows where to invest next.
2. **A layer reaches a level only when every criterion in that column is met**, and every criterion of the levels below. Meeting 3 of 4 Silver criteria is still Bronze.
3. **Assess a team against the features it owns.** Teams don't need to cover each other's areas.
4. **Set a target per layer, then ratchet.** Agree the next level for each layer, and move the SonarCloud gate up as the team reaches it. Don't move a gate down.

:::tip Comparing teams
Compare teams' profiles, not a single score. A team that's Platinum on static checks and Bronze on contract has a clear next step. A team that's Silver across the board has a different one.
:::

---

## Compile & lint

[Layer page](./layers/static-checks.md#compilation--lint)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Type check and lint **errors** | Block merge in CI | Same | Same | Same |
| Lint **warnings** | Allowed | Count can't increase | **0** in changed files | **0** everywhere (`--max-warnings 0`) |
| TypeScript strictness | `strict` off for legacy code | `strict` on for new files | `strict` on everywhere | `strict` on, no explicit `any`, type-aware rules |
| Run time | < 3 min | < 2 min | < 1 min | < 1 min |

## Code quality & security

[Layer page](./layers/static-checks.md#code-quality--security-analysis)

These are the SonarCloud gate conditions on **new code**, one gate per level (see [SonarCloud gates](#sonarcloud-gates)). A rating condition fails when the rating is *worse than* the value, so Bronze accepts a C and fails a D. A gate failure blocks merge at every level.

| Criterion (new code) | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Maintainability rating | C or better | B or better | **A** | **A** |
| Reliability rating | C or better | B or better | **A** | **A** |
| Duplicated lines | ≤ 8% | ≤ 5% | ≤ 4% | ≤ **3%** |

Security rating A and 100% of hotspots reviewed hold at every level, and coverage is in the [Unit](#unit) table.

## AI code review

[Layer page](./layers/static-checks.md#ai-code-review)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Reviewer runs on PRs | Yes, advisory | Yes | Yes | Yes |
| Comments | Optional to answer | Each one resolved or dismissed with a reason before merge | Same | Same, enforced by a required check |
| First feedback after a push | No target | < 20 min | < 10 min | < 10 min |
| Review rules | Defaults | Defaults | Custom rules for our conventions | Custom rules, reviewed each quarter |

## Unit

[Layer page](./layers/unit-testing.md)

Unit tests sit with the code they test, so coverage on **new code** is the measure.

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Line coverage on new code (SonarCloud gate) | ≥ **30%** | ≥ **45%** | ≥ **60%** | ≥ **80%** |
| Bug fixes | Fixed | Fixed | Fixed with a regression test where practical | Always fixed with a regression test |
| Full suite run time | < 5 min | < 4 min | < 3 min | < 2 min |

## Mocked acceptance (FE)

[Layer page](./layers/frontend-acceptance.md)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Smoke tests for **existing** features | In place for every feature the team owns | Same | Same | Same |
| When they run | **On a schedule** (at least weekly) | **On every PR** that touches mobile or backend, plus the schedule | Same | Same |
| **New** acceptance scenarios | Not yet identified | Not yet identified | **Identified for every story** and listed on the ticket | Identified for every story |
| Writing the new tests | Not yet planned | Not yet planned | **Separate automation tasks** in the backlog, done after the feature ships | **In the same sprint**, and a story isn't done until its scenarios pass in CI |
| Platforms | Android emulator | Android emulator and web (Chromium) | Plus web on WebKit | Plus iOS, web on Firefox, and mobile viewports |
| PR smoke run time | n/a (not on PRs yet) | < 25 min | < 20 min | < **15 min** |

## Mocked acceptance (BE)

[Layer page](./layers/backend-acceptance.md)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Smoke tests for **existing** endpoints | A happy-path test for every endpoint the team owns | Same | Same | Same |
| When they run | **On a schedule** (at least weekly) | **On every PR**, plus the schedule | Same | Same |
| **New** acceptance scenarios | Not yet identified | Not yet identified | **Identified for every story** and listed on the ticket | Identified for every story |
| Writing the new tests | Not yet planned | Not yet planned | **Separate automation tasks** in the backlog, done after the feature ships | **In the same sprint**, and a story isn't done until its scenarios pass in CI |
| Test depth per endpoint | Happy path | Plus invalid input (400s) and unknown resources (404s) | Plus upstream provider failures (500, 429, 403, timeouts) | Plus caching behaviour and the authenticated cron route |
| Third parties | Stubbed with Nock | Stubbed, and real network calls fail the test | Same, with cache isolated per test | Same, and tests pass in any order |
| Run time | < 5 min | < 4 min | < 3 min | < 2 min |

## Contract

[Layer page](./layers/contract-testing.md)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| Contracts for **existing** integrations | Provider schema tests (Zod) for the providers the team uses | Plus Pact consumer tests for the endpoints the team consumes | Same | Same |
| When they run | On a schedule | **On every PR** (advisory) | On every PR and push to `main` | Same |
| **New** contracts | Not yet identified | Not yet identified | **Identified for every change** to an endpoint or provider | Identified for every change |
| Writing the new tests | Not yet planned | Not yet planned | **Separate automation tasks**, done after the change ships | **In the same sprint** as the change |
| `can-i-deploy` | None | Advisory | **Blocks the backend deploy** | Blocks the backend deploy |
| Third-party drift check | None | Weekly, manual follow-up | Daily | Daily, a failure opens an issue automatically |
| Run time per PR | < 15 min | < 10 min | < 7 min | < **5 min** |

## Integrated E2E

[Layer page](./layers/integrated-e2e.md)

| Criterion | 🥉 Bronze | 🥈 Silver | 🥇 Gold | 💎 Platinum |
| :--- | :--- | :--- | :--- | :--- |
| E2E tests for **existing** journeys | A scripted test for each critical journey the team owns | Same | Same | Same |
| **New** E2E journeys | Not yet identified | Not yet identified | **Identified for every story** that adds or changes a journey, and kept to what lower layers can't prove | Identified for every story |
| Writing the new tests | Not yet planned | Not yet planned | **Separate automation tasks** in the backlog, done after the feature ships | **In the same sprint**, and the story isn't done until its journeys pass |
| Live API tests | Run manually before a release | Daily | Every 12 h | Every **6 h** |
| App E2E on the deployed backend | Run manually before a release | Weekly, and per release | Nightly | Nightly and on release tags |
| Real devices | None | None | Smoke flow on one device before a store release | Critical journeys on real devices before every store release |
| [Candidate API check](./layers/integrated-e2e.md#candidate-api-check-before-a-backend-change-deploys) | None | None | Advisory on backend PRs | **Required** on backend PRs |
| Run time | Live API < 20 min, E2E < 60 min | Live API < 15 min, E2E < 45 min | Live API < 10 min, E2E < 40 min | Live API < **10 min**, E2E < **30 min** |
| Failure triage | Within 5 business days | Within 3 business days | Within 2 business days | Within **1** business day |

---

## SonarCloud gates

Each level has its own quality gate in SonarCloud, so the gate a project uses states its level. The thresholds apply to **new code**, and each cell is the point where the gate fails. Bronze, for example, fails a PR whose new code has less than 30% coverage.

| Gate | Coverage is less than | Duplicated lines is greater than | Maintainability worse than | Reliability worse than | Security hotspots reviewed is less than | Security rating worse than |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **QMM-Bronze** | 30.0% | 8.0% | C | C | 100% | A |
| **QMM-Silver** | 45.0% | 5.0% | B | B | 100% | A |
| **QMM-Gold** | 60.0% | 4.0% | A | A | 100% | A |
| **QMM-Platinum** | 80.0% | 3.0% | A | A | 100% | A |

Assign the gate in the SonarCloud project settings, and raise it when the team reaches the next level.

## Related

- [Test Strategy](./strategy.md): the layers, owners, cadence and quality gates the model builds on
- [Testing Overview](./overview.md): the philosophy and the test pyramid
- [Dependency Security](./layers/dependency-security.md): required at every level, so outside the model
