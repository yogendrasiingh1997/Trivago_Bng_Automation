import {test} from "@playwright/test";
import { trivagoHacPage } from "../pageObjectModel/trivagoHacPage";
import { trivagoHomePage } from "../pageObjectModel/trivagoHomePage";
import { bngHoteldetailsPage} from "../pageObjectModel/hotelDetailsPage";
import { bngCheckoutPage } from "../pageObjectModel/checkoutPage";

test('Sanity', async({page}) =>{

    const homePage= new trivagoHomePage(page)
    const hacPage= new trivagoHacPage(page)

    await test.step("1. Open Trivago website and accept cookies", async () => {
        await homePage.openTrivagoWebsite();
    })

    await test.step("2. Search for Las Vegas as destination", async () => {
        await homePage.searchForDestination();
    })

    await test.step("3. Select check-in and check-out dates and click on search button", async () => {
        await homePage.travelDateSelection()
    })

    await test.step("4. Apply Price Filter on Trivago HAC Page", async () => {
        await hacPage.applyPriceFilterOnTrivagoHAC();
    })

    await test.step("5. Find BNG Deal on Trivago HAC Page", async () => { 
        const newTab = await hacPage.selectBngDealOnTrivagoHAC();

        if (newTab) 
        {
            await test.step("6. Selecting free cancellation deal on BA page of BNG", async () => {
            const bngHotelDetailsPage = new bngHoteldetailsPage(newTab);
            await bngHotelDetailsPage.selectFreeCancellationDeal();
            })

            const bngCheckOutPage = new bngCheckoutPage(newTab)
            await test.step("7. Fill user details on checkout page of BNG", async () => {
                await bngCheckOutPage.fillUserDetails();
            })

            await test.step("8. Fill payment information on checkout page of BNG", async () => {
            await bngCheckOutPage.fillPaymentDetails();
            })
        } 
        else 
        {
            console.log("❌ New BNG tab was not returned.");
        }
    })
})