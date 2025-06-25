import { Page, expect } from "@playwright/test";
import { sleep } from "../utils/sleep";
import logger from "../utils/logger";

export default class ContactPage {
  private readonly contactsLink = "Contacts";
  private readonly newButtonLocator = "New";
  private readonly firstNameTextFieldLocator = "First Name";
  private readonly lastNameTextFieldLocator = "Last Name";
  private readonly phoneNumberLocator = "Phone";
  private readonly saveButtonLocator = "Save";
  private readonly searchBoxLocator = "Search this list...";
  private readonly contactFullNameLabelLocator = "//lightning-formatted-name[@slot='primaryField']";
  private readonly contactDisplayNameLocator = "#brandBand_2";
  private readonly deleteButtonLocator = "Delete";
 

  constructor(private page: Page) {}

  async createNewContact(fname: string, lname:string, phone:string) {
    await this.page.goto("https://publicissapient57-dev-ed.lightning.force.com/lightning/page/home",{ waitUntil: "domcontentloaded" });
    await this.page.getByRole('link', { name: this.contactsLink }).click();
    await this.page.getByRole('button', { name: this.newButtonLocator }).click();
    logger.info("New button is clicked");

    await this.page.getByPlaceholder(this.firstNameTextFieldLocator).click();
    await this.page.getByPlaceholder(this.firstNameTextFieldLocator).fill(fname);
    logger.info(`First name is filled as ${fname}`)
   
    await this.page.getByPlaceholder(this.firstNameTextFieldLocator).press('Tab');
    await this.page.getByPlaceholder(this.lastNameTextFieldLocator).fill(lname);
    logger.info(`Last name is filled as ${lname}`)

    await this.page.getByRole('textbox', { name: 'Phone', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Phone', exact: true }).fill(phone);
    logger.info(`Phone number filled as ${phone}`);

    await this.page.getByRole('button', { name: this.saveButtonLocator, exact: true }).click().catch((error) => {
      logger.error(`Error clicking Save button: ${error}`);
      throw error; // rethrow the error if needed
    }).then(()=>logger.info("Save Button is clicked"));
    
    
}

async expectContactLabelContainsFirstNameAndLastName(fname: string, lname:string) {
  await expect(this.page.locator(this.contactFullNameLabelLocator)).toContainText(`${fname} ${lname}` );
  logger.info(`New contact created and ${fname} ${lname} is visible`);
  await this.page.getByRole('link', { name: this.contactsLink }).click();
}

async findExistingContactByLastName(lname:string) {

  await this.page.getByRole("link", { name: this.contactsLink }).click();
  await this.page.getByPlaceholder(this.searchBoxLocator).click();
  await this.page.getByPlaceholder(this.searchBoxLocator).fill(lname);
  await this.page.getByPlaceholder(this.searchBoxLocator).press("Enter");

  await this.page.getByRole("link", { name: new RegExp(lname, "i") }).nth(0).click();

}

async deleteContact(){
  await this.page.getByRole('button', { name: 'Show more actions' }).click();
  await this.page.getByRole('menuitem',{ name: 'Delete'}).click();
  await this.page.getByRole('button', { name: 'Delete'}).click();

  console.log("⏳ Waiting...");
  await sleep(3000); // This will pause for 3 seconds
  console.log("✅ Done waiting!");
}


}
