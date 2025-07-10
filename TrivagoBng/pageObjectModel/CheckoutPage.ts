import { test, Page, Locator, FrameLocator } from '@playwright/test';
import{randomString} from "../TestUtils/testutils"

export class CheckoutPage
 {
    page: Page

    //Guest Details
    fname: Locator;
    lname: Locator;
    email: Locator;
    phone: Locator;
    specialRequest: Locator;

    // Payment Details
    cardFrame: FrameLocator;
    cardSelector: string;
    expiry: Locator;
    cvvFrame: FrameLocator;
    cvvSelector: string;

    //Other Details
    zip: Locator;
    state: Locator;
    stateName: Locator;
    privacyCheckbox: Locator;
    bookButton: Locator;

    constructor(page: Page)
    {
        this.page=page;

        //Guest Info
        this.fname= page.locator("//input[@name='guestDetails.firstName']");
        this.lname= page.locator("//input[@name='guestDetails.lastName']");
        this.email= page.locator("//input[@name='guestDetails.email']");
        this.phone= page.locator("//input[@name='guestDetails.phone']");
        this.specialRequest= page.locator("//textarea[@name='guestDetails.specialRequest']");

        //Card Info
        this.cardFrame= page.frameLocator("//iframe[contains(@id,'cardNumber')]");
        this.cardSelector= "//input[@id='field']";
        this.expiry= page.locator("//div[contains(@class, 'pci-proxy-form__expiration-date')]//input[@type='text']");
        this.cvvFrame= page.frameLocator("//iframe[contains(@id,'cvv')]");
        this.cvvSelector= "//input[@id='field']";

        //Address Info
        this.zip= page.locator("//input[@name='guestDetails.zipCode']");
        this.state= page.locator("//div[@role='combobox']");
        this.stateName= page.locator("//li[normalize-space()='Maine']");

        //Other 
        this.privacyCheckbox= page.locator("//input[@name='agreeAndBook.promotions']");
        this.bookButton= page.locator("//button[contains(text(), 'Book for')]");

    }


    async fillUserDetails(): Promise<void> 
    {
        await test.step("Wait for checkout page to load", async () => {
        await this.page.waitForLoadState('domcontentloaded');
        });

        await test.step("Fill guest details", async () => {
        await this.fname.fill("Yogendra" + randomString(3));
        await this.lname.fill("Singh");
        await this.email.fill("yogendra@holisto.com");
        await this.phone.fill("2154567890");
        await this.specialRequest.fill("Automation");
        });
    }

    async fillPaymentDetails(): Promise<void> 
    {
        await test.step("Fill payment information", async () => {
        await this.cardFrame.locator(this.cardSelector).fill("5555555555554444");
        await this.expiry.pressSequentially("1230", { delay: 100 });
        await this.cvvFrame.locator(this.cvvSelector).fill("123");
        await this.zip.pressSequentially("12345", { delay: 100 });
        await this.state.nth(1).click();
        await this.stateName.click();
        await this.privacyCheckbox.click();
        await this.bookButton.click();
        });
    }

}

