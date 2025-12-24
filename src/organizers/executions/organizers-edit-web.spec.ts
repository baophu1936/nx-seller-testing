import { test, expect } from '@playwright/test';
import { LoginPage } from '../../auth/pages/login.page';
import { OrganizerPage } from '../pages/organizers.page';
import { SignInTestData } from '../../auth/data/sign-in.data';
let i = 2;
let j = 110;

test.describe('Organizer Management - Edit Actions', () => {
  let organizerPage: OrganizerPage;
  let loginPage: LoginPage;
  // test.describe.configure({ mode: 'serial' });
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    organizerPage = new OrganizerPage(page);

    // Login
    await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

    // Dùng data từ file test-data
    await loginPage.login(SignInTestData.validUser.username, SignInTestData.validUser.password);
    await page.getByTestId('sidebar-menu-btn-link-organizer').click();
  });

  test('1. Edit Organizers name and verify by ID navigation', async ({ page }) => {
    const rowIndex = 1;

    // 1. Lấy ID từ data-testid của nút edit và tên hiện tại
    const organizerId = await organizerPage.getRowId(rowIndex);
    const targetName = await organizerPage.getRowName(rowIndex);

    // 2. Click nút Edit dựa trên index
    await organizerPage.clickEditRow(rowIndex);

    // 3. Thay đổi tên và Lưu
    const newName = `${targetName} ${i++}`;
    await organizerPage.nameInput.fill(newName);
    await organizerPage.selectStatus('Activated');
    await organizerPage.saveButton.click();

    // 4. Assertion: Kiểm tra thông báo thành công xuất hiện
    await expect(page.getByText('Element updated')).toBeVisible();

    // 5. ĐIỀU HƯỚNG TRỰC TIẾP bằng ID để Verify
    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`);

    // 6. Assertion: Kiểm tra giá trị trong input phải khớp với tên mới đã sửa
    // toHaveValue check input content
    await expect(organizerPage.nameInput).toHaveValue(newName);
  });

  //Bug: Sau khi edit khong update lai ngay
  test('2. Edit Organizer Name and Slug', async ({ page }) => {
    const rowIndex = 2;
    const organizerId = await organizerPage.getRowId(rowIndex);
    const targetName = await organizerPage.getRowName(rowIndex);
    await organizerPage.clickEditRow(rowIndex);
    // 2. Thay đổi tên và Lưu
    const newName = `${targetName} ${i++}`;
    await organizerPage.nameInput.fill(newName);
    const newSlug = `edited slug-${i + 2}`;
    await organizerPage.slug.click();
    await organizerPage.slugInput.fill(newSlug);
    await organizerPage.saveButton.click();

    // 3. Assertion: Kiểm tra thông báo thành công
    await expect(page.getByText('Element updated')).toBeVisible();
    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`);
    await expect(organizerPage.nameInput).toHaveValue(newName);
    await expect(organizerPage.nameInput).toHaveValue(newSlug);
  });

  test('3. Edit Organizer Name, Slug and Status', async ({ page }) => {
    const rowIndex = 4;
    const organizerId = await organizerPage.getRowId(rowIndex);
    const targetName = await organizerPage.getRowName(rowIndex);
    await organizerPage.clickEditRow(rowIndex);
    // 2. Thay đổi tên và Lưu
    const newName = `${targetName} ${i++}`;
    await organizerPage.nameInput.fill(newName);
    const newSlug = `edited-${i++}`;
    await organizerPage.slug.click();
    await organizerPage.slugInput.fill(newSlug);
    await organizerPage.selectStatus('Draft');
    await organizerPage.saveButton.click();

    // 3. Assertion: Kiểm tra thông báo thành công
    await expect(page.getByText('Element updated')).toBeVisible();
    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`);
    await expect(organizerPage.nameInput).toHaveValue(newName);
    await expect(organizerPage.slugInput).toHaveValue(newSlug);
    await expect(organizerPage.statusDropdown).toHaveValue('Draft');
  });

  test('4. Edit Only Slug', async ({ page }) => {
    const rowIndex = 4;
    const organizerId = await organizerPage.getRowId(rowIndex);
    const targetName = await organizerPage.getRowName(rowIndex);
    await organizerPage.clickEditRow(rowIndex);
    const newSlug = `slug-${i++}`;
    await organizerPage.slug.click();
    await organizerPage.slugInput.fill(newSlug);
    await organizerPage.saveButton.click();

    await expect(page.getByText('Element updated')).toBeVisible();
    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`);
    await expect(organizerPage.nameInput).toHaveValue(targetName);
    await expect(organizerPage.slugInput).toHaveValue(newSlug);
  });

  test('5. Edit Only Status', async ({ page }) => {
    const rowIndex = 5;
    const organizerId = await organizerPage.getRowId(rowIndex);
    const targetName = await organizerPage.getRowName(rowIndex);
    const curentSlug = await organizerPage.getRowSlug(rowIndex);
    await organizerPage.clickEditRow(rowIndex);
    await organizerPage.selectStatus('Archive');
    await organizerPage.saveButton.click();

    await expect(page.getByText('Element updated')).toBeVisible();
    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`);
    await expect(organizerPage.nameInput).toHaveValue(targetName);
    await expect(organizerPage.slugInput).toHaveValue(curentSlug);

    await expect(organizerPage.nameInput).toHaveValue(targetName);
    await expect(organizerPage.statusDropdown).toHaveValue('Archive');
  });

  test('6. Do not edit and click Save', async () => {
    await organizerPage.clickEditRow(6);
    await expect(organizerPage.saveButton).toBeDisabled();
  });

  test('7. Do not edit and click Cancel', async ({ page }) => {
    await organizerPage.clickEditRow(6);
    await organizerPage.cancelButton.click();
    await expect(page).not.toHaveURL(/.*\/edit/);
  });

  test('8. Edit Organizer and Cancel', async ({ page }) => {
    const targetName1 = await organizerPage.getRowName(6);
    await organizerPage.clickEditRow(6);
    // 2. Thay đổi tên và Lưu
    const newName = `${targetName1} ${j++}`;
    await organizerPage.nameInput.fill(newName);
    await organizerPage.cancelButton.click();
    await organizerPage.cancelWithDialogEdit('dismiss');
    await expect(page).toHaveURL(/.*\/edit/);
    await expect(organizerPage.nameInput).not.toContainText(newName);
  });

  test('9. Edit Organizer and OK on Cancel dialog', async ({ page }) => {
    const targetName1 = await organizerPage.getRowName(7);
    await organizerPage.clickEditRow(7);
    // 2. Thay đổi tên và Lưu
    const newName = `${targetName1} ${j++}`;
    await organizerPage.nameInput.fill(newName);
    await organizerPage.cancelButton.click();
    await organizerPage.cancelWithDialogEdit('accept');
    await expect(page).not.toHaveURL(/.*\/edit/);
    await expect(organizerPage.table).not.toContainText(newName);
  });

  test('10. Edit Organizer with duplicate Name', async ({ page }) => {
    const row1Index = 2;
    const row2Index = 3;

    const targetName2 = await organizerPage.getRowName(row1Index);
    await organizerPage.clickEditRow(row2Index);
    await organizerPage.nameInput.fill(targetName2);
    await organizerPage.saveButton.click();
    await expect(page.getByText('Duplicate Organizers')).toBeVisible();
  });

  test('11. Fill NameVN (When empty)', async ({ page }) => {
    const rowIndex = 1;
    const organizerId = await organizerPage.getRowId(rowIndex);
    const newValue = 'Tên Tiếng Việt Mới';

    await organizerPage.clickEditRow(rowIndex);
    await organizerPage.tabVi.click();
    if ((await organizerPage.nameVnInput.inputValue()) === '') {
      await organizerPage.nameVnInput.fill(newValue);
      await organizerPage.saveButton.click();
      await page.goto(
        `https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`,
      );
      await organizerPage.tabVi.click();
      await expect(organizerPage.nameVnInput).toHaveValue(newValue);
    } else {
      await organizerPage.nameVnInput.clear();
      await organizerPage.saveButton.click();
      await page.goto(
        `https://nx-seller-client.eventry.phatnt.com/#/organizer/${organizerId}/edit`,
      );
      await organizerPage.tabVi.click();
      await expect(organizerPage.nameVnInput).toHaveValue('');
    }
  });
});
