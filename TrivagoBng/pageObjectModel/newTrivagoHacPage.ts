import { test, Page, Locator } from '@playwright/test';
export class newTrivagoHacPage {
 
  page: Page
 
  constructor(page: Page) 
  {
    this.page = page;
  }

  get dealList():Locator{
    return this.page.getByTestId('additional-prices-slideout-entry-point');
  }

  get allSideOutdeals():Locator{
    return this.page.getByTestId('all-slideout-deals').locator('li');
  }

  get showMoreBtn():Locator{
    return this.page.getByTestId('show-more-deals-button');
  }

  get sorting():Locator{
    return this.page.getByTestId('refinement_row_element');
  }

  get priceSort():Locator{
    return this.page.getByTestId('sorting-index-1');
  }

  get filterApplyBtn():Locator{
    return this.page.getByTestId('filters-popover-apply-button');
  }

 
  async applyPriceFilter() : Promise<void>
  {
    await this.sorting.first().click();
    await this.priceSort.click();
    await this.filterApplyBtn.click();
    await this.page.waitForTimeout(5000)
  }

  async selectBngDealOnTrivagoHAC()
  {   
      // Zoom out page
      await this.page.evaluate(() => {
        document.body.style.zoom = '67%';
      });

      //await this.page.locator("//button[@data-testid='additional-prices-slideout-entry-point']//span[3]").first().waitFor({ timeout: 20000 });

      await this.page.getByTestId('additional-prices-slideout-entry-point').nth(3).waitFor({ timeout: 20000 });
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
          await this.page.getByTestId('all-slideout-deals').nth(i).locator("li").first().waitFor({ timeout: 10000 });
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
            // try  //closing deal iteam section 
            // {
            // this.page.locator("//button[@class='XXm3lZ']").click();
            // } catch {}
          } catch (err) {
            console.log(`⚠️ Error in advertiser ${j}}`);
            continue;
          }
        }
    }
  } 
}
