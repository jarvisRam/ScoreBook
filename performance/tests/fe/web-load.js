// Frontend load on the mocked stack (see mocks/mock-stack.js).
//
// Each iteration is one cold page load, the way the app does it:
//   1. the HTML shell
//   2. the assets it references (the JS bundle is the heavy one), fetched in parallel
//   3. the burst of list requests the app fires on mount: every sport screen and every status
//      list is mounted at load (see tests/support/app.ts), so 6 sports x 3 statuses = 18 calls
//
// This is HTTP-level load, so it measures delivery under concurrency. Rendering cost is measured
// by web-vitals.js, one real browser at a time.
//
//   npm run perf:fe
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { API_ORIGIN, PROFILE, SPORTS, STATUSES, WEB_URL } from '../../config/env.js';
import { FE_STAGES, stagesFor } from '../../config/profiles.js';
import { SLO } from '../../config/slo.js';
import { baseOptions } from '../../lib/options.js';
import { BROWSER_HEADERS } from '../../lib/api.js';

const pageLoad = new Trend('fe_page_load_ms', true);
const bundleLoad = new Trend('fe_bundle_load_ms', true);

const slo = SLO.feMock;
const record = PROFILE === 'stress';
const budget = (rule) => (record ? ['p(95)>=0'] : [rule]);
const failBudget = record ? ['rate>=0'] : [`rate<${slo.errorRate}`];

export const options = {
    ...baseOptions,
    scenarios: {
        page_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: stagesFor(FE_STAGES, PROFILE),
            gracefulRampDown: '10s',
        },
    },
    thresholds: {
        checks: ['rate>0.99'],
        // Without a count floor, a script error that fires no requests passes every other threshold
        'http_reqs{endpoint:api_matches}': ['count>0'],
        fe_page_load_ms: budget(`p(95)<${slo.pageLoadP95}`),
        fe_bundle_load_ms: ['p(95)>=0'],
        'http_req_duration{endpoint:html}': budget(`p(95)<${slo.htmlP95}`),
        'http_req_duration{endpoint:asset}': ['p(95)>=0'],
        'http_req_duration{endpoint:api_matches}': budget(`p(95)<${slo.apiP95}`),
        'http_req_failed{endpoint:html}': failBudget,
        'http_req_failed{endpoint:asset}': failBudget,
        'http_req_failed{endpoint:api_matches}': failBudget,
    },
};

const ASSET_PATTERN = /(?:src|href)="(\/[^"]+\.(?:js|css|ico|png|ttf|woff2?))"/g;

function assetPaths(html) {
    const found = new Set();
    for (const match of html.matchAll(ASSET_PATTERN)) found.add(match[1]);
    return [...found];
}

export default function () {
    const started = Date.now();

    const html = http.get(`${WEB_URL}/`, { headers: BROWSER_HEADERS, tags: { endpoint: 'html', name: 'html' } });
    const ok = check(html, {
        'html: status 200': (r) => r.status === 200,
        'html: has the app root': (r) => String(r.body).includes('id="root"'),
    });
    if (!ok) {
        sleep(1); // a failed load still paces, or the VU would hammer a broken target
        return;
    }

    const paths = assetPaths(String(html.body));
    check(paths, { 'html: references at least one script': (p) => p.some((x) => x.endsWith('.js')) });

    const assetStarted = Date.now();
    const assets = http.batch(
        paths.map((path) => ['GET', `${WEB_URL}${path}`, null, { headers: BROWSER_HEADERS, tags: { endpoint: 'asset', name: 'asset' } }]),
    );
    bundleLoad.add(Date.now() - assetStarted);
    check(assets, { 'assets: all 200': (rs) => rs.every((r) => r.status === 200) });

    const lists = [];
    for (const sport of SPORTS) {
        for (const status of STATUSES) {
            lists.push([
                'GET',
                `${API_ORIGIN}/api/matches/${sport}?status=${status}`,
                null,
                { headers: { ...BROWSER_HEADERS, Origin: WEB_URL }, tags: { endpoint: 'api_matches', name: 'api_matches' } },
            ]);
        }
    }
    const responses = http.batch(lists);
    check(responses, { 'api: all 18 lists 200': (rs) => rs.length === 18 && rs.every((r) => r.status === 200) });

    pageLoad.add(Date.now() - started);
    sleep(1); // think time between page loads
}
