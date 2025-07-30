import{test} from "@playwright/test";
import { newHotelDetailsPage } from "../pageObjectModel/newHotelDetailsPage";
import { newTrivagoHomePage } from "../pageObjectModel/newTrivagoHomePage";
import { newCheckoutPage } from "../pageObjectModel/newCheckoutPage";
import { newTrivagoHacPage } from "../pageObjectModel/newTrivagoHacPage";



test('Sanity', async({page}) =>{

    const hp= new newTrivagoHomePage(page)
    const hac= new newTrivagoHacPage(page)

    await test.step("1. Open Trivago website and accept cookies", async () => {
        await hp.Trivago();
    })

    await test.step("2. Search for Las Vegas as destination", async () => {
        await hp.Destination();
    })

    await test.step("3. Select check-in and check-out dates and click on search button", async () => {
        await hp.dateSelection('January 2026', '20', '21')
    })

    await test.step("4. Apply Price Filter on Trivago HAC Page", async () => {
        await hac.applyPriceFilter();
    })

    await test.step("5. Find BNG Deal on Trivago HAC Page", async () => { 
        const newTab = await hac.selectBngDealOnTrivagoHAC();

        if (newTab) 
        {
            await test.step("6. Selecting free cancellation deal on BA page of BNG", async () => {
            const hotelPage = new newHotelDetailsPage(newTab);
            await hotelPage.SelectfreeCancellationDeal(); // actions in new tab
            })

            const checkOutPage = new newCheckoutPage(newTab)
            await test.step("7. Fill user details on checkout page of BNG", async () => {
                await checkOutPage.fillUserDetails();
            })

            await test.step("8. Fill payment information on checkout page of BNG", async () => {
            await checkOutPage.fillPaymentDetails();
            })
        } 
        else 
        {
            console.log("❌ New BNG tab was not returned.");
        }
    })
})