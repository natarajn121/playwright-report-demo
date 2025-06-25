// File: src/tests/SerialTest.spec.ts

import { test, expect, Page, Browser } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

import { LoginPage } from "../pages/LoginPage";
import ContactPage from "../pages/ContactPage";
import CasePage from "../pages/CasePage";
import logger from "../utils/logger";
import { sleep } from "../utils/sleep";

// Test data
const testdata = {
  contactFName: "John",
  contactLName: "Doe",
  contactPhone: "9964383922",
  caseOrigin: "Email",
  caseType: "Electrical"
};

// Users from .env
const users = [
  {
    name: "Admin",
    username: process.env.USER1_USERNAME!,
    password: process.env.USER1_PASSWORD!
  },
  {
    name: "CEO",
    username: process.env.USER2_USERNAME!,
    password: process.env.USER2_PASSWORD!
  }
];

// ✅ Set serial mode once for the entire file
test.describe.configure({ mode: "serial" });

// ✅ Run tests for each user serially
for (const user of users) {
  test.describe(`${user.name}`, () => {
    let page: Page;
    let browser: Browser;

    test.beforeAll(async ({ browser: playwrightBrowser }) => {
      browser = playwrightBrowser;
      page = await browser.newPage();

      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(user.username, user.password);

    });

    test("Create Contact and Open", async () => {
      const contactPage = new ContactPage(page);
      await contactPage.createNewContact(
        testdata.contactFName,
        testdata.contactLName,
        testdata.contactPhone
      );
      await contactPage.expectContactLabelContainsFirstNameAndLastName(
        testdata.contactFName,
        testdata.contactLName
      );
      await contactPage.findExistingContactByLastName(testdata.contactLName);
    });

    test("Create Case Test", async () => {
      const casePage = new CasePage(page);
      await casePage.createNewCaseFromContactDetailPage(
        testdata.caseOrigin,
        testdata.caseType
      );
    });

    test("Delete Contact", async () => {

      const contactPage = new ContactPage(page);

      await contactPage.findExistingContactByLastName(testdata.contactLName);
      await contactPage.deleteContact();


    });

    test.afterAll(async () => {
      await page.close();
    });
  });
}
