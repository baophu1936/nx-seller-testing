import { test, expect } from '@playwright/test';
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#form_username');
    this.passwordInput = page.locator('#form_password');
    this.loginButton  = page.getByRole('button', { name: 'Sign In' , exact: true });
    this.errorMessage = page.getByText('Invalid login details provided (Invalid Credentials)');
  }

  async goto() {
    await this.page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
    
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export default LoginPage;
