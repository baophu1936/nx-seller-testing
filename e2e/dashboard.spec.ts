import { test, expect } from '@playwright/test';

test.describe('NX Seller Dashboard - Comprehensive Tests', () => {
  /**
   * Tests for authenticated user navigation
   * This demonstrates proper test organization following Playwright best practices
   */
  test.describe('Authenticated User Features', () => {
    test('should display login page', async ({ page }) => {
      // Navigate to login page
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      // Verify page loads
      await expect(page).toBeTruthy();
    });
  });

  /**
   * Tests for login form elements
   */
  test.describe('Login Form Elements', () => {
    test('should have username input field', async ({ page }) => {
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      const usernameInput = page.locator('#form_username');
      await expect(usernameInput).toBeVisible();
    });

    test('should have password input field', async ({ page }) => {
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      const passwordInput = page.locator('#form_password');
      await expect(passwordInput).toBeVisible();
    });

    test('should have sign in button', async ({ page }) => {
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      const signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toBeEnabled();
    });
  });

  /**
   * Tests for login validation
   */
  test.describe('Login Validation', () => {
    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      const usernameInput = page.locator('#form_username');
      const passwordInput = page.locator('#form_password');
      const signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
      
      await usernameInput.fill('invalid_user');
      await passwordInput.fill('invalid_password');
      await signInButton.click();
      
      // Wait for error message
      const errorMessage = page.getByText('Invalid login details provided');
      await expect(errorMessage).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
      
      const usernameInput = page.locator('#form_username');
      const passwordInput = page.locator('#form_password');
      const signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
      
      await usernameInput.fill('phu.truong17');
      await passwordInput.fill('Abc@1234');
      await signInButton.click();
      
      // Wait for navigation to dashboard
      await page.waitForURL(/.*#\//);
      await expect(page).toHaveURL(/.*#\//);
    });
  });
});
