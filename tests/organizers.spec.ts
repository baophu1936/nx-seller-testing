import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import OrganizersPage from '../pages/OrganizersPage';
import users from '../fixtures/users.json';

test.describe('Organizers Page Tests', () => {
  let organizersPage: OrganizersPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);

    organizersPage = new OrganizersPage(page);
    await organizersPage.goto(); // Đã bao gồm logic đợi trang load xong
  });

  // --- TEST CASE 1: NAVIGATION ---
  test('Navigate to Organizers from sidebar', async () => {
    // beforeEach đã làm bước này, đây là bước verify bổ sung
    await expect(organizersPage.breadcrumbOrganizer).toHaveText('Organizer');
  });

  // --- TEST CASE 2: SORTING (Đã fix lỗi toPass và callable) ---
  test('Sort by Name column', async ({ page }) => {
    // Thực hiện sort A-Z
    await organizersPage.sortByName(); 
    
    // Đợi UI cập nhật sau khi sort
    await expect(async () => {
      await expect(organizersPage.rowCheckboxes.first()).toBeVisible();
    }).toPass();

    // Thực hiện sort Z-A
    await organizersPage.sortByName2(); 
  });

  // --- TEST CASE 3: CHECKBOX ALL ---
  test('Checkbox ALL: check & uncheck', async () => {
    // Check all
    await organizersPage.toggleCheckbox(organizersPage.checkboxAll);
    await organizersPage.expectCheckboxChecked(organizersPage.checkboxAll);
    await organizersPage.expectCheckboxChecked(organizersPage.rowCheckboxes.first());

    // Uncheck all
    await organizersPage.toggleCheckbox(organizersPage.checkboxAll);
    await organizersPage.expectCheckboxUnchecked(organizersPage.checkboxAll);
    await organizersPage.expectCheckboxUnchecked(organizersPage.rowCheckboxes.first());
  });

  // --- TEST CASE 4: CHECKBOX SINGLE ROW ---
  test('Checkbox single row: check & uncheck', async () => {
    const firstRowCheckbox = organizersPage.rowCheckboxes.first();

    await organizersPage.toggleCheckbox(firstRowCheckbox);
    await organizersPage.expectCheckboxChecked(firstRowCheckbox);

    await organizersPage.toggleCheckbox(firstRowCheckbox);
    await organizersPage.expectCheckboxUnchecked(firstRowCheckbox);
  });

  // --- TEST CASE 5: ADD ---
  test('Add organizer → navigate to create merchants', async () => {
    await organizersPage.addButton.first().click();
    await expect(organizersPage.page).toHaveURL(/\/organizer\/create/);
    await expect(organizersPage.page.getByRole('heading', { name: 'Create Organizer' })).toBeVisible();
  });

  // --- TEST CASE 6: EDIT ---
  test('Edit organizer → navigate to edit page', async () => {
    await organizersPage.editButtons.first().click();
    await expect(organizersPage.page).toHaveURL(/\/organizer\/\d+\/edit/);
     await expect(organizersPage.page.getByRole('heading', { name: 'Edit Organizer' })).toBeVisible();
  });

test('Create merchants → navigate to merchants page', async () => {
  await organizersPage.addButtonMer.first().click();
  
  await expect(organizersPage.page).toHaveURL(/\/organizer\/\d+\/create-merchant/);

  // Fix: Specify the level to resolve the strict mode violation
  const heading = organizersPage.page.getByRole('heading', { 
    name: 'Create Merchants', 
    level: 2 
  });
  
  await expect(heading).toBeVisible();
});

  // --- TEST CASE 7: DELETE (CANCEL) ---
  test('Delete organizer → cancel', async () => {
    await organizersPage.deleteButtons.first().click();
    await expect(organizersPage.deletePopup).toBeVisible();

    await organizersPage.cancelDeleteBtn.click();
    await expect(organizersPage.deletePopup).not.toBeVisible();
  });

  // --- TEST CASE 8: DELETE (CONFIRM) ---
  test('Delete organizer → confirm delete', async () => {
    await organizersPage.deleteButtons.first().click();
    await organizersPage.confirmDeleteBtn.click();

    // Verify quay lại trang danh sách hoặc URL ko còn popup
    await expect(organizersPage.page).toHaveURL(/#\/organizer/);
  });

  // --- TEST CASE 9: FOOTER & PAGINATION ---
  test('Footer: selected rows & pagination controls', async () => {
const checkboxAll = organizersPage.page.getByTestId('checkbox-all');

  if (await checkboxAll.getAttribute('data-state') === 'checked') {
    await checkboxAll.click();
  }

  await checkboxAll.click();
  
  await expect(checkboxAll).toHaveAttribute('aria-checked', 'true');
  
  await expect(organizersPage.selectedText).toContainText('2 of');

  await organizersPage.rowsPerPage.click(); 
  await organizersPage.page.getByRole('option', { name: '100' }).click();

  await expect(organizersPage.paginationText).toBeVisible();
  await expect(organizersPage.nextPageBtn).toBeDisabled();
  await expect(organizersPage.prevPageBtn).toBeDisabled();
  });
});