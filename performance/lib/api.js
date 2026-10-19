import http from 'k6/http';
import { check } from 'k6';
import { API_ORIGIN } from '../config/env.js';

// k6 does not ask for compression unless told to, a browser always does. Without this the
// numbers describe a client that does not exist (1 MB bundle instead of ~300 kB).
export const BROWSER_HEADERS = { 'Accept-Encoding': 'gzip, deflate, br' };

/**
 * GET an API path. `endpoint` is the stable label every metric is tagged with; it also becomes
 * the `name` tag so ids and query strings never fan out into thousands of time series.
 * Pass `expect: 404` for requests that are supposed to fail, so they don't count as errors.
 */
export function api(path, endpoint, { expect = 200, headers = {} } = {}) {
    return http.get(`${API_ORIGIN}${path}`, {
        headers: { ...BROWSER_HEADERS, Accept: 'application/json', ...headers },
        tags: { endpoint, name: endpoint },
        responseCallback: http.expectedStatuses(expect),
    });
}

export function body(res) {
    try {
        return res.json();
    } catch (_) {
        return null;
    }
}

/** Every list endpoint answers { data: [...], timestamp, mode } */
export function checkEnvelope(res, label) {
    return check(res, {
        [`${label}: status 200`]: (r) => r.status === 200,
        [`${label}: data is an array`]: (r) => Array.isArray((body(r) || {}).data),
    });
}

export function checkError(res, label, status, code) {
    return check(res, {
        [`${label}: status ${status}`]: (r) => r.status === status,
        [`${label}: error code ${code}`]: (r) => ((body(r) || {}).error || {}).code === code,
    });
}
