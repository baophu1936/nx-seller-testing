import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://nx-seller-client.eventry.phatnt.com/#/login',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { outputFolder: 'reports/html' }]],
  retries: 1,
  timeout: 30000,
});
