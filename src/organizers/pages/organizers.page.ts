import { Page, Locator, expect } from '@playwright/test';

export class OrganizerPage {
  readonly page: Page;
  readonly table: Locator;
  readonly nameInput: Locator;
  readonly nameVnInput: Locator;
  readonly slugInput: Locator;
  readonly slug: Locator;
  readonly statusDropdown: Locator;
  readonly saveButton: Locator;
  readonly createBtn: Locator;
  readonly bulkDeleteActionBtn: Locator;
  readonly cancelButton: Locator;
  readonly organizersUrl: string;
  readonly tabVi: Locator;
  readonly tabEn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('table');
    // Nút Delete tổng khi chọn > 1 cái
    this.bulkDeleteActionBtn = page.getByTestId('bulk-delete-action-btn');
    this.nameInput = page.locator('input[name="name.en"]');
    this.nameVnInput = page.locator('input[name="name.vi"]');
    this.slug = page.getByTestId('slug-input-toggle');
    this.slugInput = page.locator('input[name="slug"]');
    this.statusDropdown = page.getByTestId('form_status');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.createBtn = page.getByTestId('table-create-btn').first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.organizersUrl = 'https://nx-seller-client.eventry.phatnt.com/#/organizer';
    this.tabVi = page.getByTestId('tab-btn-vi');
    this.tabEn = page.getByTestId('tab-btn-en');
  }

  /**
   * @description Click nút xóa tại một dòng cụ thể
   * Cột 4 (index 3), Nút thứ 3 (nút Delete)
   */
  async clickDeleteRow(rowIndex: number = 1) {
    const row = this.table.locator('tr').nth(rowIndex);
    // Tìm button có aria-label="Delete" trong dòng đó
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  // Trong class OrganizerPage
  async getRowId(rowIndex: number): Promise<string | null> {
    const row = this.page.locator('table tr').nth(rowIndex);
    const editBtn = row.locator('button[data-testid^="table-edit-btn-"]');
    const testId = await editBtn.getAttribute('data-testid');
    return testId ? testId.match(/\d+/)?.[0] || null : null;
  }

  async deleteSelection() {
    await this.page.getByTestId('bulk-delete-action-btn').click();
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Delete', exact: true })
      .click();
  }

  /**
   * @description Click vào checkbox
   */
  async clickCheckboxRow(rowIndex: number = 1) {
    const row = this.table.locator('tr').nth(rowIndex);
    // Vì element là <button role="checkbox">, ta dùng click()
    await row.getByRole('checkbox', { name: 'Select Row' }).click();
  }

  /**
   * @description Xác nhận xóa trên Popup
   */
  async confirmFromDialog() {
    const confirmBtn = this.page
      .getByRole('button', { name: 'Delete' })
      .filter({ hasNotText: 'Cancel' });
    await confirmBtn.click();
  }

  async cancelFromDialog() {
    await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
  }

  /**
   * Lấy text của một dòng bất kỳ để dùng làm biến verify.
   * Tránh việc test case bị chết khi data thay đổi.
   */
  async getRowName(rowIndex: number = 0): Promise<string> {
    // .nth(rowIndex) giúp lấy dòng động, không phụ thuộc vào data cố định
    const name = await this.table.locator('tr').nth(rowIndex).locator('td').nth(1).innerText();
    return name.trim();
  }

  async getRowSlug(rowIndex: number = 0): Promise<string> {
    // .nth(rowIndex) giúp lấy dòng động, không phụ thuộc vào data cố định
    const name = await this.table.locator('tr').nth(rowIndex).locator('td').nth(2).innerText();
    return name.trim();
  }

  // Điều hướng đến trang tạo Organizer
  async goToCreate() {
    await this.createBtn.click();

    // 3. Đợi URL thay đổi hoàn tất
    await expect(this.page).toHaveURL(/.*\/create/, { timeout: 5000 });
  }

  async createOrganizer(name: string, status: 'Activated' | 'Deactivated' | 'Draft' | 'Archive') {
    await this.nameInput.fill(name);
    await this.page.keyboard.press('Tab');

    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();

    await this.saveButton.click();
  }

  async createBasic(name: string) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async createSlug(name: string, slug: string) {
    await this.nameInput.fill(name);
    await this.slug.click();
    await this.slugInput.fill(slug);
    await this.saveButton.click();
  }

  async createVnName(name: string, vnName: string) {
    await this.nameInput.fill(name);
    await this.tabVi.click();
    await this.nameVnInput.fill(vnName);
    await this.saveButton.click();
  }

  async gotToTabEN() {
    await this.tabEn.click();
  }

  async goToTabVI() {
    await this.tabVi.click();
  }

  async selectStatus(status: 'Activated' | 'Deactivated' | 'Draft' | 'Archive') {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
  }

  async cancelWithDialogCreate(action: 'accept' | 'dismiss' = 'dismiss') {
    const [dialog] = await Promise.all([
      this.page.waitForEvent('dialog'), // Đợi dialog xuất hiện
      this.cancelButton.click(), // Kích hoạt dialog
    ]);

    console.log(`Dialog message: ${dialog.message()}`);

    if (action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  }

  // Thêm vào class OrganizerPage
  async updateName(newName: string) {
    // Clear field cũ và điền field mới
    await this.nameInput.fill(newName);
    // Click Save
    await this.saveButton.click();
  }

  // Trong class OrganizerPage
  async editOrganizer(
    newName: string,
    newStatus: 'Activated' | 'Deactivated' | 'Draft' | 'Archive',
  ) {
    await this.nameInput.fill(newName);
    await this.selectStatus(newStatus);
    await this.saveButton.click();
  }
  // Trong class OrganizerPage
  async getEditButtonId(rowIndex: number): Promise<string | null> {
    const row = this.page.locator('table tr').nth(rowIndex);
    const editBtn = row.locator('button[data-testid^="table-edit-btn-"]');
    const testId = await editBtn.getAttribute('data-testid');
    return testId ? testId.match(/\d+/)?.[0] || null : null;
  }

  async getRowEdit(rowIndex: number = 0): Promise<string> {
    // .nth(rowIndex) giúp lấy dòng động, không phụ thuộc vào data cố định
    const name = await this.table.locator('tr').nth(rowIndex).locator('td').nth(1).innerText();
    return name.trim();
  }

  // Fill name in edit form
  async fillNameInEditForm(newName: string) {
    await this.nameInput.fill(newName);
  }

  // Update Status
  async updateStatus(newStatus: 'Activated' | 'Deactivated' | 'Draft' | 'Archive') {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: newStatus }).click();
    await this.saveButton.click();
  }
  // Kết hợp update Name và Status
  async updateNameAndStatus(
    newName: string,
    newStatus: 'Activated' | 'Deactivated' | 'Draft' | 'Archive',
  ) {
    await this.nameInput.fill(newName);
    await this.saveButton.click();
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: newStatus }).click();
    await this.saveButton.click();
  }
  // Cancel edit
  async cancelEdit(newName: string) {
    await this.nameInput.fill(newName);
    await this.cancelButton.click();
  }
  // Submit without changes
  async submitWithoutChanges() {
    await this.saveButton.click();
  }
  // Navigate to organizers page
  async goToOrganizersPage() {
    await this.page.goto(this.organizersUrl as string);
  }
  async clickEditRow(rowIndex: number = 3) {
    const row = this.table.locator('tr').nth(rowIndex);
    await row.getByRole('button', { name: 'Edit' }).click();
  }
  // Navigate to edit page of specific organizer by row index
  async goToEditPageByRowIndex(rowIndex: number = 0) {
    const row = this.table.locator('tr').nth(rowIndex);
    await row.getByRole('button', { name: 'Edit' }).click();
    await expect(this.page).toHaveURL(/.*\/edit/);
  }

  async cancelWithDialogEdit(action: 'accept' | 'dismiss' = 'dismiss') {
    // 1. Setup the listener
    const dialogPromise = this.page.waitForEvent('dialog');

    // 2. Trigger the action
    await this.cancelButton.click();

    // 3. Resolve the dialog
    const dialog = await dialogPromise;
    if (action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  }
}
