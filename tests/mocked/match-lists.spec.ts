import { test, expect } from '../support/test';
import { ScoreBookApp } from '../support/app';
import { expectCardToShow } from '../support/assertions';
import { loadFixture } from '../support/fixtures';
import { SPORTS, STATUSES } from '../support/sports';

// Every sport x status list, checked against the fixture the mock served.
// If a fixture changes these adapt on their own; a rendering bug fails them.
test.describe('match lists', () => {
    for (const sport of SPORTS) {
        for (const status of STATUSES) {
            test(`${sport.label} / ${status.label} shows every match with its details`, async ({ page }) => {
                const fixture = loadFixture(sport.id, status.id);
                const app = new ScoreBookApp(page);
                await app.goto();

                await app.open(sport.id, status.id);

                await expect(app.list(sport.id, status.id)).toBeInViewport();
                await expect(app.cards(sport.id, status.id)).toHaveCount(fixture.length);
                for (const [index, match] of fixture.entries()) {
                    await expectCardToShow(page, `matchCard_${sport.id}_${status.id}_${index}`, match);
                }
            });
        }
    }
});
