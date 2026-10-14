import { expect, type Locator, type Page } from '@playwright/test';
import { SPORTS, STATUSES, type SportId, type StatusId } from './sports';

const sportLabel = (sport: SportId) => SPORTS.find((s) => s.id === sport)!.label;
const statusLabel = (status: StatusId) => STATUSES.find((s) => s.id === status)!.label;

/**
 * Page object for the ScoreBook web app.
 *
 * Every sport screen and every status list is mounted at load and just slid
 * off-screen, so `toBeVisible()` can't tell the active one apart. "Active"
 * here means the tab is selected and the content is inside the viewport.
 */
export class ScoreBookApp {
    constructor(readonly page: Page) {}

    async goto() {
        await this.page.goto('/');
        await expect(this.logo).toBeVisible();
    }

    get logo() {
        return this.page.getByTestId('app_logo');
    }

    get githubLink() {
        return this.page.getByTestId('footer_github_link');
    }

    sportTab(sport: SportId) {
        return this.page.getByRole('tab', { name: sportLabel(sport), exact: true });
    }

    sportScreen(sport: SportId) {
        return this.page.getByTestId(`sportScreen_${sport}`);
    }

    statusTab(sport: SportId, status: StatusId) {
        return this.sportScreen(sport).getByRole('tab', { name: statusLabel(status), exact: true });
    }

    async selectSport(sport: SportId) {
        const tab = this.sportTab(sport);
        // Tabs scroll horizontally on narrow viewports
        await tab.scrollIntoViewIfNeeded();
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await expect(this.sportScreen(sport)).toBeInViewport();
    }

    async selectStatus(sport: SportId, status: StatusId) {
        const tab = this.statusTab(sport, status);
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
    }

    /** Navigate to a sport/status the way a user would. */
    async open(sport: SportId, status: StatusId) {
        await this.selectSport(sport);
        await this.selectStatus(sport, status);
    }

    list(sport: SportId, status: StatusId) {
        return this.page.getByTestId(`matchList_${sport}_${status}`);
    }

    emptyState(sport: SportId, status: StatusId) {
        return this.page.getByTestId(`matchList_${sport}_${status}_empty`);
    }

    errorState(sport: SportId, status: StatusId) {
        return this.page.getByTestId(`matchList_${sport}_${status}_error`);
    }

    loadingState(sport: SportId, status: StatusId) {
        return this.page.getByTestId(`matchList_${sport}_${status}_loading`);
    }

    retryButton(sport: SportId, status: StatusId) {
        return this.page.getByTestId(`matchList_${sport}_${status}_error_retryButton`);
    }

    /** All cards in a list. Matches `matchCard_<sport>_<status>_<n>` but not its child elements. */
    cards(sport: SportId, status: StatusId): Locator {
        return this.page.getByTestId(new RegExp(`^matchCard_${sport}_${status}_\\d+$`));
    }

    card(sport: SportId, status: StatusId, index: number) {
        return this.page.getByTestId(`matchCard_${sport}_${status}_${index}`);
    }
}
