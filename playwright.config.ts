import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  use: {
    headless: true,
    baseURL: 'https://login.salesforce.com',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure' // optional but useful for Allure
  },
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
});
