import { test, Page } from '@playwright/test';


export class ConfirmationPage{
    page: Page;
    tripNum: any;

    constructor(page: Page)
    {
        this.page=page
        this.tripNum=page.locator("//span[contains(@class, 'reservation-number__number')]")
    }

    async tripDetails(): Promise<void>
    {
        await test.step("Fetch Trip number and confirmation page URL", async () => {
        console.log("Trip Number: " + await this.tripNum.textContent());
        console.log("Confirmation Page link: " + this.page.url())
        })
    }

}