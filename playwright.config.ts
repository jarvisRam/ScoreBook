import { defineConfig, devices } from '@playwright/test';

/**
 * Three targets share this config, selected with TEST_TARGET:
 *
 *   mocked (default)  tests/mocked  The web build from this branch (mobile/dist), served locally,
 *                                   with every /api request answered from committed fixtures.
 *                                   Deterministic, no network. This is the PR gate.
 *   live              tests/live    The deployed site, with the real backend behind it. Runs on a
 *                                   schedule, never on PRs. Data is not deterministic.
 *   integration       tests/live    The web build from this branch, served locally, built against a
 *                                   candidate backend (EXPO_PUBLIC_API_BASE_URL) that is not
 *                                   deployed yet. Same specs as live. Set EXPECTED_API_ORIGIN so
 *                                   the run proves it hit that backend.
 *
 * See docs/website/docs/testing/e2e-testing.md.
 */
const target = ['live', 'integration'].includes(process.env.TEST_TARGET ?? '')
    ? (process.env.TEST_TARGET as 'live' | 'integration')
    : 'mocked';
// integration shares the live specs; only where the app is served from differs
const testDirName = target === 'integration' ? 'live' : target;
const servesLocalBuild = target !== 'live';
const isCI = !!process.env.CI;

const HOSTED_URL = process.env.BASE_URL || 'https://scorebook-web.vercel.app';
const MOCKED_PORT = 8081;
const MOCKED_URL = `http://localhost:${MOCKED_PORT}`;

export default defineConfig({
    testDir: `./tests/${testDirName}`,
    fullyParallel: true,
    forbidOnly: isCI,
    // A flaky test is a failing test, so the PR gate never retries. The live suite goes over the
    // internet to a third-party host, so it gets one retry to ride out a network blip.
    retries: target === 'live' && isCI ? 1 : 0,
    workers: isCI ? 2 : undefined,
    reporter: isCI
        ? [['github'], ['html', { open: 'never' }]]
        : [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: servesLocalBuild ? MOCKED_URL : HOSTED_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    // The mocked and integration suites run against the exported build, so they exercise what
    // ships. Build first (integration: with EXPO_PUBLIC_API_BASE_URL set):
    //   npm run build:web
    webServer:
        servesLocalBuild
            ? {
                  command: `node tests/support/serve-web-build.js ${MOCKED_PORT}`,
                  url: MOCKED_URL,
                  reuseExistingServer: !isCI,
                  timeout: 30_000,
              }
            : undefined,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
});
