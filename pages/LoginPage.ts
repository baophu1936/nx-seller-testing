import { Page, Locator } from '@playwright/test';

/**
 * LoginPage - Page Object Model for login functionality
 * 
 * This class encapsulates all interactions with the login page.
 * Following Playwright's Page Object Model (POM) best practice.
 * 
 * Benefits:
 * - Centralized selectors for maintainability
 * - Reusable methods across test files
 * - Easy to update if UI changes
 * - Clear separation of concerns
 */
export class LoginPage {
  private page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  /**
   * Initialize the LoginPage with all necessary locators
   * @param page - The Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#form_username');
    this.passwordInput = page.locator('#form_password');
    this.loginButton = page.getByRole('button', { name: 'Sign In', exact: true });
    this.errorMessage = page.getByText('Invalid login details provided (Invalid Credentials)');
  }

  /**
   * Navigate to the login page
   * This is called during fixture setup
   */
  async goto(): Promise<void> {
    await this.page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
    // Wait for login form to be visible
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Perform login with provided credentials
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Check if error message is displayed
   * @returns boolean indicating if error is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get the error message text
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  /**
   * Clear the username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear the password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Clear both input fields
   */
  async clearAllFields(): Promise<void> {
    await this.clearUsername();
    await this.clearPassword();
  }
}

export default LoginPage;
