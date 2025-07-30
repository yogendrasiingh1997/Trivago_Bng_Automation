import { test, Page, Locator } from '@playwright/test';

export class bngConfirmationPage{
    page: Page;

    constructor(page: Page)
    {
        this.page=page
    }

    get tripNum():Locator{
        return this.page.locator("//span[contains(@class, 'reservation-number__number')]")
    }

    async tripDetails()
    {
        await test.step("Fetch Trip number and confirmation page URL", async () => {
        console.log("Trip Number: " + await this.tripNum.textContent());
        console.log("Confirmation Page link: " + this.page.url())
        })
    }
}