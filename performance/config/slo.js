// Absolute budgets: a run that breaches one fails immediately, whatever the baseline says.
// The baseline comparison (scripts/baseline.js) is the second, relative gate and catches slow
// drift that stays inside these budgets. Times are in milliseconds.
//
// Mocked stacks run on a shared 2-core CI runner next to the load generator, so their budgets
// are loose on purpose: they exist to catch order-of-magnitude regressions, not to say how fast
// production is.
export const SLO = {
    // Isolated backend endpoints, DATA_MODE=mock (fixtures read from disk)
    beMock: { p95: 200, p99: 500, errorRate: 0.01 },
    // Mocked frontend: static build served locally, API answered from fixtures
    feMock: { pageLoadP95: 2500, htmlP95: 500, apiP95: 500, errorRate: 0.01 },
    // Browser web vitals. Thresholds follow Google's "good" boundaries (LCP 2.5 s, FCP 1.8 s).
    vitalsMock: { lcp: 2500, fcp: 1800, ttfb: 800, appReady: 4000 },
    // Hosted FE + BE. Vercel cold starts and a real network path justify far more headroom.
    hosted: { p95: 2000, p99: 5000, htmlP95: 1500, errorRate: 0.02 },
    vitalsHosted: { lcp: 4000, fcp: 3000, ttfb: 1500, appReady: 8000 },
};
