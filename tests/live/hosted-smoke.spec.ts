import { test, expect } from '@playwright/test';
import { ScoreBookApp } from '../support/app';
import { SPORTS } from '../support/sports';

// Unmocked: runs against the deployed site (BASE_URL, default https://scorebook-web.vercel.app)
// and whatever backend it is configured to use. Scheduled only, never on PRs.
test.describe('hosted site', () => {
    test('serves the app and renders the shell', async ({ page }) => {
        const app = new ScoreBookApp(page);
        const response = await page.goto('/');

        expect(response?.status()).toBe(200);
        await expect(app.logo).toHaveText('ScoreBook');
        for (const sport of SPORTS) {
            await expect(app.sportTab(sport.id)).toBeAttached();
        }
        await expect(app.sportTab('cricket')).toHaveAttribute('aria-selected', 'true');
    });

    test('loads with no uncaught errors and no failed requests', async ({ page }) => {
        const pageErrors: string[] = [];
        const failedRequests: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        page.on('requestfailed', (request) =>
            failedRequests.push(`${request.url()} (${request.failure()?.errorText})`),
        );
        page.on('response', (response) => {
            if (response.status() >= 400) failedRequests.push(`${response.url()} (HTTP ${response.status()})`);
        });

        const app = new ScoreBookApp(page);
        await app.goto();
        // Let the app's initial burst of API calls settle
        await page.waitForLoadState('networkidle');

        expect(pageErrors, 'uncaught page errors').toEqual([]);
        expect(failedRequests, 'failed requests').toEqual([]);
    });

    test('is a production build', async ({ page }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        // Developer settings must never ship to the hosted site
        await expect(page.getByText('⚙️')).toHaveCount(0);
    });
});
