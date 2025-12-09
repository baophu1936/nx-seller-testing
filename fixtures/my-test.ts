import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.ts';
import users from './users.json';

/**
 * Custom fixture types
 * Following Playwright's best practice of creating custom fixtures
 */
type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: void;
};

/**
 * Extend the base test with custom fixtures
 * This allows reusable setup/teardown logic across tests
 */
export const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture - sets up the login page and provides it to tests
   * Setup: Initialize LoginPage and navigate to login URL
   * Teardown: None needed (page automatically cleaned up)
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  /**
   * AuthenticatedPage fixture - provides a pre-authenticated page
   * This is useful for tests that require a logged-in user
   * Setup: Login with valid credentials
   * Teardown: None needed (page automatically cleaned up)
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
    
    // Wait for navigation to complete and verify we're logged in
    await page.waitForURL('**/dashboard|#/**');
    
    await use();
  },
});

// Re-export expect for convenience
export { expect };
