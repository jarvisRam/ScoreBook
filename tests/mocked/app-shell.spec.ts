import { test, expect } from '../support/test';
import { ScoreBookApp } from '../support/app';
import { SPORTS } from '../support/sports';

test.describe('app shell', () => {
    test('launches on cricket / live with the branding and every sport tab', async ({ page, api }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        await expect(app.logo).toHaveText('ScoreBook');
        for (const sport of SPORTS) {
            await expect(app.sportTab(sport.id)).toBeAttached();
        }

        // Default selection
        await expect(app.sportTab('cricket')).toHaveAttribute('aria-selected', 'true');
        await expect(app.statusTab('cricket', 'live')).toHaveAttribute('aria-selected', 'true');
        await expect(app.sportScreen('cricket')).toBeInViewport();
        await expect(app.list('cricket', 'live')).toBeVisible();
        expect(api.callCount('cricket', 'live')).toBeGreaterThan(0);
    });

    test('loads without uncaught errors', async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));

        const app = new ScoreBookApp(page);
        await app.goto();
        await expect(app.list('cricket', 'live')).toBeVisible();

        expect(pageErrors).toEqual([]);
    });

    test('does not expose developer settings in a production build', async ({ page }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        // The gear button and DeveloperSettings route only exist when __DEV__ is true
        await expect(page.getByText('⚙️')).toHaveCount(0);
    });

    test('footer GitHub link opens the repository', async ({ page }) => {
        // Capture window.open instead of following it, so the test never leaves the app origin
        await page.addInitScript(() => {
            (window as any).__opened = [];
            window.open = ((url?: string | URL) => {
                (window as any).__opened.push(String(url));
                return null;
            }) as typeof window.open;
        });

        const app = new ScoreBookApp(page);
        await app.goto();
        await app.githubLink.click();

        const opened = await page.evaluate(() => (window as any).__opened as string[]);
        expect(opened).toEqual(['https://github.com/jarvisRam/ScoreBook']);
    });
});
