import { Page, expect } from "@playwright/test";
import { sleep } from "../utils/sleep";
import logger from "../utils/logger";

export default class CasePage {
  private readonly caseLink = "Cases";
  private readonly newButtonLocator = "New";
  private readonly caseOriginDropdownLocator = "Case Origin";
  private readonly caseProductDropdownLocator = "Product - Current Selection";
  private readonly caseTypeDropdownLocator = "Type";
  private readonly saveButtonLocator = "Save";
  private readonly contactFullNameLabelLocator = "sfa-output-name-with-hierarchy-icon-wrapper";
 

  constructor(private page: Page) {}

  async createNewCaseFromContactDetailPage(caseOrigin: string,caseType:string) {

    //await this.page.pause();

    await this.page.getByLabel(this.caseLink).getByRole("button", { name: this.newButtonLocator }).click();
    await this.page.getByRole('combobox', { name: this.caseOriginDropdownLocator }).click();
    await this.page
      .getByRole("option", { name: caseOrigin })
      .locator("span")
      .nth(1)
      .click();

    await this.page.getByRole('combobox', { name: this.caseTypeDropdownLocator }).click();
    await this.page
      .getByRole("option", { name: caseType })
      .locator("span")
      .nth(1)
      .click();
    await this.page.getByRole("button", { name: this.saveButtonLocator, exact: true }).click();

  }

}
