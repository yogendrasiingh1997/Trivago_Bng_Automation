import { Page, Locator, FrameLocator } from '@playwright/test';
import { BookingDetails } from '../Data/bookingDetails';

export class newCheckoutPage {
    
    page: Page;

    constructor (page: Page)
    {
        this.page=page;
    }

    //Guest Info
    get firstName(): Locator {
    return this.page.locator("//input[@name='guestDetails.firstName']")
    }

    get lastName(): Locator{
        return this.page.locator("//input[@name='guestDetails.lastName']");
    }

    get email(): Locator{
        return this.page.locator("//input[@name='guestDetails.email']");
    }

    get phone(): Locator{
        return this.page.locator("//input[@name='guestDetails.phone']");
    }

    get specialRequest(): Locator{
        return this.page.locator("//textarea[@name='guestDetails.specialRequest']");
    }

    //Card Info
    get cardnumberFrame(): FrameLocator{
        const locator=this.page.frameLocator("//iframe[contains(@id,'cardNumber')]");
        const frameLocator=locator;
        return frameLocator;
    }

    get cardNumber(): Locator {
        return this.cardnumberFrame.locator("//input[@id='field']");
    }

    get expirationDate(): Locator{
        return this.page.locator("//div[contains(@class, 'pci-proxy-form__expiration-date')]//input[@type='text']")
    }

    get cvvFrame(): FrameLocator{
        const locator= this.page.frameLocator("//iframe[contains(@id,'cvv')]");
        const frameLocator= locator;
        return frameLocator;
    }

    get securityCode():Locator{
        return this.cvvFrame.locator("//input[@id='field']");
    }

    //Address Info
    get zipCode(): Locator{
        return this.page.locator("//input[@name='guestDetails.zipCode']")
    }

    get stateField():Locator{
        return this.page.locator("//div[@role='combobox']")
    }

    get stateSelection(): Locator{
        return this.page.locator("//li[normalize-space()='Maine']")
    }

    //Other 
    get privacyCheckbox():Locator{
        return this.page.locator("//input[@name='agreeAndBook.promotions']");
    }

    get bookButton():Locator{
        return this.page.locator("//div[contains(text(), 'Book for')]");
    }

    async fillUserDetails()
    {
        await this.firstName.fill(BookingDetails.firstName);
        await this.lastName.fill(BookingDetails.lastName);
        await this.email.fill(BookingDetails.email);
        await this.phone.fill(BookingDetails.phone);
        await this.specialRequest.fill(BookingDetails.request);
    }

    async fillPaymentDetails()
    {
        await this.cardNumber.fill(BookingDetails.cardNumber);
        await this.expirationDate.pressSequentially(BookingDetails.expirationDate, { delay: 100 });
        await this.securityCode.fill(BookingDetails.securityCode);
        await this.zipCode.pressSequentially(BookingDetails.zipCode, { delay: 100 });
        await this.stateField.nth(1).click();
        await this.stateSelection.click();
        await this.privacyCheckbox.click();
        await this.bookButton.click();
    }
}