import { test, Page, expect, Locator } from '@playwright/test';
export class HotelDetailsPage{
    page: any;
    allRooms: Locator;
    cookieAccept: Locator;
    bngLogo: Locator;
   
    constructor(page: Page)
    {
        this.page=page;
        this.allRooms= page.locator("//div[contains(@class, 'MuiStack-root') and contains(@class, 'hotel-room__room') and contains(@class, 'css-j7qwjs')]/div")
        this.cookieAccept=page.locator("//div[@id='cookiescript_accept']")
        this.bngLogo= page.locator("//div[@class='desktop-menu__logo logo MuiBox-root css-82xpu']");
    }

    async freeCancellationDeal(): Promise<void>
    {
        await test.step("Selecting free cancellation deal on BA page", async () => {
            await this.page.waitForSelector("//p[@class='MuiTypography-root MuiTypography-body1 hotel-summary__hotel-name hotel-summary__hotel-name--medium css-e8rgzq']", { timeout: 100000 });

            await this.page.evaluate(() => {
            document.body.style.zoom = '67%';
            });

            console.log("🏨 HotelName: " + await this.page.title())
            
            const BA_Link= await this.page.url();
            console.log("🔗 BA Link: " + BA_Link)

            expect(BA_Link).toContain('book.trivago');
            await expect(this.bngLogo).toBeVisible();

            await this.page.waitForSelector("//button[contains(text(), 'Book Now')]", {timeout:100000})

            const deals = this.allRooms; 
            const dealCount = await deals.count(); 

            for(let i=0; i<dealCount; i++)
            {
                const deal= deals.nth(i)
                const text= await deal.textContent();

                if(text?.includes("Free cancellation"))
                {
                    const bookBtn= deal.locator("xpath=.//button[contains(text(), 'Book Now')]")
                    await bookBtn.click()
                    console.log("✅ Free cancellation deal selected.")
                    break;
                }
                else
                {
                    console.log("❌ No free cancellation deal found.")
                }
            }
        })
    }
    
}

