import { expect, type Page } from '@playwright/test';
import type { MockMatch, MockScore } from './fixtures';
import type { SportId } from './sports';

/** How a score is rendered, per sport (see ScoreDisplay.tsx). */
async function expectScore(page: Page, scoreId: string, sport: SportId, score?: MockScore) {
    const at = (suffix: string) => page.getByTestId(`${scoreId}_${suffix}`);

    if (!score) {
        await expect(at('noScore')).toHaveText('-');
        return;
    }

    switch (sport) {
        case 'cricket':
            await expect(at('runs')).toHaveText(`${score.runs}/${score.wickets}`);
            if (score.overs) await expect(at('overs')).toHaveText(`(${score.overs})`);
            break;
        case 'football':
        case 'hockey':
        case 'soccer':
            await expect(at('points')).toHaveText(String(score.points ?? score.goals ?? 0));
            break;
        case 'tennis':
        case 'badminton':
            for (const [i, set] of (score.sets ?? []).entries()) {
                await expect(at(`set${i}`)).toHaveText(String(set));
            }
            break;
    }
}

/** Assert a rendered match card shows what the fixture says it should. */
export async function expectCardToShow(page: Page, cardId: string, match: MockMatch) {
    const card = page.getByTestId(cardId);
    await expect(card).toBeVisible();

    await expect(page.getByTestId(`${cardId}_homeTeam_name`)).toHaveText(match.homeTeam.name);
    await expect(page.getByTestId(`${cardId}_awayTeam_name`)).toHaveText(match.awayTeam.name);
    await expect(page.getByTestId(`${cardId}_tournament`)).toContainText(match.tournament ?? '');
    await expect(card.getByTestId('venueInfo_name')).toHaveText(match.venue.name);

    await expectScore(page, `${cardId}_homeScore`, match.sport, match.homeTeam.score);
    await expectScore(page, `${cardId}_awayScore`, match.sport, match.awayTeam.score);

    // The LIVE badge is only for live matches; upcoming ones show a start time
    await expect(page.getByTestId(`${cardId}_liveIndicator`)).toHaveCount(match.status === 'live' ? 1 : 0);
    await expect(page.getByTestId(`${cardId}_time`)).toHaveCount(match.status === 'upcoming' ? 1 : 0);
}
