import {test, Page, Locator } from '@playwright/test';


export class newTrivagoHomePage{
    page: Page;
    
    constructor(page: Page)
    {
        this.page=page;
    }

    get acceptcookies():Locator{
        return this.page.getByTestId('uc-accept-all-button')
    }

    get searchBox():Locator{
        return this.page.getByTestId('search-form-destination')
    }

    get list():Locator{
        return this.page.getByTestId('ssg-element')
    }

    get nextMonth():Locator{
        return this.page.getByTestId('calendar-button-next')
    }

    get searchBtn():Locator{
        return this.page.getByTestId('search-button-with-loader')
    }

    get allDates():Locator{
        return this.page.locator("//div[@class='uxgGry']//button")
    }

    get currentMonth():Locator{
        return this.page.locator("//div[@class='uxgGry']/h3")
    }

    
    async Trivago()
    {
        await this.page.goto("https://www.trivago.com/?sCTestIdList=71307")
        await this.page.waitForLoadState('load'); // wait until fully loaded
        await this.acceptcookies.click();
    }

    async Destination()
    {
        await this.searchBox.fill("Las")

        await this.list.first().waitFor({ timeout: 10000 });

        const locationList= this.list;
        const count = await locationList.count(); 

        for(let i=0; i<count;i++)
        {
            const suggestions = locationList.nth(i);
            const titleElement= suggestions.getByTestId('suggestion-title')
            const subtitleElement= suggestions.getByTestId('suggestion-subtitle')

            const title= (await titleElement.textContent())?.replace(/\s+/g, ' ').trim();
            const subTitle= await subtitleElement.textContent();

            if(title?.toLowerCase()==="las vegas" && subTitle?.includes("Nevada"))
            {
                await suggestions.click();
                console.log(`Selected: ${title} - ${subTitle}`);
                break;
            }
        }
    }

    async dateSelection(monthYear: string, checkIn: string, checkOut: string)
    {
        //Month Year selection

        await this.page.evaluate(() => {
        const scrollContainer = document.querySelector('.scrollable-container'); // adjust selector
        if (scrollContainer && scrollContainer.scrollTop > 0) 
            {
                scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
            }
        });

        while (true)
        {
            const currentMonthYear= await this.currentMonth.nth(0).textContent()
            if(currentMonthYear ===monthYear)
            break;
            await this.nextMonth.click();
        }

        //CheckIn date

        const dates= this.allDates
        const count = await dates.count();
        
        for (let i = 0; i < count; i++) 
        {
            const dateBtn = dates.nth(i);
            const datetext = await dateBtn.textContent();

            if (datetext?.trim() === checkIn) 
                {
                    console.log("✅ Check-in Date: " + datetext + " " + monthYear);
                    await dateBtn.click(); 
                    break;
                }
        }

        //Checkout date
        
        for (let j = 0; j < count; j++) 
        {
            const dateBtn = dates.nth(j);
            const datetext = await dateBtn.textContent();

            if (datetext?.trim() === checkOut) 
            {
                console.log("✅ Check-out Date: " + datetext + " " + monthYear);
                await dateBtn.click(); // ✅ using Locator, safe click
                break;
            }
        }

        await this.searchBtn.click();
    }

}
