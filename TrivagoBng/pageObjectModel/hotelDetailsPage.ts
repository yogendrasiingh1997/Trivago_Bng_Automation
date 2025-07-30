import {Page, expect, Locator } from '@playwright/test';
export class bngHoteldetailsPage{
    page: Page;
   
    constructor(page: Page)
    {
        this.page=page;
    }

    get allRooms():Locator{
        return this.page.locator("//div[contains(@class, 'hotel-room__room') and contains(@class, 'css-j7qwjs')]/div")
    }

    get cookieAccept():Locator{
        return this.page.locator("//div[@id='cookiescript_accept']")
    }

    get bngLogo():Locator{
        return this.page.locator("//div[@class='desktop-menu__logo logo MuiBox-root css-82xpu']");
    }
    
    async SelectfreeCancellationDeal()
    {
        await this.page.waitForSelector("//button[normalize-space()='View deal']", { timeout: 100000 })
        await this.page.evaluate(() => {
        document.body.style.zoom = '67%';
        });

        console.log("🏨 HotelName: " + await this.page.title())
        
        const BA_Link= this.page.url();
        console.log("🔗 BA Link: " + BA_Link)

        expect(BA_Link).toContain('book.trivago');
        await expect(this.bngLogo).toBeVisible();

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
    }
}

