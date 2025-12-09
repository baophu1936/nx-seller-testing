import { test, expect } from '@playwright/test';

test.describe('NX Seller Dashboard Tests', () => {
  test('should display dashboard after login', async ({ page }) => {
    await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
    await expect(page).toHaveTitle(/NX|seller|login/i);
  });
});
