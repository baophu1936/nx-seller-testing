import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src', // Thay đổi nếu bạn để file test trong folder tests thay vì src
  outputDir: './test-results/',
  timeout: 50000, // Mỗi test case có tối đa 30 giây để chạy
  fullyParallel: true, // Chạy các test song song để tiết kiệm thời gian

  reporter: [
    ['html'], // Xuất báo cáo dạng web để dễ xem lỗi
    ['list'], // Hiển thị danh sách test đang chạy dưới terminal
  ],

  use: {
    /* Thay vì channel: 'chrome', hãy dùng project default */
    /* hoặc xóa dòng channel: 'chrome' để dùng Chromium */
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 1000,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Đây là bản Chromium mô phỏng Chrome
    },
  ],
  // Bạn có thể mở thêm Firefox hoặc Safari nếu cần
  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },
  //],
});
