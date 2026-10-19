# Performance tests

k6 suites for ScoreBook, with baseline monitoring and a Grafana dashboard. The strategy, the
reasoning and the full how-to live in the docs:
[docs/website/docs/testing/performance-testing-strategy.md](../docs/website/docs/testing/performance-testing-strategy.md).

```bash
npm run perf:be                  # isolated backend endpoints, mocked backend
npm run perf:fe -- --build       # frontend load + web vitals, mocked stack
npm run perf:smoke               # hosted frontend + backend smoke
npm run perf:be -- --profile=quick
```

Needs [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) (and Chrome for the browser scripts).

| Path | What |
| :--- | :--- |
| `tests/be/` | Backend endpoint scenarios (mock mode only) |
| `tests/fe/` | Frontend HTTP load and real-browser web vitals |
| `tests/smoke/` | Hosted-environment smoke |
| `config/` | Targets (`env.js`), absolute budgets (`slo.js`), load shapes (`profiles.js`) |
| `lib/` | Shared request helpers and k6 options |
| `mocks/mock-stack.js` | Serves the web build and a fixture API for the frontend suite |
| `scripts/run.js` | Single entry point: starts what a suite needs, runs k6, compares with the baseline |
| `scripts/baseline.js` | Records and compares baselines |
| `baselines/` | Committed baselines. Record them on CI, not a laptop |
| `grafana/` | Local Prometheus + Grafana, and the dashboard JSON |
| `results/` | Run output (git-ignored) |
