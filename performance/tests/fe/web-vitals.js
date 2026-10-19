// Rendering performance in a real browser: Core Web Vitals plus "time until the app shows data".
//
// One Chromium at a time, a handful of cold loads. This is the other half of web-load.js, which
// can say how fast the bytes arrive under concurrency but not how long the app takes to render.
// The same script runs against the mocked stack (PERF_TARGET=mock, the default) and against the
// hosted site (PERF_TARGET=hosted), so the two numbers are directly comparable.
//
// Needs Chrome/Chromium: set K6_BROWSER_EXECUTABLE_PATH if k6 can't find it.
//
//   npm run perf:fe
import { browser } from 'k6/browser';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { PROFILE, WEB_URL } from '../../config/env.js';
import { BROWSER_ITERATIONS } from '../../config/profiles.js';
import { SLO } from '../../config/slo.js';
import { baseOptions } from '../../lib/options.js';

const hosted = __ENV.PERF_TARGET === 'hosted';
const slo = hosted ? SLO.vitalsHosted : SLO.vitalsMock;
const appReady = new Trend('fe_app_ready_ms', true);
const journeysCompleted = new Counter('fe_journeys_completed');

export const options = {
    ...baseOptions,
    scenarios: {
        journey: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: BROWSER_ITERATIONS[PROFILE] || BROWSER_ITERATIONS.standard,
            options: { browser: { type: 'chromium' } },
        },
    },
    thresholds: {
        checks: ['rate==1'],
        browser_web_vital_lcp: [`p(95)<${slo.lcp}`],
        browser_web_vital_fcp: [`p(95)<${slo.fcp}`],
        browser_web_vital_ttfb: [`p(95)<${slo.ttfb}`],
        // A timeout aborts an iteration silently and every other threshold would pass on no data
        fe_journeys_completed: ['count>0'],
        fe_app_ready_ms: [`p(95)<${slo.appReady}`],
        // Tracked in the baseline, not budgeted: cumulative layout shift has no time unit
        browser_web_vital_cls: ['p(95)>=0'],
    },
};

export default async function () {
    const page = await browser.newPage();
    try {
        const started = Date.now();
        await page.goto(WEB_URL, { waitUntil: 'load' });

        // The shell is up when the logo renders...
        await page.locator('[data-testid="app_logo"]').waitFor({ timeout: 30000 });
        // ...and the app is useful when the first tab (cricket / live) has either cards or its
        // empty state, i.e. the API call made on load has come back and been rendered.
        await page
            .locator('[data-testid="matchCard_cricket_live_0"], [data-testid="matchList_cricket_live_empty"]')
            .first()
            .waitFor({ timeout: 30000 });
        appReady.add(Date.now() - started);

        const errorStates = await page.locator('[data-testid="matchList_cricket_live_error"]').count();
        check(errorStates, { 'no error state on the first tab': (count) => count === 0 });
        journeysCompleted.add(1);
    } finally {
        await page.close();
    }
}
