import { Page, Locator, expect } from '@playwright/test';

export default class OrganizersPage {
  readonly page: Page;
  readonly organizersMenu: Locator;
  readonly checkboxAll: Locator;
  readonly rowCheckboxes: Locator;
  readonly nameHeader: Locator;
  readonly ascOption: Locator;
  readonly descOption: Locator;
  readonly addButton: Locator;
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly deletePopup: Locator;
  readonly cancelDeleteBtn: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly selectedText: Locator;
  readonly rowsPerPage: Locator;
  readonly paginationText: Locator;
  readonly firstPageBtn: Locator;
  readonly prevPageBtn: Locator;
  readonly nextPageBtn: Locator;
  readonly lastPageBtn: Locator;
  readonly addButtonMer: Locator;
  readonly breadcrumbOrganizer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.organizersMenu = page.getByTestId('sidebar-menu-btn-link-organizer');
    this.breadcrumbOrganizer = page.locator('[data-slot="breadcrumb-page"]', { hasText: 'Organizer' });

    // Table & Checkboxes
    this.checkboxAll = page.getByTestId('checkbox-all');
    // Lấy tất cả checkbox trừ cái "all"
    this.rowCheckboxes = page.locator('[data-testid^="checkbox-"]').filter({ hasNot: this.checkboxAll });

    // Sort Options
    this.nameHeader = page.locator('div[role="button"]').filter({ hasText: 'Name' }).first();
    this.ascOption = page.locator('[data-testid*="sort-asc-btn"]');
    this.descOption = page.locator('[data-testid*="sort-desc-btn"]');

    // Actions
    this.addButton = page.getByRole('button', { name: 'Create', exact: true });
   this.editButtons = page.getByRole('button', { name: 'Edit' });
this.deleteButtons = page.getByRole('button', { name: 'Delete' });

    this.addButtonMer = page.locator('[data-testid*="table-create-merchants-btn-4"]') // ID
    // Modals
    this.deletePopup = page.getByRole('dialog');
    this.cancelDeleteBtn = page.getByRole('button', { name: 'Cancel' });
    this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });

    // Footer & Pagination
    this.selectedText = page.getByText(/row\(s\) selected/);
    this.rowsPerPage = page.getByRole('button', { name: '100' });
    this.paginationText = page.getByText(/Page \d+ of \d+/);
    this.firstPageBtn = page.getByRole('button', { name: '<<' });
    this.prevPageBtn = page.getByRole('button', { name: '<' });
    this.nextPageBtn = page.getByRole('button', { name: '>' });
    this.lastPageBtn = page.getByRole('button', { name: '>>' });
  }

  async goto() {
    await this.organizersMenu.click();
    await expect(this.page).toHaveURL(/#\/organizer/);
    await expect(this.nameHeader).toBeVisible({ timeout: 15000 });
  }

  async toggleCheckbox(checkbox: Locator) {
    await checkbox.click();
  }

  async expectCheckboxChecked(checkbox: Locator) {
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  }

  async expectCheckboxUnchecked(checkbox: Locator) {
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  }

  async sortByName() {
    await this.nameHeader.click();
    await this.ascOption.waitFor({ state: 'visible' });
    await this.ascOption.click();
  }

  async sortByName2() {
    await this.nameHeader.click();
    await this.descOption.waitFor({ state: 'visible' });
    await this.descOption.click();
  }
}