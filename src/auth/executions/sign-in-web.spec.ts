import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SignInTestData } from '../data/sign-in.data';

test.describe('Authentication (Login) Tests', () => {
  // test.describe.configure({ mode: 'serial' });
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Nexpando Seller/);
  });

  test('1. No input username and password', async ({ page }) => {
    await loginPage.login('', '');
    const validationMessage = await page
      .getByPlaceholder('Username')
      .evaluate((input: HTMLInputElement) => input.validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');
    await expect(page).toHaveURL(/.*login/);
  });

  test('2. No input username', async ({ page }) => {
    await loginPage.login('', SignInTestData.validUser.password);
    const validationMessage = await page
      .getByPlaceholder('Username')
      .evaluate((input: HTMLInputElement) => input.validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');
    await expect(page).toHaveURL(/.*login/);
  });

  test('3. No input password', async ({ page }) => {
    await loginPage.login(SignInTestData.validUser.username, '');
    const validationMessage = await page
      .getByPlaceholder('Password')
      .evaluate((input: HTMLInputElement) => input.validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');
    await expect(page).toHaveURL(/.*login/);
  });

  test('4. Valid Username + Valid Password', async ({ page }) => {
    await loginPage.login(SignInTestData.validUser.username, SignInTestData.validUser.password);
    await expect(page).not.toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Coming Soon!' })).toBeVisible(); // Sau update lại URL = Dashboard
    await expect(page.getByText('Dashboard').first()).toBeVisible();
  });

  test('5. Valid Username + Invalid Password', async ({ page }) => {
    await loginPage.login(
      SignInTestData.invalidPassword.username,
      SignInTestData.invalidPassword.password,
    );
    await page.waitForTimeout(3000);
    await expect(page.getByRole('listitem')).toMatchAriaSnapshot(
      `- text: Invalid login details provided (Invalid Credentials)`,
    );
    await expect(page).toHaveURL(/.*login/);
  });

  test('6. Invalid Username + Valid Password', async ({ page }) => {
    await loginPage.login(
      SignInTestData.invalidUsername.username,
      SignInTestData.invalidUsername.password,
    );
    await page.waitForTimeout(3000);
    await expect(page.getByRole('listitem')).toMatchAriaSnapshot(
      `- text: Invalid login details provided (Invalid Credentials)`, // Expect: bắt value trong khung
    );
    await expect(page).toHaveURL(/.*login/);
  });

  test('7. Invalid Username + Invalid Password', async ({ page }) => {
    await loginPage.login(
      SignInTestData.invalidUsername.username,
      SignInTestData.invalidUsername.password,
    );
    await page.waitForTimeout(3000);
    await expect(page.getByRole('listitem')).toMatchAriaSnapshot(
      `- text: Invalid login details provided (Invalid Credentials)`,
    );
    await expect(page).toHaveURL(/.*login/);
  });

  test('8. Navigate to Sign up screen', async ({ page }) => {
    await loginPage.goToSignUp();
    await expect(page).toHaveURL(/.*\/sign-up/);
    await expect(page.getByRole('heading', { name: "Let's create your account" })).toBeVisible();
  });
});
