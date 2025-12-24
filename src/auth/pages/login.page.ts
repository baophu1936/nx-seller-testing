import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly loginUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#form_username');
    this.passwordField = page.locator('#form_password');
    this.signInButton = page.locator('[title="Sign In"]');
    this.loginUrl = 'https://nx-seller-client.eventry.phatnt.com/#/login';
  }

  async navigate() {
    await this.page.goto(this.loginUrl);
  }

  async fillUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(username?: string, password?: string) {
    if (username) {
      await this.fillUsername(username);
    }
    if (password) {
      await this.fillPassword(password);
    }
    await this.clickSignIn();
  }

  async goToSignUp() {
    await this.page.getByTestId('sign-up-btn').click();
    await this.page.waitForURL(/.*\/sign-up/);
  }
}
