// import { test, expect } from '@playwright/test';

// test.describe('Organizer Management - Search + Sort + Footer', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

//     await page.getByTestId('form_username').fill('khoa');
//     await page.getByTestId('form_password').fill('Khoa1');
//     await page.getByTestId('form_password').press('Enter');
//     await page.getByTestId('sidebar-menu-btn-link-organizer').click();
//     await expect(page).toHaveURL(/.*organizer/);
//   });
//   test('Validate header', async ({ page }) => {
//     await page.getByTestId('sidebar-menu-btn-link-organizer').click();
//     await page.getByTestId('checkbox-all').click();
//     await page.getByTestId('bulk-actions-toolbar-close-btn').click();
//     await page.getByTestId('checkbox-4').click();
//     await page.getByTestId('checkbox-4').click();
//     await page.getByRole('button', { name: 'Name' }).click();
//     await page.getByTestId('table-column-name.{locale}-sort-asc-btn').click();
//     await page.getByRole('button', { name: 'Name' }).click();
//     await page.getByTestId('table-column-name.{locale}-sort-desc-btn').click();
//     await page.getByRole('button', { name: 'Slug' }).click();
//     await page.getByTestId('table-column-slug-sort-asc-btn').click();
//     await page.getByRole('button', { name: 'Slug' }).click();
//     await page.getByTestId('table-column-slug-sort-desc-btn').click();
//     await page.getByRole('button', { name: 'Status' }).click();
//     await page.getByTestId('table-column-status-sort-asc-btn').click();
//     await page.getByRole('button', { name: 'Status' }).click();
//     await page.getByTestId('table-column-status-sort-desc-btn').click();
//     await page.getByRole('button', { name: 'Status' }).click();
//     await page.getByTestId('table-column-status-clear-sort-btn').click();
//   });

//   test('Test navigate of button', async ({ page }) => {
//     await page.getByTestId('table-create-btn').click();
//     await page.getByRole('link', { name: 'Organizer', exact: true }).click();
//     await expect(page.getByText('Create Organizer')).toBeVisible();
//     await page.getByTestId('table-edit-btn-26').click();
//     await page.getByRole('link', { name: 'Organizer', exact: true }).click();
//     await expect(page.getByText('Edit Organizer')).toBeVisible();
//     await page.getByTestId('table-create-merchants-btn-25').click();
//     await page.getByRole('link', { name: 'Organizer', exact: true }).click();
//     await expect(page.getByText('Create Merchants')).toBeVisible();
//   });
// })
