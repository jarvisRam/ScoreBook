#!/usr/bin/env node
// One entry point for every performance suite, used identically on a laptop and in CI.
//
//   node performance/scripts/run.js <suite> [--profile=quick|standard|stress] [--build]
//                                   [--record-baseline] [--no-browser] [--no-compare]
//
// Suites:
//   be-mock       isolated backend endpoints, backend started here with DATA_MODE=mock
//   fe-mock       frontend: static build + fixture API started here, HTTP load and a real browser
//   hosted-smoke  frontend + backend together in the hosted environment (nothing is started)
//
// For each script in the suite it starts what the suite needs, runs k6, compares the result
// with the recorded baseline, and exits non-zero if a threshold was crossed or a metric regressed.
// If K6_PROMETHEUS_RW_SERVER_URL is set, results are also streamed to Prometheus / Grafana.
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const baseline = require('./baseline');

const ROOT = path.resolve(__dirname, '../..');
const PERF = path.join(ROOT, 'performance');
const RESULTS = path.join(PERF, 'results');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => (args.find((a) => a.startsWith(`--${name}=`)) || '').split('=')[1] || fallback;
const suiteName = args.find((a) => !a.startsWith('--'));

const ports = {
    backend: Number(process.env.PERF_BE_PORT || 3000),
    web: Number(process.env.PERF_WEB_PORT || 8081),
    mockApi: Number(process.env.PERF_MOCK_API_PORT || 3100),
};

const SUITES = {
    'be-mock': {
        env: 'mock',
        defaultProfile: 'standard',
        profiles: ['quick', 'standard', 'stress'],
        scripts: [{ id: 'endpoints', file: 'tests/be/endpoints.js' }],
        env_vars: { API_BASE_URL: `http://localhost:${ports.backend}` },
        start: ['backend'],
    },
    'fe-mock': {
        env: 'mock',
        defaultProfile: 'standard',
        profiles: ['quick', 'standard', 'stress'],
        scripts: [
            { id: 'web-load', file: 'tests/fe/web-load.js' },
            { id: 'web-vitals', file: 'tests/fe/web-vitals.js', browser: true },
        ],
        env_vars: { API_BASE_URL: `http://localhost:${ports.mockApi}`, WEB_BASE_URL: `http://localhost:${ports.web}`, PERF_TARGET: 'mock' },
        start: ['mock-stack'],
    },
    'hosted-smoke': {
        env: 'hosted',
        defaultProfile: 'smoke',
        profiles: ['smoke'], // hosted is never load tested: it spends provider quota and is shared
        scripts: [
            { id: 'hosted', file: 'tests/smoke/hosted.js' },
            { id: 'web-vitals', file: 'tests/fe/web-vitals.js', browser: true },
        ],
        env_vars: {
            API_BASE_URL: process.env.API_BASE_URL || 'https://scorebook-backend-virid.vercel.app',
            WEB_BASE_URL: process.env.WEB_BASE_URL || 'https://scorebook-web.vercel.app',
            PERF_TARGET: 'hosted',
        },
        start: [],
    },
};

function die(message) {
    console.error(`\n${message}`);
    process.exit(2);
}

const suite = SUITES[suiteName];
if (!suite) die(`Usage: run.js <${Object.keys(SUITES).join('|')}> [--profile=...] [--build] [--record-baseline] [--no-browser] [--no-compare]`);
const profile = option('profile', suite.defaultProfile);
if (!suite.profiles.includes(profile)) die(`Suite "${suiteName}" supports profiles: ${suite.profiles.join(', ')} (got "${profile}")`);
// k6 and npm are developer/CI tools that are found on PATH on purpose: pinning an absolute path
// would break every local install. PATH is the caller's own environment, so there is no trust
// boundary to cross (Sonar S4036 is suppressed on the three lines that spawn them).
if (spawnSync('k6', ['version']).status !== 0) die('k6 is not installed. See https://grafana.com/docs/k6/latest/set-up/install-k6/'); // NOSONAR

// ---- processes the suite needs -------------------------------------------------------------
const children = [];
function stopAll() {
    for (const child of children) child.kill('SIGTERM');
}
process.on('SIGINT', () => { stopAll(); process.exit(130); });
process.on('SIGTERM', () => { stopAll(); process.exit(143); });

function probe(url) {
    return new Promise((resolve) => {
        const get = url.startsWith('https') ? https.get : http.get;
        const req = get(url, (res) => { res.resume(); resolve(res.statusCode >= 200 && res.statusCode < 500); });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => { req.destroy(); resolve(false); });
    });
}

