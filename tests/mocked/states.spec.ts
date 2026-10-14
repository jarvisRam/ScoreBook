import { test, expect } from '../support/test';
import { ScoreBookApp } from '../support/app';
import { loadFixture, matchesEnvelope } from '../support/fixtures';
import { STATUSES } from '../support/sports';

const EMPTY_MESSAGES = {
    live: 'No live matches at the moment',
    upcoming: 'No upcoming matches scheduled',
    completed: 'No recently completed matches',
} as const;

test.describe('loading state', () => {
    test('shows a spinner until the matches arrive', async ({ page, api }) => {
        let release!: () => void;
        const gate = new Promise<void>((resolve) => (release = resolve));
        api.respond('cricket', 'live', async () => {
            await gate;
            return { body: matchesEnvelope(loadFixture('cricket', 'live')) };
        });

        const app = new ScoreBookApp(page);
        await app.goto();

        await expect(app.loadingState('cricket', 'live')).toBeVisible();
        await expect(app.list('cricket', 'live')).toHaveCount(0);

        release();

        await expect(app.list('cricket', 'live')).toBeVisible();
        await expect(app.loadingState('cricket', 'live')).toHaveCount(0);
    });
});

test.describe('empty state', () => {
    for (const status of STATUSES) {
        test(`${status.label} shows a friendly message when there are no matches`, async ({ page, api }) => {
            api.respond('cricket', status.id, { body: matchesEnvelope([]) });
            const app = new ScoreBookApp(page);
            await app.goto();

            await app.open('cricket', status.id);

            await expect(app.emptyState('cricket', status.id)).toBeInViewport();
            await expect(page.getByTestId(`matchList_cricket_${status.id}_empty_message`)).toHaveText(
                EMPTY_MESSAGES[status.id],
            );
            await expect(app.cards('cricket', status.id)).toHaveCount(0);
        });
    }
});

test.describe('error state', () => {
    test('shows an error and recovers when the user retries', async ({ page, api }) => {
        let failing = true;
        api.respond('cricket', 'live', () =>
            failing
                ? { status: 500, body: { error: { message: 'boom', code: 'INTERNAL_ERROR' } } }
                : { body: matchesEnvelope(loadFixture('cricket', 'live')) },
        );

        const app = new ScoreBookApp(page);
        await app.goto();

        // The app retries a failed request twice (with backoff) before giving up
        await expect(app.errorState('cricket', 'live')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByTestId('matchList_cricket_live_error_message')).toHaveText(
            'Failed to load matches. Please try again.',
        );
        await expect(app.cards('cricket', 'live')).toHaveCount(0);
        expect(api.callCount('cricket', 'live')).toBe(3);

        failing = false;
        await app.retryButton('cricket', 'live').click();

        await expect(app.list('cricket', 'live')).toBeVisible();
        await expect(app.errorState('cricket', 'live')).toHaveCount(0);
        await expect(app.cards('cricket', 'live')).toHaveCount(loadFixture('cricket', 'live').length);
    });

    test('a failing list does not affect the others', async ({ page, api }) => {
        api.respond('cricket', 'live', { status: 503, body: { error: { message: 'down', code: 'UNAVAILABLE' } } });

        const app = new ScoreBookApp(page);
        await app.goto();
        await expect(app.errorState('cricket', 'live')).toBeVisible({ timeout: 15_000 });

        await app.selectStatus('cricket', 'upcoming');
        await expect(app.list('cricket', 'upcoming')).toBeInViewport();
        await app.selectSport('tennis');
        await expect(app.list('tennis', 'live')).toBeInViewport();
    });
});
