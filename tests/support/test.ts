import { test as base, expect } from '@playwright/test';
import { MockApi } from './mock-api';

/**
 * Test fixture for the mocked suite.
 *
 * `auto: true` matters: Playwright fixtures are lazy, so without it a test
 * that never mentions `api` would silently talk to the real backend. Here the
 * mock is installed for every test, before the page loads, and a test fails if
 * the app made a request nothing was mocked for.
 */
export const test = base.extend<{ api: MockApi }>({
    api: [
        async ({ context, baseURL }, use) => {
            const api = new MockApi(new URL(baseURL!).origin);
            await api.install(context);
            await use(api);
            expect(api.unhandled, 'requests with no mock').toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
