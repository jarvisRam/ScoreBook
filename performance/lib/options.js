// Options shared by every script.

// `url` is left out on purpose: with query strings and hashed asset names it would create a new
// Prometheus series per URL. Requests are identified by the `endpoint`/`name` tags instead.
export const SYSTEM_TAGS = ['proto', 'status', 'method', 'name', 'group', 'check', 'error', 'error_code', 'scenario', 'expected_response'];

// p(99) is not in k6's default summary stats, and the baseline gate reads p(95) from the export
export const TREND_STATS = ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'];

export const baseOptions = {
    systemTags: SYSTEM_TAGS,
    summaryTrendStats: TREND_STATS,
};

// A threshold that always passes. k6 only reports a tagged sub-metric (such as
// http_req_duration{endpoint:health}) in the summary export if a threshold names it, and the
// baseline comparison needs those numbers. Used where no absolute budget applies (stress runs).
const RECORD_ONLY = ['p(95)>=0'];

/** Latency and error-rate thresholds for each tagged endpoint. `slo` null = record only. */
export function endpointThresholds(endpoints, slo) {
    const thresholds = {};
    for (const endpoint of endpoints) {
        // Without a count floor, a script error that fires no requests passes every other threshold
        thresholds[`http_reqs{endpoint:${endpoint}}`] = ['count>0'];
        thresholds[`http_req_duration{endpoint:${endpoint}}`] = slo
            ? [`p(95)<${slo.p95}`, `p(99)<${slo.p99}`]
            : RECORD_ONLY;
        thresholds[`http_req_failed{endpoint:${endpoint}}`] = slo ? [`rate<${slo.errorRate}`] : ['rate>=0'];
    }
    return thresholds;
}
