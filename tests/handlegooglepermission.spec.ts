import { Browser, BrowserContext, chromium, expect, Page, test } from "playwright/test";

test('Handle permission', async () => {

const browser: BrowserContext= await chromium.launchPersistentContext('', {headless:false, 
    permissions:['microphone', 'camera'],
    args: [
    '--use-fake-ui-for-media-stream',       // Auto-accept camera/mic permission
    '--use-fake-device-for-media-stream'   // Use a fake video/mic input
            ]
        })
    const page: Page = await browser.newPage();

        // Step 3: Navigate to Google
        await page.goto('https://www.google.com');

        // Step 4: Click on mic icon (voice search button)
        await page.click('div[aria-label="Search by voice"]');

        // Step 5: Wait to simulate voice input time
        await page.waitForTimeout(5000);

        console.log('✅ Mic and Camera permissions auto-granted and mic clicked');

        await browser.close();





})