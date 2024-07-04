const { chromium } = require('playwright');

async function scrapeTokopedia(url, maxPrice) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Opening Tokopedia Detail Page');
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        console.log('Loading Tokopedia Detail Page...');
        await page.waitForSelector('.price', { timeout: 60000 });

        const priceText = await page.$$eval('.price', prices => {
            return prices.map(price => price.innerText);
        });
        const price = parseFloat(priceText[0].replace(/[^\d.,]/g, '').replace(/[,.]/g, ''));

        if (price && price > maxPrice) {
            console.log('You cannot afford this, work more!');
        } else {
            console.log('It is cheap! Buy now!');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

// TODO : use input? 
const url = 'https://www.tokopedia.com/mitrahokicomindo1gg/mouse-gaming-logitech-g604-lightspeed-wireless-gaming-mouse';
const maxPrice = 5000000
scrapeTokopedia(url, maxPrice)
    .then(() => {
        console.log('Scraping completed successfully.');
    })
    .catch((error) => {
        console.error('Error occurred during scraping:', error);
    });
