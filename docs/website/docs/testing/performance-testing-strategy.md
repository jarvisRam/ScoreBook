---
sidebar_position: 4
title: Performance Test Strategy
description: How ScoreBook tests performance. k6 suites for the backend, the frontend and the hosted environment, baseline monitoring on a schedule, and a Grafana dashboard.
---

# Performance Test Strategy

The [test pyramid](./overview.md#the-test-pyramid) answers "does it work?". This page answers the other question: **"is it still fast enough, and is it getting slower?"** Performance testing doesn't sit on one layer of the pyramid. It reuses the same environments (a mocked backend, a mocked frontend, the hosted stack) and asks a different question of each.

## Goals

- **Catch regressions early.** A change that makes an endpoint ten times slower should be visible within a day, not when a user complains.
- **See drift, not just breakage.** A p95 that creeps from 12 ms to 90 ms never fails a fixed budget but is still a regression. Baselines catch it.
- **Keep the cost and risk near zero.** The hosted environment is shared and may sit in front of a provider with a quota, so only the mocked stacks ever see real load.

## Three suites, three environments

Each suite targets the narrowest environment that can answer its question.

| Suite | Question it answers | Environment | Load | Cadence |
| :--- | :--- | :--- | :--- | :--- |
| **Backend endpoints** (`be-mock`) | How fast is each endpoint on its own, and where does it break? | Backend started from the branch with `DATA_MODE=mock`, no providers, no database | Up to 40 req/s per endpoint (stress: 1,000) | Daily |
| **Frontend load** (`fe-mock`) | How does the web app's delivery path hold up under concurrent visitors, and how fast does it render? | Web build served locally with every `/api` call answered from fixtures | 20 concurrent visitors (stress: 400), plus a real Chromium for web vitals | Daily |
| **Hosted smoke** (`hosted-smoke`) | Are the deployed frontend and backend wired together and within a sane latency budget *right now*? | The hosted environment (Vercel) | One user, 5 paced iterations. Not a load test | After merges to `main`, and every 4 hours |

### Why isolated

The backend suite starts one endpoint at a time (each is its own k6 scenario, staggered), so an endpoint's latency isn't polluted by its neighbours. It runs in mock mode, so what's measured is our routing, serialisation and fixture reads. Third-party providers, the database and RapidAPI quota are all out of the picture. The frontend suite serves the real production web build next to a fixture-backed API for the same reason: the numbers describe the frontend, not the backend.

### Why the hosted suite is only a smoke

Load against the hosted environment would measure the shared serverless platform and could spend provider quota. The hosted suite instead does what a visitor's browser does, a handful of times:

1. Loads the HTML shell and the JS bundle, and checks the bundle is **compressed**.
2. Calls the backend **with the frontend's origin**, so CORS is exercised.
3. Calls `health`, `sports`, `matches/live` and the six per-sport live lists.

It never requests uncacheable endpoints when the backend reports `real` mode. See [guardrails](#guardrails).

## What each suite measures

| Suite | Script | Measures |
| :--- | :--- | :--- |
| `be-mock` | `tests/be/endpoints.js` | Latency (p95, p99) and error rate per endpoint: `health`, `sports`, `matches_live`, `matches_by_sport` (all 18 sport × status lists), `match_detail`, and the two 404 paths |
| `fe-mock` | `tests/fe/web-load.js` | A cold page load per iteration: HTML, then assets, then the burst of 18 list requests the app fires on mount. Reports page-load time and per-step latency under concurrency |
| `fe-mock` | `tests/fe/web-vitals.js` | Real-browser LCP, FCP, TTFB and CLS, plus **app-ready time**: navigation until the first tab shows match cards or its empty state |
| `hosted-smoke` | `tests/smoke/hosted.js` | The journey above, with per-step latency and checks on status, response shape, CORS and compression |
| `hosted-smoke` | `tests/fe/web-vitals.js` | The same browser journey against the hosted site, so the mocked and hosted numbers are directly comparable |

:::note The two frontend scripts answer different questions
`web-load.js` is HTTP-level: it can say how fast bytes arrive under concurrency, not how long the app takes to render. `web-vitals.js` is a real browser, one visitor at a time: it can say how long rendering takes, not how the server behaves under load. Together they cover both.
:::

## Two gates: budgets and baselines

Every run is judged twice.

| Gate | Defined in | Fails when | Catches |
| :--- | :--- | :--- | :--- |
| **Budget** (absolute) | k6 thresholds, `performance/config/slo.js` | A metric crosses a fixed ceiling, for example backend p95 > 200 ms | Order-of-magnitude regressions and outages |
| **Baseline** (relative) | `performance/baselines/*.json`, `performance/scripts/baseline.js` | A metric is both relatively *and* absolutely worse than its recorded p95 | Slow drift that stays under every budget |

A baseline regression requires both conditions so noise doesn't raise alerts: for the backend, a metric must be more than 100% *and* more than 10 ms worse than baseline. 3 ms → 5 ms on a shared runner is ignored, 40 ms → 120 ms isn't. The tolerances live in each baseline file and can be tuned by hand. A recorded tolerance survives re-recording.

Budgets are deliberately loose on the mocked stacks, which share a 2-core CI runner with the load generator. Their job is to catch big regressions. The baseline does the fine-grained work.

### Browser vitals thresholds

Web vitals follow Google's "good" boundaries (LCP ≤ 2.5 s, FCP ≤ 1.8 s) for the mocked stack and a looser budget for hosted, where a real network and cold starts are part of the picture.

### Recording and refreshing a baseline

Baselines are committed so a change to one is reviewed like any other change.

1. Dispatch the workflow with **record baseline** ticked. It runs normally and uploads the new `baselines/*.json` as an artifact. It doesn't commit.
2. Download the artifact, review the diff, and commit it with the change that caused it.

Baselines must be recorded on **GitHub Actions**, not a laptop. The files record where they were recorded (`recordedOn`). A baseline is only compared against a run with the **same profile**, otherwise the comparison is skipped with a note. A suite with no baseline passes and says so, which is the state of `hosted-smoke` until its first CI recording.

## Schedule

| Workflow | Trigger | Runs |
| :--- | :--- | :--- |
| `performance-scheduled.yml` | Daily 03:15 UTC, plus manual dispatch | `be-mock` and `fe-mock`, in parallel jobs, `standard` profile |
| `performance-smoke-hosted.yml` | After a merge to `main` that touches `backend/`, `mobile/` or `performance/` (it waits 3 minutes for the Vercel deploy first), every 4 hours, plus manual dispatch | `hosted-smoke` |

Neither runs on pull requests, and the post-merge smoke is the only one that follows a deploy. Timings on a shared runner are too noisy to gate a merge, and the functional behaviour is already gated by the [mocked acceptance](./layers/backend-acceptance.md) suites. A regression fails the scheduled run, which notifies repository watchers. Triage works as described for [integrated E2E](./layers/integrated-e2e.md#handling-failures): fix with a regression test at the lowest layer that can reproduce it, or re-record the baseline if the change was intended.

Manual dispatch can also pick a profile:

| Profile | Use |
| :--- | :--- |
| `standard` | The scheduled shape. Baselines are recorded against it |
| `quick` | A seconds-long sanity run, for checking the workflow or a script change |
| `stress` | Steps load far past normal to find where latency and errors break. Mocked suites only. No budgets or baselines apply. Read the dashboard |

## The Grafana dashboard

k6 streams its metrics to Prometheus with remote write, and Grafana charts them. The dashboard (`performance/grafana/dashboards/scorebook-performance.json`) has filters for suite and endpoint and these views:

- **Headline**: worst p95, error rate, checks passing, request rate.
- **Per-endpoint** p95, p99, request rate and error rate. Set the range to 30 days to read baseline drift across the scheduled runs.
- **Load shape**: virtual users, and average latency against load for stress runs.
- **Frontend**: page-load and app-ready time, LCP, FCP, TTFB.
- **Hosted smoke**: journey time and bundle download time.

| Where | Backend for the dashboard | Set up |
| :--- | :--- | :--- |
| **Locally** | Prometheus + Grafana from `performance/grafana/docker-compose.yml` | `npm run perf:grafana:up`, open `http://localhost:3030`, run any suite with `K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write` |
| **CI** | Grafana Cloud | Add the repository secrets `K6_PROMETHEUS_RW_SERVER_URL`, `K6_PROMETHEUS_RW_USERNAME` and `K6_PROMETHEUS_RW_PASSWORD` from the Grafana Cloud Prometheus details, then import the dashboard JSON |

Without the secrets, CI still runs, compares and uploads results. It just doesn't chart them. Each result is tagged with `suite`, `script`, `env`, `profile`, `source` (local or CI) and `testid`, so a single run can be isolated.

:::note What has and hasn't been verified
The metric and label names in the dashboard queries were checked against the payload k6 actually pushes (`k6_http_req_duration_p95`, `k6_http_reqs_total`, `k6_fe_page_load_ms_p95`, `k6_browser_web_vital_lcp_p95`, and the `suite`, `endpoint` and `script` labels). The dashboard JSON itself hasn't yet been loaded into a running Grafana. If a panel looks wrong after the first real push, check it in Grafana's Explore view.
:::

## Tool choice

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

| Criteria | **k6** | Artillery | JMeter | Gatling | Locust |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Scripts are plain JavaScript, close to our TypeScript stack | ✅ | ✅ | ❌ GUI / XML | ⚠️ Scala / Java / JS | ❌ Python |
| Built-in thresholds that fail a CI run | ✅ | ⚠️ plugin | ⚠️ assertions | ✅ | ❌ custom |
| Real-browser metrics (web vitals) in the same tool | ✅ `k6/browser` | ⚠️ via Playwright | ❌ | ❌ | ❌ |
| Native output to Prometheus / Grafana | ✅ | ⚠️ | ⚠️ plugin | ⚠️ | ⚠️ |
| One static binary, easy in GitHub Actions | ✅ | ❌ needs Node | ❌ needs a JVM | ❌ needs a JVM | ❌ needs Python |
| Arrival-rate load models (fixed requests per second, not fixed users) | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |

### Why k6

- **One tool for both halves.** The same script language and runner drive API load and a real browser, so the frontend suite doesn't need a second toolchain.
- **Arrival-rate scenarios.** The backend suite fixes requests per second, not users, so a slowdown shows up as latency instead of being hidden by users backing off.
- **Thresholds are a first-class citizen.** A crossed budget exits non-zero, which is all CI needs.
- **Grafana lineage.** Remote-write output and dashboards are a documented path, not a plugin.

Existing tools stay where they are: the [live API tests](./layers/integrated-e2e.md#decision-matrix-live-api-tests) remain Jest + Supertest. k6 is for *how fast*, not *is it correct*.

## Guardrails

Performance tests are the easiest tests to turn into an outage or a bill. The suite has guardrails:

- **The backend suite refuses to run against a backend that isn't in mock mode.** `setup()` reads `/api/health` and aborts unless `mode` is `mock`. Setting `ALLOW_NON_MOCK=1` overrides this deliberately.
- **Hosted traffic is fixed by iteration count, not duration**, and `hosted-smoke` accepts no other profile. Roughly 60 requests per run, mostly cached.
- **Uncacheable endpoints are skipped in `real` mode.** `/api/match/:id` is only exercised on the hosted backend when `mode` is `mock` or `simulation`.
- **The runner refuses to start a server on a port that already answers**, so it never load tests whatever happened to be listening there.
- **Empty data can't pass.** k6 treats a threshold on no samples as met, and a script error silently aborts an iteration. Every script has a count floor (requests or completed journeys) so an exception fails the run instead of going green.

## Known limits

- **Relative, not absolute.** The mocked stacks, the load generator and the backend share one runner. The numbers are comparable *run to run*, not capacity figures. They say nothing about production throughput.
- **Request logging is on.** The backend logs every request to stdout in all modes. At stress rates that logging is part of the measurement. It's the same code that ships, so it is left in, but be aware when reading stress results.
- **HTTP-level frontend load doesn't render.** Rendering cost is only measured one browser at a time.
- **The 18-request burst is an assumption.** `web-load.js` models the page load as 6 sports × 3 statuses, because every sport screen and status list is mounted at load. If the app changes how it loads data, update the script and re-record.
- **No mobile-device performance.** App launch time, memory and frame rate on real devices belong with the [real-device release suite](./layers/integrated-e2e.md#real-devices-release-suite).

## Running it

Prerequisites: [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) on your path. The browser scripts also need Chrome or Chromium, and `K6_BROWSER_EXECUTABLE_PATH` if k6 can't find it.

```bash
npm run perf:be                      # backend endpoints, mocked backend (starts it for you)
npm run perf:fe -- --build           # frontend, mocked stack (--build bakes the mock API URL into the web bundle)
npm run perf:smoke                   # hosted smoke, uses WEB_BASE_URL / API_BASE_URL or the hosted defaults

# Options (after --)
#   --profile=quick|standard|stress   --no-browser   --no-compare   --record-baseline
npm run perf:be -- --profile=quick
```

| Command | What it does |
| :--- | :--- |
| `npm run perf:be` | Starts the backend in mock mode, runs `tests/be/endpoints.js`, compares with the baseline |
| `npm run perf:fe` | Starts the web build and fixture API, runs `web-load.js` and `web-vitals.js` |
| `npm run perf:smoke` | Runs `hosted.js` and `web-vitals.js` against the hosted environment |
| `npm run perf:grafana:up` / `perf:grafana:down` | Starts and stops the local Prometheus + Grafana |

Results land in `performance/results/` (not committed). The k6 summary prints as normal, followed by a baseline table.

## Adding or changing a test

- **A new endpoint**: add it to `ENDPOINTS` and export a function of the same name in `tests/be/endpoints.js`. Re-record the baseline.
- **A new budget**: edit `performance/config/slo.js`.
- **A new tracked metric**: add its name to the `TRACKED` pattern in `performance/scripts/baseline.js`.
- **A different load shape**: edit `performance/config/profiles.js`. Re-record every baseline for that profile.

## Related

- [Test Strategy](./strategy.md): how performance sits beside the other suites and their cadence
- [Integrated E2E](./layers/integrated-e2e.md): the functional tests that run against the same hosted environment
- [Test Data](./test-data.md): the backend data modes the suites depend on
- [Running Tests](./running-tests.md): all test commands in one place
