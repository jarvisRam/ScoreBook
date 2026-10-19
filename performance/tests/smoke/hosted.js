// Performance smoke for the hosted environment: the deployed frontend and backend together.
//
// A few paced iterations, not a load test. It answers "is the integrated system up, correctly
// wired, and within a sane latency budget right now?" and gives the scheduled baseline a steady
// signal to trend. Each iteration does what a visitor's browser does:
//   1. loads the HTML shell and its JS bundle from the frontend host
//   2. calls the backend from that page's origin (so CORS is exercised, as it is in the browser)
//
// Guardrails, because the hosted backend may be in real mode with RapidAPI quota behind it:
//   - the volume is fixed by iteration count, not by duration
//   - only the six `live` lists are requested, which the backend caches
//   - /api/match/:id (uncached in real mode) is only exercised when the backend reports mock or
//     simulation mode
//
//   WEB_BASE_URL=https://... API_BASE_URL=https://... npm run perf:smoke
import http from 'k6/http';
import { check, fail, group, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { API_ORIGIN, SPORTS, WEB_URL } from '../../config/env.js';
import { HOSTED_SMOKE_ITERATIONS } from '../../config/profiles.js';
import { SLO } from '../../config/slo.js';
import { baseOptions, endpointThresholds } from '../../lib/options.js';
import { api, body, BROWSER_HEADERS, checkEnvelope } from '../../lib/api.js';

const slo = SLO.hosted;
const journey = new Trend('smoke_journey_ms', true);
const journeysCompleted = new Counter('smoke_journeys_completed');
const API_ENDPOINTS = ['health', 'sports', 'matches_live', 'matches_by_sport', 'match_detail'];

export const options = {
    ...baseOptions,
    scenarios: {
        smoke: { executor: 'per-vu-iterations', vus: 1, iterations: HOSTED_SMOKE_ITERATIONS, maxDuration: '3m' },
    },
    thresholds: {
        checks: ['rate>0.98'],
        // A script error aborts an iteration silently and every other threshold would pass on no data
        smoke_journeys_completed: [`count>=${HOSTED_SMOKE_ITERATIONS}`],
        smoke_journey_ms: [`p(95)<${slo.p95 * 3}`],
        'http_req_duration{endpoint:html}': [`p(95)<${slo.htmlP95}`],
        'http_req_duration{endpoint:bundle}': [`p(95)<${slo.p95 * 2}`],
        'http_req_failed{endpoint:html}': [`rate<${slo.errorRate}`],
        'http_req_failed{endpoint:bundle}': [`rate<${slo.errorRate}`],
        ...endpointThresholds(API_ENDPOINTS, slo),
    },
};

export function setup() {
    const res = api('/api/health', 'health');
    const health = body(res);
    if (res.status !== 200 || !health || health.status !== 'ok') {
        fail(`Hosted backend is not healthy at ${API_ORIGIN}/api/health (HTTP ${res.status})`);
    }
    console.log(`Frontend ${WEB_URL}  Backend ${API_ORIGIN}  backend mode: ${health.mode}`);
    return { mode: health.mode };
}

export default function (data) {
    const started = Date.now();
    const asApp = { Origin: WEB_URL.match(/^https?:\/\/[^/]+/)[0] };

    group('frontend', () => {
        const html = http.get(`${WEB_URL}/`, { headers: BROWSER_HEADERS, tags: { endpoint: 'html', name: 'html' } });
        check(html, {
            'frontend: HTML 200': (r) => r.status === 200,
            'frontend: app root present': (r) => String(r.body).includes('id="root"'),
        });

        const script = String(html.body).match(/src="(\/[^"]+\.js)"/);
        if (!check(script, { 'frontend: HTML references a script bundle': (m) => m !== null })) return;

        const bundle = http.get(`${WEB_URL}${script[1]}`, { headers: BROWSER_HEADERS, tags: { endpoint: 'bundle', name: 'bundle' } });
        check(bundle, {
            'frontend: bundle 200': (r) => r.status === 200,
            'frontend: bundle is javascript': (r) => (r.headers['Content-Type'] || '').includes('javascript'),
            // A 1 MB bundle sent uncompressed is a real regression that no status check would catch
            'frontend: bundle is compressed': (r) => /gzip|br|zstd/.test(r.headers['Content-Encoding'] || ''),
        });
    });

    group('backend', () => {
        const health = api('/api/health', 'health', { headers: asApp });
        check(health, {
            'backend: health 200': (r) => r.status === 200,
            'backend: CORS allows the frontend origin': (r) => {
                const allowed = r.headers['Access-Control-Allow-Origin'];
                return allowed === '*' || allowed === asApp.Origin;
            },
        });
        checkEnvelope(api('/api/sports', 'sports', { headers: asApp }), 'sports');
        const live = api('/api/matches/live', 'matches_live', { headers: asApp });
        checkEnvelope(live, 'matches_live');

        for (const sport of SPORTS) {
            checkEnvelope(api(`/api/matches/${sport}?status=live`, 'matches_by_sport', { headers: asApp }), `${sport} live`);
        }

        const first = ((body(live) || {}).data || [])[0];
        if (first && data.mode !== 'real') {
            const detail = api(`/api/match/${first.id}`, 'match_detail', { headers: asApp });
            check(detail, { 'match_detail: status 200': (r) => r.status === 200 });
        }
    });

    journey.add(Date.now() - started);
    journeysCompleted.add(1);
    sleep(2); // paced: this is a smoke, not a load test
}