async function waitFor(url, label) {
    for (let i = 0; i < 60; i++) {
        if (await probe(url)) return;
        await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error(`${label} did not come up at ${url}`);
}

async function startProcess(label, command, argv, options, healthUrl) {
    if (await probe(healthUrl)) {
        // Load testing whatever happens to be on the port would give meaningless numbers
        throw new Error(`${healthUrl} already responds. Stop it, or choose other ports with PERF_BE_PORT / PERF_WEB_PORT / PERF_MOCK_API_PORT.`);
    }
    fs.mkdirSync(RESULTS, { recursive: true });
    const log = fs.openSync(path.join(RESULTS, `${label}.log`), 'w');
    const child = spawn(command, argv, { ...options, stdio: ['ignore', log, log] });
    children.push(child);
    child.on('exit', (code) => { if (code) console.error(`${label} exited with code ${code}, see performance/results/${label}.log`); });
    await waitFor(healthUrl, label);
    console.log(`started ${label}`);
}

function ensureWebBuild() {
    const jsDir = path.join(ROOT, 'mobile/dist/_expo/static/js/web');
    const apiUrl = `http://localhost:${ports.mockApi}/api`;
    const built = () => fs.existsSync(jsDir) && fs.readdirSync(jsDir).some((f) => fs.readFileSync(path.join(jsDir, f), 'utf-8').includes(apiUrl));
    if (!flag('build') && built()) return;
    if (!flag('build')) die(`mobile/dist is missing or was built for another API. The API URL is inlined at build time. Build it with:\n  EXPO_PUBLIC_API_BASE_URL=${apiUrl} npm run build:web\nor re-run with --build.`);
    console.log(`building web bundle against ${apiUrl} ...`);
    const build = spawnSync('npm', ['run', 'build:web'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, EXPO_PUBLIC_API_BASE_URL: apiUrl } }); // NOSONAR
    if (build.status !== 0) die('web build failed');
}

async function startServices() {
    for (const service of suite.start) {
        if (service === 'backend') {
            await startProcess('backend', path.join(ROOT, 'backend/node_modules/.bin/ts-node'), ['src/index.ts'], {
                cwd: path.join(ROOT, 'backend'),
                env: { ...process.env, DATA_MODE: 'mock', PORT: String(ports.backend) },
            }, `http://localhost:${ports.backend}/api/health`);
        }
        if (service === 'mock-stack') {
            ensureWebBuild();
            await startProcess('mock-stack', process.execPath, [path.join(PERF, 'mocks/mock-stack.js'), String(ports.web), String(ports.mockApi)], { env: process.env }, `http://localhost:${ports.mockApi}/api/health`);
        }
    }
}

// ---- running ---------------------------------------------------------------------------------
const source = process.env.GITHUB_ACTIONS ? 'github-actions' : 'local';
const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13);
const stepSummary = process.env.GITHUB_STEP_SUMMARY;
const markdown = [`### Performance: \`${suiteName}\` (${profile} profile)`, ''];

function runK6(script) {
    const id = `${suiteName}.${script.id}`;
    const summaryFile = path.join(RESULTS, `${id}.json`);
    const k6Args = [
        'run', '--no-usage-report',
        '--summary-export', summaryFile,
        '--tag', `suite=${suiteName}`, '--tag', `script=${script.id}`, '--tag', `env=${suite.env}`,
        '--tag', `profile=${profile}`, '--tag', `source=${source}`, '--tag', `testid=${id}-${stamp}`,
    ];
    if (process.env.K6_PROMETHEUS_RW_SERVER_URL) k6Args.push('-o', 'experimental-prometheus-rw');
    k6Args.push(path.join(PERF, script.file));

    console.log(`\n=== k6: ${id} ===`);
    const result = spawnSync('k6', k6Args, { // NOSONAR
        stdio: 'inherit',
        env: {
            ...process.env,
            ...suite.env_vars,
            PERF_PROFILE: profile,
            // The names the dashboard queries (k6_http_req_duration_p95, ...)
            K6_PROMETHEUS_RW_TREND_STATS: process.env.K6_PROMETHEUS_RW_TREND_STATS || 'avg,med,p(95),p(99),max',
            K6_PROMETHEUS_RW_STALE_MARKERS: process.env.K6_PROMETHEUS_RW_STALE_MARKERS || 'true',
        },
    });
    return { id, script, summaryFile, status: result.status };
}

async function main() {
    fs.mkdirSync(RESULTS, { recursive: true });
    let failed = false;
    const scripts = suite.scripts.filter((s) => !(flag('no-browser') && s.browser));

    await startServices();
    try {
        for (const script of scripts) {
            const run = runK6(script);
            if (run.status === 99) { failed = true; markdown.push(`❌ \`${run.id}\`: a threshold (absolute budget) was crossed`, ''); }
            else if (run.status !== 0) { failed = true; markdown.push(`❌ \`${run.id}\`: k6 exited with ${run.status}`, ''); continue; }
            else markdown.push(`✅ \`${run.id}\`: all thresholds passed`, '');

            if (!fs.existsSync(run.summaryFile)) continue;
            const summary = JSON.parse(fs.readFileSync(run.summaryFile, 'utf-8'));

            if (flag('record-baseline')) {
                const recorded = baseline.record(run.id, { suite: suiteName, script: script.id, profile }, summary);
                console.log(`recorded baseline for ${run.id}: ${Object.keys(recorded.metrics).length} metrics`);
                markdown.push(`Recorded baseline \`${run.id}\` (${Object.keys(recorded.metrics).length} metrics).`, '');
            } else if (!flag('no-compare') && profile !== 'stress') {
                const comparison = baseline.compare(run.id, profile, summary);
                console.log('\n' + baseline.toText(run.id, comparison));
                markdown.push(baseline.toMarkdown(run.id, comparison));
                if (comparison.regressions > 0) failed = true;
            }
        }
    } finally {
        stopAll();
    }

    if (stepSummary) fs.appendFileSync(stepSummary, markdown.join('\n') + '\n');
    console.log(failed ? '\nPerformance run FAILED (threshold crossed or baseline regression).' : '\nPerformance run passed.');
    process.exit(failed ? 1 : 0);
}

main().catch((error) => {
    stopAll();
    die(error.message);
});
