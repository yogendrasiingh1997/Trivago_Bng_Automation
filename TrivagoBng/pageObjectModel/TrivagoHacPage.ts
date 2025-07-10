import { test, Page, Locator } from '@playwright/test';
export class TrivagoHacPage {
 
  page: Page
  dealList: Locator;
  allSideOutdeals: Locator;
  showMoreBtn: Locator;
  sorting: Locator;
  priceSort: Locator;
  filterApplyBtn: Locator;
  deal: string;
  
  constructor(page: Page) 
  {
    this.page = page;
    this.dealList = page.getByTestId('additional-prices-slideout-entry-point');
    this.allSideOutdeals = page.getByTestId('all-slideout-deals').locator('li');
    this.showMoreBtn = page.getByTestId('show-more-deals-button');
    this.sorting = page.getByTestId('refinement_row_element');
    this.priceSort = page.getByTestId('sorting-index-1');
    this.filterApplyBtn = page.getByTestId('filters-popover-apply-button');
    this.deal='[data-testid="additional-prices-slideout-entry-point"]';
  }

  async priceFilter() : Promise<void>
  {
    await test.step("Apply Price Filter on Trivago HAC Page", async () => {
    await this.sorting.first().click();
    await this.priceSort.click();
    await this.filterApplyBtn.click();
    //await this.page.waitForSelector(this.deal);
    //await this.dealList.first().waitFor({timeout: 10000});
    await this.page.waitForTimeout(5000)
    })
  }

  async BngDealSelect(): Promise<Page | undefined>
  {
    return await test.step("Find BNG Deal on Trivago HAC Page", async () => {
      
      // Zoom out page
      await this.page.evaluate(() => {
        document.body.style.zoom = '67%';
      });

      await this.page.locator("//button[@data-testid='additional-prices-slideout-entry-point']//span[3]").first().waitFor({ timeout: 20000 });

      const dealCount = await this.dealList.count();

      for (let i = 0; i < dealCount; i++) 
      {
        const deal = this.dealList.nth(i);
        try 
        {
          await deal.scrollIntoViewIfNeeded();
          await deal.click(); 
        } catch {
          continue;
        }

        // Wait for advertiser section
        try 
        {
          await this.page.getByTestId('all-slideout-deals').nth(i).locator("li").first().waitFor({ timeout: 8000 });
        } catch {
          continue;
        }

        // Click "Show More" if available
        try 
        {
          if (await this.showMoreBtn.isVisible({ timeout: 2000 })) 
            {
            await this.showMoreBtn.scrollIntoViewIfNeeded();
            await this.showMoreBtn.click();
            }
        } catch {}

        // Find section related to current deal
        const allSections = this.page.getByTestId('all-slideout-deals').nth(i);
        const advertisers = allSections.locator("li");
        const advertiserCount = await advertisers.count();

        for (let j = 0; j < advertiserCount; j++) 
        {
          const dealItem = advertisers.nth(j);
          const bng = dealItem.getByTestId(/^advertiser-details-(3216|227)$/);

          try 
          {
            if (await bng.isVisible({ timeout: 2000 })) 
            {
              const text = await bng.textContent();

              if (text?.includes("trivago Book & Go")) 
              {
                const viewBtn = dealItem.getByTestId('clickOutButton');
                await viewBtn.scrollIntoViewIfNeeded();
                
                //handle window
                const [BaPage] = await Promise.all([
                  this.page.waitForEvent("popup"),
                  viewBtn.click()
                ])

                console.log("✅ BNG Deal is Selected");       
                return BaPage;
              }
            }
          } catch (err) {
            console.log(`⚠️ Error in advertiser ${j}}`);
            continue;
          }
        }
       }
    })  
  } 
}
