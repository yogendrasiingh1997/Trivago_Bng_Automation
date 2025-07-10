import{test} from "@playwright/test";
import { HotelDetailsPage } from "../pageObjectModel/HotelDetailsPage";
import { TrivagoHacPage } from "../pageObjectModel/TrivagoHacPage";
import { TrivagoHomePage } from "../pageObjectModel/TrivagoHomePage";
import { CheckoutPage } from "../pageObjectModel/CheckoutPage";



test('Sanity', async({page}) =>{

    const hp= new TrivagoHomePage(page)
    const hac= new TrivagoHacPage(page)
    

    await hp.Trivago();
    await hp.Destination();
    await hp.dateSelection('January 2026', '20', '21')

    await hac.priceFilter();

     const newTab = await hac.BngDealSelect();
    if (newTab) 
    {
        const hotelPage = new HotelDetailsPage(newTab);
        await hotelPage.freeCancellationDeal(); // actions in new tab


        const checkOutPage = new CheckoutPage(newTab)
        await checkOutPage.fillUserDetails();
        await checkOutPage.fillPaymentDetails();
    } 
    else 
    {
        console.log("❌ New BNG tab was not returned.");
    }
    
})