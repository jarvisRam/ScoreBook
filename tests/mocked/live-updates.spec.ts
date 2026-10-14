import { test, expect } from '../support/test';
import { ScoreBookApp } from '../support/app';
import { loadFixture, matchesEnvelope } from '../support/fixtures';

// Mirrors LIVE_MATCH_POLL_INTERVAL in mobile/src/constants/config.ts
const LIVE_POLL_INTERVAL_MS = 30_000;

test.describe('live updates', () => {
    test('a live score refreshes automatically on the polling interval', async ({ page, api }) => {
        const fixture = loadFixture('cricket', 'live');
        const before = fixture[0].homeTeam.score!;
        const updated = structuredClone(fixture);
        updated[0].homeTeam.score = { ...before, runs: before.runs! + 33, wickets: before.wickets! + 1 };

        api.respond('cricket', 'live', (callNumber) => ({
            body: matchesEnvelope(callNumber === 1 ? fixture : updated),
        }));

        // Fake time so the 30s interval elapses instantly instead of slowing the suite
        await page.clock.install();
        const app = new ScoreBookApp(page);
        await app.goto();

        const homeRuns = page.getByTestId('matchCard_cricket_live_0_homeScore_runs');
        await expect(homeRuns).toHaveText(`${before.runs}/${before.wickets}`);

        await page.clock.fastForward(LIVE_POLL_INTERVAL_MS + 1_000);

        await expect(homeRuns).toHaveText(`${before.runs! + 33}/${before.wickets! + 1}`);
        expect(api.callCount('cricket', 'live')).toBeGreaterThanOrEqual(2);
    });

    test('completed matches are not polled', async ({ page, api }) => {
        await page.clock.install();
        const app = new ScoreBookApp(page);
        await app.goto();
        await app.open('cricket', 'completed');
        await expect(app.list('cricket', 'completed')).toBeInViewport();
        const callsBefore = api.callCount('cricket', 'completed');

        await page.clock.fastForward(LIVE_POLL_INTERVAL_MS * 4);
        await page.waitForTimeout(500);

        expect(api.callCount('cricket', 'completed')).toBe(callsBefore);
    });
});
