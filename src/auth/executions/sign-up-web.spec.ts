import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/signup.page';

import {
  createValidUser,
  PasswordErrorMessages,
  SignUpTestData,
  IUserData,
  fieldRequiredMessage,
  Validationemail,
  PhoneValidationData,
  createValidUserPhone,
} from '../data/sign-up.data';
import { LoginPage } from '../pages/login.page';

let signUpPage: SignUpPage;
let loginPage: LoginPage;
let sharedAccount: IUserData;
let phonePlus: IUserData;

test.describe('Sign Up Suite', () => {
  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.navigate();
    await expect(page.getByRole('heading', { name: "Let's create your account" })).toBeVisible();
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test.describe('Sign Up + Login', () => {
    test.describe.configure({ mode: 'serial' });
    test('1. Sign up successfully', async ({ page }) => {
      // TCs 1 sinh data mới và lưu vào biến dùng chung
      sharedAccount = createValidUser();

      await signUpPage.fillForm(sharedAccount);
      await signUpPage.clickSubmit();

      // Kiểm tra chuyển hướng sau khi đăng ký thành công -> Login
      await expect(page).toHaveURL(/.*login/);
    });

    test('2. User can register and then login to dashboard', async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.navigate();
      // Dùng username và password từ TCs 1
      await loginPage.login(sharedAccount.username!, sharedAccount.password!);

      // Kiểm tra vào được Dashboard
      await expect(page).not.toHaveURL(/.*login/);
      await expect(page.getByRole('heading', { name: 'Coming Soon!' })).toBeVisible();
    });
  });

  test('3. Test navigate of Sign In button on form', async ({ page }) => {
    await page.getByTestId('sign-in-btn').click();
    await expect(page).toHaveURL(/.*login/);
    // Kiểm tra heading để xác nhận đã vào đúng trang
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test.describe('Validations required fields', () => {
    test.describe.configure({ mode: 'serial' });
    test('4. Verify First Name is required', async () => {
      await signUpPage.clickSubmit();
      const message = await signUpPage.firstNameField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // First name is required
    });

    test('5. Verify Last Name is required', async () => {
      await signUpPage.fillUntil('lastName', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      const message = await signUpPage.lastNameField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // Last name is required
    });

    test('6. Verify Phone is required', async () => {
      await signUpPage.fillUntil('phone', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      const message = await signUpPage.phoneField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // Phone is required
    });

    test('7. Verify Email is required', async () => {
      await signUpPage.fillUntil('email', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      const message = await signUpPage.emailField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // Email is required
    });

    test('8. Verify Username is required', async () => {
      await signUpPage.fillUntil('username', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      const message = await signUpPage.usernameField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // Username is required
    });

    test('9. Verify Password is required', async () => {
      await signUpPage.fillUntil('password', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      const message = await signUpPage.passwordField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      // Kiểm tra nội dung thông báo
      expect(message).toBe(fieldRequiredMessage);
      // Password is required
    });
    test('10. Verify Terms acceptance is required', async () => {
      await signUpPage.fillUntil('terms', SignUpTestData.validUser);
      await signUpPage.clickSubmit();
      await expect(
        signUpPage.page.getByText('Please agree to the terms and conditions.'),
      ).toBeVisible();
    });
  });
  test.describe('Validations email rule', () => {
    test('11. Verify Email is invalid', async () => {
      await signUpPage.fillForm(SignUpTestData.invalidEmail);
      await signUpPage.clickSubmit();
      const contentEmail = "is missing an '@'.";
      const userInput = await signUpPage.emailField.inputValue();
      const message = await signUpPage.emailField.evaluate(
        (input: HTMLInputElement) => input.validationMessage,
      );
      const messageMissing = `${Validationemail} '${userInput}' ${contentEmail}`;
      // Kiểm tra nội dung thông báo
      expect(message).toBe(messageMissing); // Email is not valid
    });
  });

  test.describe('Password Validation Rules', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async () => {
      await signUpPage.fillUntil('password', SignUpTestData.validUser);
    });

    test('12. Verify Password minimum length', async () => {
      await signUpPage.fillField('password', SignUpTestData.passwordValidationRules.tooShort); // <4
      await signUpPage.clickSubmit();
      await expect(signUpPage.page.getByText(PasswordErrorMessages.short)).toBeVisible();
    });

    test('13. Verify Password lowercase rule', async () => {
      await signUpPage.fillField('password', SignUpTestData.passwordValidationRules.noLowercase);
      await signUpPage.clickSubmit();
      await expect(signUpPage.page.getByText(PasswordErrorMessages.lowercase)).toBeVisible();
    });

    test('14. Verify Password uppercase rule', async () => {
      await signUpPage.fillField('password', SignUpTestData.passwordValidationRules.noUppercase);
      await signUpPage.clickSubmit();
      await expect(signUpPage.page.getByText(PasswordErrorMessages.uppercase)).toBeVisible();
    });

    test('15. Verify Password number rule (no submit needed)', async () => {
      await signUpPage.fillField('password', SignUpTestData.passwordValidationRules.noNumber);
      await signUpPage.clickSubmit();
      await expect(signUpPage.page.getByText(PasswordErrorMessages.number)).toBeVisible();
    });
  });

  test.describe('Phone Validation Rules (Standardized)', () => {
    test.describe.configure({ mode: 'serial' });
    let baseValidData: IUserData;
    test.beforeEach(async () => {
      // Điền data hợp lệ cho các trường trước đó để cô lập lỗi ở trường Phone
      baseValidData = createValidUser();
      await signUpPage.fillForm(baseValidData);
    });

    test('16. Verify Phone invalid pattern (Client or Server error)', async () => {
      // Nhập số điện thoại vi phạm regex (bắt đầu bằng 0)
      await signUpPage.fillField('phone', PhoneValidationData.errorPattern);
      await signUpPage.clickSubmit();
      const serverError = signUpPage.page.getByText(PhoneValidationData.serverErrorMessage, {
        exact: false,
      });
      await expect(serverError).toBeVisible({ timeout: 7000 });
    });

    test('17. Verify Phone maximum length exceeded', async () => {
      // Ghi đè trường Phone bằng 16 chữ số
      await signUpPage.fillField('phone', PhoneValidationData.errorTooLong);

      await signUpPage.clickSubmit();

      // Kiểm tra lỗi Server hiện lên
      await expect(
        signUpPage.page.getByText(PhoneValidationData.serverErrorMessage, { exact: false }),
      ).toBeVisible({ timeout: 7000 });
    });

    test('18. Verify Phone with special character', async () => {
      await signUpPage.fillField('phone', PhoneValidationData.withSpecialChar);

      await signUpPage.clickSubmit();

      // Kiểm tra lỗi Server hiện lên
      await expect(
        signUpPage.page.getByText(PhoneValidationData.serverErrorMessage, { exact: false }),
      ).toBeVisible({ timeout: 7000 });
    });

    test('19. Verify Phone with plus', async ({ page }) => {
      phonePlus = createValidUserPhone();
      await signUpPage.fillForm(phonePlus);
      await signUpPage.clickSubmit();
      loginPage = new LoginPage(page);
      await loginPage.navigate();
      await expect(
        signUpPage.page.getByText(PhoneValidationData.serverErrorMessage, { exact: false }),
      ).toBeHidden({ timeout: 7000 });
      await expect(page).toHaveURL(/.*login/);
    });
  });
});
