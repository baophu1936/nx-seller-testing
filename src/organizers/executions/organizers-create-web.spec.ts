import { test, expect } from '@playwright/test';
// import { AuthTokenData } from '../../auth/data/auth-token.data';
import { LoginPage } from '../../auth/pages/login.page';
import { OrganizerPage } from '../pages/organizers.page';
import { SignInTestData } from '../../auth/data/sign-in.data';

let i = 20; // Biến đếm bắt đầu từ 1
let j = 150;
let k = 1100;
// const l = 10000;

test.describe('Organizer Management - Create Actions', () => {
  let organizerPage: OrganizerPage;
  let loginPage: LoginPage;
  // test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    organizerPage = new OrganizerPage(page);
    await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

    // Dùng data từ file test-data
    await loginPage.login(SignInTestData.validUser.username, SignInTestData.validUser.password);
    await page.getByTestId('sidebar-menu-btn-link-organizer').click();
    await organizerPage.goToCreate();
    await expect(page).toHaveURL(/.*\/create/);
  });

  test('1: Empty Name and Save', async () => {
    await organizerPage.nameInput.clear();
    await expect(organizerPage.saveButton).toBeDisabled();
  });

  test('2: Fill Name and Cancel', async ({ page }) => {
    await organizerPage.nameInput.fill('Demo Name');
    await organizerPage.cancelButton.click();
    await organizerPage.cancelWithDialogCreate('dismiss');
    await expect(page).toHaveURL(/.*\/create/);
    await expect(organizerPage.nameInput).toHaveValue('Demo Name');
  });

  test('3: Fill Name -> Cancel -> OK', async ({ page }) => {
    await organizerPage.nameInput.fill('Demo Name 2');
    await organizerPage.cancelButton.click();
    await organizerPage.cancelWithDialogCreate('accept');
    await expect(page).not.toHaveURL(/.*\/create/);
  });

  test('4: Fill Name and Save', async ({ page }) => {
    const uniqueName = `Demo Organizer + ${i++}`;
    await organizerPage.nameInput.fill(uniqueName);
    await organizerPage.saveButton.click();
    await expect(page).not.toHaveURL(/.*\/create/);
    await expect(organizerPage.nameInput).toHaveValue(uniqueName);
    await expect(page).toHaveURL(/.*\/edit/);
    await expect(page.getByRole('heading', { name: 'Edit Organizer' })).toBeVisible();
    await expect(page.getByText('Element created')).toBeVisible();
  });

  test('5. Create Organizer with different Status', async ({ page }) => {
    const statuses: ('Activated' | 'Deactivated' | 'Draft' | 'Archive')[] = [
      'Activated',
      'Deactivated',
      'Draft',
      'Archive',
    ];
    for (const status of statuses) {
      const uniqueName = `Organizer +S+ ${status} ${j++}`;
      await organizerPage.nameInput.fill(uniqueName);
      await organizerPage.selectStatus(status);
      await organizerPage.saveButton.click();
      await expect(page).not.toHaveURL(/.*\/create/);
      await expect(page.getByText('Element created')).toBeVisible();
      await expect(organizerPage.nameInput).toHaveValue(uniqueName);
      await expect(organizerPage.statusDropdown).toHaveText(status);
      await page
        .getByRole('navigation', { name: 'breadcrumb' })
        .getByRole('link', { name: 'Organizer', exact: true })
        .click();
      await organizerPage.table.waitFor({ state: 'visible' });
      await expect(organizerPage.table).toContainText(uniqueName);
      await expect(organizerPage.table).toContainText(status);
      // Quay lại trang tạo mới
      await page.getByRole('button', { name: 'Close toast' }).click();
      await organizerPage.goToCreate();
    }
  });

  test('6. Create Organizer with VNName', async ({ page }) => {
    const uniqueName = `Organizer${(k = k + 1)}`;
    const uniqueVnName = `VN ${(k = k + 1)}`;
    await organizerPage.nameInput.fill(`${uniqueName}`);
    await organizerPage.tabVi.click();
    await organizerPage.nameVnInput.fill(`${uniqueVnName}`);
    await organizerPage.saveButton.click();
    await expect(page).not.toHaveURL(/.*\/create/);
    await expect(page.getByText('Element created')).toBeVisible();
    await organizerPage.gotToTabEN();
    await expect(organizerPage.nameInput).toHaveValue(`${uniqueName}`);
    await organizerPage.goToTabVI();
    await expect(organizerPage.nameVnInput).toHaveValue(`${uniqueVnName}`);
  });

  // // Bug: đang hiển thị slug = name chứ không phải slug custom
  test('7. Create Organizer with custom Slug', async ({ page }) => {
    const uniqueName = `${(k = k + 2)}`;
    const uniqueSlug = `custom-slug-${(k = k + 3)}`;
    await organizerPage.createSlug(`${uniqueName}`, `${uniqueSlug}`);
    await expect(page).not.toHaveURL(/.*\/create/);
    await expect(page.getByText('Element created')).toBeVisible();
    await expect(organizerPage.nameInput).toHaveValue(`${uniqueName}`);
    await expect(organizerPage.slugInput).toHaveValue(`${uniqueSlug}`);
  });

  // Bug: không chặn trùng tên
  test('8. Create Organizer with duplicate Name no need', async ({ page }) => {
    const uniqueName = `Organizer Only`;
    await organizerPage.nameInput.fill(uniqueName);
    await organizerPage.saveButton.click();
    await page
      .getByRole('navigation', { name: 'breadcrumb' })
      .getByRole('link', { name: 'Organizer', exact: true })
      .click();
    await organizerPage.goToCreate();
    await organizerPage.nameInput.fill(uniqueName);
    await organizerPage.saveButton.click();
    await expect(page.getByText('Duplicate Organizers')).toBeVisible();
  });
});
