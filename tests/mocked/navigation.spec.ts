import { test, expect } from '../support/test';
import { ScoreBookApp } from '../support/app';
import { SPORTS, STATUSES } from '../support/sports';

test.describe('navigation', () => {
    for (const sport of SPORTS) {
        test(`can switch to ${sport.label}`, async ({ page }) => {
            const app = new ScoreBookApp(page);
            await app.goto();

            await app.selectSport(sport.id);

            await expect(app.sportScreen(sport.id)).toBeInViewport();
            // Landing on a sport always starts at its Live tab
            await expect(app.statusTab(sport.id, 'live')).toHaveAttribute('aria-selected', 'true');
            await expect(app.list(sport.id, 'live')).toBeVisible();
        });
    }

    test('only one sport is on screen at a time', async ({ page }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        await app.selectSport('tennis');

        await expect(app.sportScreen('tennis')).toBeInViewport();
        await expect(app.sportScreen('cricket')).not.toBeInViewport();
        await expect(app.sportTab('cricket')).toHaveAttribute('aria-selected', 'false');
    });

    for (const status of STATUSES) {
        test(`can switch between status tabs: ${status.label}`, async ({ page }) => {
            const app = new ScoreBookApp(page);
            await app.goto();

            await app.selectStatus('cricket', status.id);

            await expect(app.list('cricket', status.id)).toBeInViewport();
            for (const other of STATUSES.filter((s) => s.id !== status.id)) {
                await expect(app.statusTab('cricket', other.id)).toHaveAttribute('aria-selected', 'false');
            }
        });
    }

    test('each sport keeps its own selected status tab', async ({ page }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        await app.open('cricket', 'completed');
        await app.open('football', 'upcoming');

        // Inactive sports are hidden from the accessibility tree, so go back to check each
        await app.selectSport('cricket');
        await expect(app.statusTab('cricket', 'completed')).toHaveAttribute('aria-selected', 'true');
        await app.selectSport('football');
        await expect(app.statusTab('football', 'upcoming')).toHaveAttribute('aria-selected', 'true');
    });

    test('requests the matching sport and status from the API', async ({ page, api }) => {
        const app = new ScoreBookApp(page);
        await app.goto();

        await app.open('tennis', 'upcoming');

        await expect.poll(() => api.callCount('tennis', 'upcoming')).toBeGreaterThan(0);
        const request = api.requests.find((r) => r.sport === 'tennis' && r.status === 'upcoming')!;
        const url = new URL(request.url);
        expect(url.pathname).toBe('/api/matches/tennis');
        expect(url.searchParams.get('status')).toBe('upcoming');
    });
});
