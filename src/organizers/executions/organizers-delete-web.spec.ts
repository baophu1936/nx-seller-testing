import { test, expect } from '@playwright/test';
import { LoginPage } from '../../auth/pages/login.page';
import { OrganizerPage } from '../pages/organizers.page';
import { SignInTestData } from '../../auth/data/sign-in.data';

test.describe('Organizer Management - Delete Actions', () => {
  // test.describe.configure({ mode: 'serial' });
  let organizerPage: OrganizerPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    organizerPage = new OrganizerPage(page);

    await page.goto('https://nx-seller-client.eventry.phatnt.com/#/login');

    await loginPage.login(SignInTestData.validUser.username, SignInTestData.validUser.password);
    await page.getByTestId('sidebar-menu-btn-link-organizer').click();
  });

  test('1. Verify single delete: Row 2, Action 3', async ({ page }) => {
    // 1. Click Delete dòng 2 (index 1)
    const targetName1 = await organizerPage.getRowName(1);
    await organizerPage.clickDeleteRow(1);
    const popupTitle = await page.getByRole('dialog').locator('h2').innerText();
    const match = popupTitle.match(/\d+/);
    const deletedId = match ? match[0] : null;
    // 2. Xác nhận xóa trên Dialog
    await organizerPage.confirmFromDialog();

    // 3. Assertion: Kiểm tra thông báo thành công
    await expect(page.getByText('Element deleted')).toBeVisible();

    await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${deletedId}/edit`);
    const expectedErrorMsg = `Entity not found: Organizer with id ${deletedId}`;
    const errorPopup = page.getByText(expectedErrorMsg);
    await expect(errorPopup).toBeVisible({ timeout: 5000 });

    await expect(organizerPage.nameInput).not.toHaveValue(targetName1);
  });

  test('2. Verify bulk delete: Multiple rows', async ({ page }) => {
    const rowsToSelect = [3, 4];
    const selectedData: { id: string; name: string }[] = [];

    // 1. Thu thập dữ liệu tập trung
    for (const index of rowsToSelect) {
      const id = await organizerPage.getRowId(index);
      const name = await organizerPage.getRowName(index);

      if (id && name) {
        selectedData.push({ id, name });
        await organizerPage.clickCheckboxRow(index);
      }
    }

    // 2. Hành động xóa
    await organizerPage.deleteSelection();

    // 3. Kiểm tra thông báo (Assertion 1)
    const toast = page.getByText(/deleted|success/i).first();
    await expect(toast).toBeVisible();
    await expect(toast).not.toBeVisible(); // Đợi toast ẩn để không bị flakey

    // 4. Kiểm tra hậu kỳ (Assertion 2) sử dụng Promise.all để chạy nhanh hơn (tùy chọn)
    // Hoặc dùng for...of nếu bạn muốn chạy tuần tự để dễ debug
    for (const item of selectedData) {
      await page.goto(`https://nx-seller-client.eventry.phatnt.com/#/organizer/${item.id}/edit`);

      // Kiểm tra thông báo lỗi từ server
      await expect(page.getByText(`Entity not found: Organizer with id ${item.id}`)).toBeVisible({
        timeout: 5000,
      });

      // Kiểm tra input tên phải trống
      await expect(organizerPage.nameInput).toHaveValue('');
    }
  });

  test('3. Verify cancel action: Data must remain', async () => {
    const targetName = await organizerPage.getRowName(1);

    await organizerPage.clickCheckboxRow(1);
    await organizerPage.bulkDeleteActionBtn.click();

    // Sử dụng hàm đã fix lỗi strict mode
    await organizerPage.cancelFromDialog();

    // Đảm bảo data vẫn còn đó, không bị mất sau khi Cancel
    await expect(organizerPage.table).toContainText(targetName);
  });
});
