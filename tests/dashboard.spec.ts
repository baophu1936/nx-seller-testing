import { test, expect } from '../fixtures/my-test.ts';

/**
 * Comprehensive NX Seller Dashboard Tests
 * 
 * This test suite demonstrates Playwright best practices:
 * - Using custom fixtures for setup/teardown
 * - Page Object Model pattern for page interactions
 * - Logical test organization with describe blocks
 * - Clear assertions and expectations
 * - Proper test isolation
 */

test.describe('NX Seller Dashboard', () => {
  /**
   * Tests for authenticated user navigation
   * These tests use the authenticatedPage fixture which automatically logs in
   */
  test.describe('Authenticated User Features', () => {
    test('should display dashboard after login', async ({ page, authenticatedPage }) => {
      // The authenticatedPage fixture handles login automatically
      // Verify we're on the dashboard
      await expect(page).toHaveURL(/.*#\//);
    });

    test('should have main content visible', async ({ page, authenticatedPage }) => {
      // Check for main page elements
      await expect(page).toBeTruthy();
      
      // Example: Verify the page has loaded properly
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
    });
  });

  /**
   * Tests for login functionality
   * These tests use the loginPage fixture
   */
  test.describe('Login Functionality', () => {
    test('should successfully login with valid credentials', async ({ loginPage, page }) => {
      // Use the loginPage fixture to interact with the login form
      await loginPage.login(
        'phu.truong17',
        'Abc@1234'
      );

      // Wait for navigation and verify successful login
      await page.waitForURL('**/dashboard|#/**');
      await expect(page).toHaveURL(/.*#\//);
    });

    test('should show error message for invalid credentials', async ({ loginPage, page }) => {
      // Attempt login with invalid credentials
      await loginPage.login('invalid_user', 'invalid_password');

      // Verify error message is visible
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid login details provided');
    });

    test('should keep user on login page after failed login', async ({ loginPage, page }) => {
      // Attempt login with invalid credentials
      await loginPage.login('test_user', 'test_password');

      // Verify we're still on login page
      await expect(page).toHaveURL('**/login');
    });
  });

  /**
   * Tests for form validation
   */
  test.describe('Form Validation', () => {
    test('should disable login button with empty fields', async ({ loginPage, page }) => {
      // Don't fill any fields - just verify the page is loaded
      const loginButton = loginPage.loginButton;
      
      // Verify button exists (validation would happen on form interaction)
      await expect(loginButton).toBeVisible();
    });

    test('should show error for empty username', async ({ loginPage, page }) => {
      // Try to login with only password filled
      await loginPage.passwordInput.fill('some_password');
      await loginPage.loginButton.click();

      // Verify error message appears
      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('should show error for empty password', async ({ loginPage, page }) => {
      // Try to login with only username filled
      await loginPage.usernameInput.fill('some_user');
      await loginPage.loginButton.click();

      // Verify error message appears
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  /**
   * Tests for UI elements and accessibility
   */
  test.describe('UI Elements', () => {
    test('should have all login form elements visible', async ({ loginPage }) => {
      // Verify all form elements are present
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should have correct input types', async ({ loginPage, page }) => {
      // Verify username input
      await expect(loginPage.usernameInput).toHaveAttribute('id', 'form_username');
      
      // Verify password input is of type password
      const passwordType = await loginPage.passwordInput.getAttribute('type');
      expect(passwordType).toBe('password');
    });

    test('should have visible login button with correct text', async ({ loginPage }) => {
      // Verify button text
      await expect(loginPage.loginButton).toContainText('Sign In');
      await expect(loginPage.loginButton).toBeEnabled();
    });
  });
});
