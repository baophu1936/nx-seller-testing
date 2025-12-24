import { Page, Locator } from '@playwright/test';
import { IUserData } from '../../../playwright.config';

export class SignUpPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly phoneField: Locator;
  readonly emailField: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly termsCheckbox: Locator;
  readonly signUpSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.getByTestId('form_firstName');
    this.lastNameField = page.getByTestId('form_lastName');
    this.phoneField = page.getByTestId('form_phone');
    this.emailField = page.getByTestId('form_email');
    this.usernameField = page.getByTestId('form_username');
    this.passwordField = page.getByTestId('form_password');
    this.termsCheckbox = page.getByTestId('form_isAcceptTerms');
    this.signUpSubmitButton = page.getByTestId('sign-up-submit-btn');
  }

  async navigate() {
    await this.page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');
    await this.page.getByTestId('sign-up-btn').click();
  }

  /**
   * Điền một field bất kỳ dựa trên tên field
   */
  async fillField(fieldName: keyof IUserData, value: string | boolean) {
    switch (fieldName) {
      case 'firstName': {
        await this.firstNameField.fill(value as string);
        break;
      }
      case 'lastName': {
        await this.lastNameField.fill(value as string);
        break;
      }
      case 'phone': {
        await this.phoneField.fill(value as string);
        break;
      }
      case 'email': {
        await this.emailField.fill(value as string);
        break;
      }
      case 'username': {
        await this.usernameField.fill(value as string);
        break;
      }
      case 'password': {
        await this.passwordField.fill(value as string);
        break;
      }
      case 'terms': {
        if (value) {
          await this.termsCheckbox.check();
        } else {
          await this.termsCheckbox.uncheck();
        }
        break;
      }
    }
  }

  /**
   * Hàm điền toàn bộ form
   */
  async fillForm(data: IUserData) {
    if (data.firstName) {
      await this.fillField('firstName', data.firstName);
    }
    if (data.lastName) {
      await this.fillField('lastName', data.lastName);
    }
    if (data.phone) {
      await this.fillField('phone', data.phone);
    }
    if (data.email) {
      await this.fillField('email', data.email);
    }
    if (data.username) {
      await this.fillField('username', data.username);
    }
    if (data.password) {
      await this.fillField('password', data.password);
    }
    if (data.terms !== undefined) {
      await this.fillField('terms', data.terms);
    }
  }

  /**
   * Hàm điền lũy tiến: điền tất cả các trường TRƯỚC targetField
   */
  async fillUntil(targetField: keyof IUserData, data: IUserData) {
    const fields: (keyof IUserData)[] = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'username',
      'password',
      'terms',
    ];
    for (const field of fields) {
      if (field === targetField) {
        break;
      }
      const value = data[field];
      if (value !== undefined) {
        await this.fillField(field, value);
      }
    }
  }

  async clickSubmit() {
    await this.signUpSubmitButton.click();
  }
}
