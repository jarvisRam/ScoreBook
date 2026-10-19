// Baseline monitoring: record what "normal" looks like for each script, then flag runs that
// drift away from it.
//
// This is the second gate. The first is the absolute budgets in config/slo.js, which fail a run
// outright. A budget cannot see a p95 that creeps from 12 ms to 90 ms over a month, because
// both numbers are under it. Comparing with a recorded baseline can.
//
// A baseline stores p95 (and error rate) per tracked metric, plus how much movement to tolerate.
// A metric regresses only when it is BOTH relatively and absolutely worse than the baseline, so
// 3 ms -> 5 ms on a noisy shared runner is not an alert but 200 ms -> 400 ms is.
const fs = require('fs');
const path = require('path');

const BASELINE_DIR = path.resolve(__dirname, '../baselines');

// Per script id ("<suite>.<script>"). Mocked stacks share a 2-core runner with the load
// generator, hosted numbers cross the internet to serverless functions: both are noisy.
const DEFAULT_TOLERANCE = {
    'be-mock.endpoints': { relative: 1.0, absoluteMs: 10 },
    'fe-mock.web-load': { relative: 1.0, absoluteMs: 25 },
    'fe-mock.web-vitals': { relative: 0.75, absoluteMs: 150 },
    'hosted-smoke.hosted': { relative: 1.0, absoluteMs: 400 },
    'hosted-smoke.web-vitals': { relative: 0.75, absoluteMs: 500 },
};
const FALLBACK_TOLERANCE = { relative: 1.0, absoluteMs: 50 };
const FAIL_RATE_TOLERANCE = 0.01; // an absolute 1 percentage point

// Time metrics only. CLS has no unit, so a millisecond floor makes no sense for it.
const TRACKED = /^(http_req_duration\{endpoint:[^}]+\}|fe_[a-z_]+_ms|smoke_journey_ms|browser_web_vital_(lcp|fcp|ttfb))$/;

const round = (n) => Math.round(n * 100) / 100;
const baselinePath = (id) => path.join(BASELINE_DIR, `${id}.json`);

/** Pull the tracked numbers out of a `k6 --summary-export` file. */
function extract(summary) {
    const metrics = {};
    for (const [name, m] of Object.entries(summary.metrics)) {
        if (!TRACKED.test(name) || typeof m['p(95)'] !== 'number') continue;
        metrics[name] = { p95: round(m['p(95)']) };
        const failed = summary.metrics[name.replace('http_req_duration', 'http_req_failed')];
        if (name.startsWith('http_req_duration') && failed && typeof failed.value === 'number') {
            metrics[name].failRate = round(failed.value);
        }
    }
    return metrics;
}

function load(id) {
    try {
        return JSON.parse(fs.readFileSync(baselinePath(id), 'utf-8'));
    } catch {
        return null;
    }
}

function record(id, { suite, script, profile }, summary) {
    const previous = load(id);
    const baseline = {
        suite,
        script,
        profile,
        recordedAt: new Date().toISOString().slice(0, 10),
        recordedOn: process.env.GITHUB_ACTIONS ? 'github-actions' : 'local',
        // Keep tolerances that someone tuned by hand
        tolerance: previous?.tolerance ?? DEFAULT_TOLERANCE[id] ?? FALLBACK_TOLERANCE,
        metrics: extract(summary),
    };
    fs.mkdirSync(BASELINE_DIR, { recursive: true });
    fs.writeFileSync(baselinePath(id), JSON.stringify(baseline, null, 2) + '\n');
    return baseline;
}

/**
 * @returns {{ rows: object[], regressions: number, note?: string }}
 */
function compare(id, profile, summary) {
    const baseline = load(id);
    if (!baseline) {
        return { rows: [], regressions: 0, note: 'No baseline recorded yet. Run with --record-baseline to create one.' };
    }
    if (baseline.profile !== profile) {
        return { rows: [], regressions: 0, note: `Baseline was recorded with profile "${baseline.profile}", this run used "${profile}". Not compared.` };
    }

    const { relative, absoluteMs } = baseline.tolerance;
    const current = extract(summary);
    const rows = [];

    for (const [name, base] of Object.entries(baseline.metrics)) {
        const now = current[name];
        if (!now) {
            rows.push({ metric: name, base: base.p95, now: null, status: 'MISSING' });
            continue;
        }
        const delta = now.p95 - base.p95;
        const worse = delta > base.p95 * relative && delta > absoluteMs;
        const failRateUp = (now.failRate ?? 0) > (base.failRate ?? 0) + FAIL_RATE_TOLERANCE;
        let status = 'ok';
        if (worse || failRateUp) status = 'REGRESSION';
        else if (-delta > base.p95 * relative && -delta > absoluteMs) status = 'faster';
        rows.push({ metric: name, base: base.p95, now: now.p95, deltaPct: base.p95 ? (delta / base.p95) * 100 : 0, failRate: now.failRate, failRateUp, status });
    }
    for (const name of Object.keys(current)) {
        if (!baseline.metrics[name]) rows.push({ metric: name, base: null, now: current[name].p95, status: 'new' });
    }

    return { rows, regressions: rows.filter((r) => r.status === 'REGRESSION' || r.status === 'MISSING').length };
}

function toMarkdown(id, { rows, note }) {
    const lines = [`#### Baseline: \`${id}\``, ''];
    if (note) return [...lines, note, ''].join('\n');
    lines.push('| Metric | Baseline p95 | This run p95 | Change | Status |', '| :--- | ---: | ---: | ---: | :--- |');
    for (const r of rows) {
        const fmt = (v) => (v === null || v === undefined ? '-' : `${v}`);
        const change = r.deltaPct === undefined ? '-' : `${r.deltaPct >= 0 ? '+' : ''}${r.deltaPct.toFixed(0)}%`;
        const flag = r.status === 'REGRESSION' ? (r.failRateUp ? `❌ regression (error rate ${(r.failRate * 100).toFixed(1)}%)` : '❌ regression') : r.status === 'MISSING' ? '❌ missing' : r.status === 'faster' ? '🟢 faster' : r.status;
        lines.push(`| \`${r.metric}\` | ${fmt(r.base)} | ${fmt(r.now)} | ${change} | ${flag} |`);
    }
    return [...lines, ''].join('\n');
}

function toText(id, result) {
    if (result.note) return `Baseline ${id}: ${result.note}`;
    const out = [`Baseline ${id}  (p95, ms)`];
    for (const r of result.rows) {
        const change = r.deltaPct === undefined ? '' : `  ${r.deltaPct >= 0 ? '+' : ''}${r.deltaPct.toFixed(0)}%`;
        const errors = r.failRateUp ? `  error rate ${(r.failRate * 100).toFixed(1)}%` : '';
        out.push(`  ${r.status.padEnd(10)} ${r.metric}  ${r.base ?? '-'} -> ${r.now ?? '-'}${change}${errors}`);
    }
    return out.join('\n');
}

module.exports = { extract, load, record, compare, toMarkdown, toText };
