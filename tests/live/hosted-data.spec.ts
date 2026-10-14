import { test, expect, type Page } from '@playwright/test';
import { ScoreBookApp } from '../support/app';
import { SPORTS, STATUSES, type SportId, type StatusId } from '../support/sports';

// Data on the hosted backend is live or simulated, so team names and scores differ on every run.
// These tests check the plumbing instead: that each list gets a healthy API response, that the
// response has the shape the app expects, and that the UI shows what the API returned.
//
// One page load per sport (with a step per status) keeps this to a handful of loads, because the
// app calls the backend for every sport/status as soon as it opens, and when the hosted backend
// runs against real providers those calls cost quota.

interface ApiResult {
    httpStatus: number;
    body: { data?: unknown[]; mode?: string } | undefined;
}

// FlatList renders the first 10 rows up front, so only compare counts at or below that
const INITIAL_RENDER_COUNT = 10;

test.describe('hosted data', () => {
    for (const sport of SPORTS) {
        test(`${sport.label}: every list loads from the backend and renders`, async ({ page }) => {
            const results = trackMatchResponses(page);
            const app = new ScoreBookApp(page);
            await app.goto();
            await app.selectSport(sport.id);

            for (const status of STATUSES) {
                await test.step(status.label, async () => {
                    await app.selectStatus(sport.id, status.id);

                    const key = `${sport.id}:${status.id}`;
                    await expect.poll(() => results.has(key), { timeout: 30_000 }).toBe(true);
                    const result = results.get(key)!;

                    expect(result.httpStatus, 'backend HTTP status').toBe(200);
                    expect(Array.isArray(result.body?.data), 'response has a data array').toBe(true);
                    expect(['mock', 'real', 'simulation']).toContain(result.body?.mode);

                    const matches = result.body!.data!;
                    await expect(app.errorState(sport.id, status.id)).toHaveCount(0);
                    if (matches.length === 0) {
                        await expect(app.emptyState(sport.id, status.id)).toBeInViewport();
                        return;
                    }

                    await expect(app.list(sport.id, status.id)).toBeInViewport();
                    if (matches.length <= INITIAL_RENDER_COUNT) {
                        await expect(app.cards(sport.id, status.id)).toHaveCount(matches.length);
                    }
                    await expectFirstCardIsComplete(page, sport.id, status.id);
                });
            }
        });
    }
});

function trackMatchResponses(page: Page) {
    const results = new Map<string, ApiResult>();
    page.on('response', async (response) => {
        const match = response.url().match(/\/api\/matches\/(\w+)\?status=(\w+)/);
        if (!match) return;
        const body = await response.json().catch(() => undefined);
        results.set(`${match[1]}:${match[2]}`, { httpStatus: response.status(), body });
    });
    return results;
}

async function expectFirstCardIsComplete(page: Page, sport: SportId, status: StatusId) {
    const id = `matchCard_${sport}_${status}_0`;
    await expect(page.getByTestId(`${id}_homeTeam_name`)).not.toBeEmpty();
    await expect(page.getByTestId(`${id}_awayTeam_name`)).not.toBeEmpty();
    await expect(page.getByTestId(`${id}_tournament`)).not.toBeEmpty();
    await expect(page.getByTestId(`${id}_liveIndicator`)).toHaveCount(status === 'live' ? 1 : 0);
}
