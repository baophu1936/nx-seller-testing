import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import users from '../fixtures/users.json';

test.describe('SauceDemo Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login thành công với user hợp lệ', async ({ page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL('https://nx-seller-client.eventry.phatnt.com/#/');
  });

  test('Login thất bại với user sai thông tin', async () => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid login details provided (Invalid Credentials)');
  });

  // test('Should login fail if user is blocked', async () => {
  //   await loginPage.login(users.lockedUser.username, users.lockedUser.password);
  //   await expect(loginPage.errorMessage).toBeVisible();
  //   await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  // });
});
