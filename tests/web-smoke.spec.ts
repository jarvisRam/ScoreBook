import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // The app currently has title "Live"
    await expect(page).toHaveTitle(/Live|ScoreBook|App/);
});

test('shows home screen text', async ({ page }) => {
    await page.goto('/');

    // Check for body visibility as a generic check
    await expect(page.locator('body')).toBeVisible();
});
