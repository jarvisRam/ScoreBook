import { test, expect } from '@playwright/test';
import { ScoreBookApp } from '../support/app';

// Only meaningful for the integration run (see web-e2e-integration.yml), where the web build is
// pointed at a candidate backend. Without this check a bad build-time URL would fall back to the
// production backend and the rest of the suite would pass against the wrong thing.
const expectedOrigin = process.env.EXPECTED_API_ORIGIN;

test.describe('api target', () => {
    test.skip(!expectedOrigin, 'EXPECTED_API_ORIGIN is not set');

    test('every API request goes to the backend under test', async ({ page }) => {
        const apiRequests: string[] = [];
        page.on('request', (request) => {
            if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());
        });

        await new ScoreBookApp(page).goto();
        await page.waitForLoadState('networkidle');

        expect(apiRequests.length, 'the app made API requests').toBeGreaterThan(0);
        const wrongTarget = apiRequests.filter((url) => new URL(url).origin !== expectedOrigin);
        expect(wrongTarget, `requests outside ${expectedOrigin}`).toEqual([]);
    });
});
