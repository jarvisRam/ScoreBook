import { defineConfig, devices } from '@playwright/test';

/**
 * Two targets share this config, selected with TEST_TARGET:
 *
 *   mocked (default)  tests/mocked  The web build from this branch (mobile/dist), served locally,
 *                                   with every /api request answered from committed fixtures.
 *                                   Deterministic, no network. This is the PR gate.
 *   live              tests/live    The deployed site, with the real backend behind it. Runs on a
 *                                   schedule, never on PRs. Data is not deterministic.
 *
 * See docs/website/docs/testing/e2e-testing.md.
 */
const target = process.env.TEST_TARGET === 'live' ? 'live' : 'mocked';
const isCI = !!process.env.CI;

const HOSTED_URL = process.env.BASE_URL || 'https://scorebook-web.vercel.app';
const MOCKED_PORT = 8081;
const MOCKED_URL = `http://localhost:${MOCKED_PORT}`;

export default defineConfig({
    testDir: `./tests/${target}`,
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
        baseURL: target === 'live' ? HOSTED_URL : MOCKED_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    // The mocked suite runs against the exported build, so it exercises what ships. Build first:
    //   npm run build:web
    webServer:
        target === 'mocked'
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
