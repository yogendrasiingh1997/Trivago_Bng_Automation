import {test, Page, Locator } from '@playwright/test';


export class TrivagoHomePage{
    page: Page;
    cookie: Locator;
    searchBox: Locator;
    list: Locator;
    allDates: Locator;
    currentMonth: Locator;
    nextMonth: Locator;
    searchBtn: Locator;

    constructor(page: Page)
    {
        
        this.page=page;
        this.cookie= page.getByTestId('uc-accept-all-button')
        this.searchBox= page.getByTestId('search-form-destination')
        this.list=page.getByTestId('ssg-element')
        
        this.nextMonth=page.getByTestId('calendar-button-next')
        this.searchBtn=page.getByTestId('search-button-with-loader')
        this.allDates=page.locator("//div[@class='uxgGry']//button")
        this.currentMonth=page.locator("//div[@class='uxgGry']/h3")
    }

    async Trivago(): Promise<void>
    {
        await test.step("Open Trivago website and accept cookies", async () => {
        await this.page.goto("https://www.trivago.com/?sCTestIdList=71307")
        await this.page.waitForLoadState('load'); // wait until fully loaded
        await this.cookie.click();
        })

    }

    async Destination(): Promise<void>
    {
        await test.step("Select Las Vegas as destination", async () => {
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
        })
    }

    async dateSelection(monthYear: string, checkIn: string, checkOut: string): Promise<void>
    {
        await test.step("Select check-in and check-out dates", async () => {
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

        })

        await test.step('Click on Search button', async () => {
        await this.searchBtn.click();
        })
    }

}
