// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

  // Expect a title "to contain" a substring.
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

test('get started link', async ({ page }) => {
  await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

  // Click the get started link.
  // await page.getByRole('link', { name: 'Sign In' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});
