import { Page } from '@playwright/test';
import logger from "../utils/logger";

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#Login');
    await this.page.goto("https://publicissapient57-dev-ed.lightning.force.com/lightning/page/home");
  }
}
