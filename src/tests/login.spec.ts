import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ENV } from '../utils/env';
import logger from "../utils/logger";
import { sleep } from '../utils/sleep';

test.skip('Salesforce Login Test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(ENV.username, ENV.password);

  await sleep(5000);

  await expect(page).toHaveURL(/home|lightning/);
});
