// Isolated backend endpoints on a mocked backend (DATA_MODE=mock).
//
// Each endpoint is its own scenario and the scenarios are staggered, so only one endpoint is
// under load at a time and its latency is not muddied by its neighbours. Mock mode removes the
// third-party providers and RapidAPI quota from the picture: what is left is our routing,
// serialisation and fixture reads.
//
//   npm run perf:be
import exec from 'k6/execution';
import { check, fail } from 'k6';
import { PROFILE, SPORTS, STATUSES } from '../../config/env.js';
import { BE_STAGES, stagesFor, totalSeconds } from '../../config/profiles.js';
import { SLO } from '../../config/slo.js';
import { baseOptions, endpointThresholds } from '../../lib/options.js';
import { api, body, checkEnvelope, checkError } from '../../lib/api.js';

const ENDPOINTS = ['health', 'sports', 'matches_live', 'matches_by_sport', 'match_detail', 'sport_not_found', 'match_not_found'];

const stages = stagesFor(BE_STAGES, PROFILE);
const slot = totalSeconds(stages) + 5; // 5 s of quiet between endpoints
const peak = Math.max(...stages.map((stage) => stage.target));

const scenarios = {};
ENDPOINTS.forEach((endpoint, index) => {
    scenarios[endpoint] = {
        executor: 'ramping-arrival-rate',
        exec: endpoint,
        startTime: `${index * slot}s`,
        timeUnit: '1s',
        startRate: 0,
        stages,
        preAllocatedVUs: Math.min(50, Math.ceil(peak / 10) + 5),
        maxVUs: Math.max(100, peak),
    };
});

export const options = {
    ...baseOptions,
    scenarios,
    thresholds: {
        checks: ['rate>0.99'],
        ...endpointThresholds(ENDPOINTS, PROFILE === 'stress' ? null : SLO.beMock),
    },
};

export function setup() {
    const health = body(api('/api/health', 'setup'));
    if (!health || health.status !== 'ok') {
        fail('Backend is not healthy, so there is nothing to load test');
    }
    // These scenarios fire hundreds of requests a second. Against a backend in real mode that
    // burns RapidAPI quota, so refuse unless the target is serving fixtures.
    if (health.mode !== 'mock' && __ENV.ALLOW_NON_MOCK !== '1') {
        fail(`Backend mode is "${health.mode}", expected "mock". Start it with DATA_MODE=mock (or set ALLOW_NON_MOCK=1 to override).`);
    }
    const live = body(api('/api/matches/live', 'setup')) || {};
    return { matchIds: (live.data || []).map((match) => match.id) };
}

export function health() {
    const res = api('/api/health', 'health');
    check(res, {
        'health: status 200': (r) => r.status === 200,
        'health: status is ok': (r) => (body(r) || {}).status === 'ok',
    });
}

export function sports() {
    checkEnvelope(api('/api/sports', 'sports'), 'sports');
}

export function matches_live() {
    checkEnvelope(api('/api/matches/live', 'matches_live'), 'matches_live');
}

// Walks every sport x status pair, the same 18 lists the app requests when it loads
export function matches_by_sport() {
    const n = exec.scenario.iterationInTest;
    const sport = SPORTS[n % SPORTS.length];
    const status = STATUSES[Math.floor(n / SPORTS.length) % STATUSES.length];
    checkEnvelope(api(`/api/matches/${sport}?status=${status}`, 'matches_by_sport'), 'matches_by_sport');
}

export function match_detail(data) {
    if (data.matchIds.length === 0) {
        fail('No live match ids found in setup(), cannot exercise /api/match/:id');
    }
    const id = data.matchIds[exec.scenario.iterationInTest % data.matchIds.length];
    const res = api(`/api/match/${id}`, 'match_detail');
    check(res, {
        'match_detail: status 200': (r) => r.status === 200,
        'match_detail: id matches': (r) => ((body(r) || {}).data || {}).id === id,
    });
}

// Negative paths are part of the contract and have to stay cheap under load too
export function sport_not_found() {
    checkError(api('/api/matches/curling', 'sport_not_found', { expect: 404 }), 'sport_not_found', 404, 'SPORT_NOT_FOUND');
}

export function match_not_found() {
    checkError(api('/api/match/does-not-exist', 'match_not_found', { expect: 404 }), 'match_not_found', 404, 'MATCH_NOT_FOUND');
}
