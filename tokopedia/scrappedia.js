const { chromium } = require('playwright');

const args = process.argv.slice(2);

// Example usage:
// const url = 'https://www.tokopedia.com/mitrahokicomindo1gg/mouse-gaming-logitech-g604-lightspeed-wireless-gaming-mouse';
// const maxPrice = 5000000
if (args.length < 2) {
    console.error('Please provide both url and maxPrice as arguments.');
    process.exit(1);
}

const url = args[0];
const maxPrice = parseFloat(args[1]);

if (isNaN(maxPrice)) {
    console.error('maxPrice must be number.');
    process.exit(1);
}

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

scrapeTokopedia(url, maxPrice)
    .then(() => {
        console.log('Scraping completed successfully.');
    })
    .catch((error) => {
        console.error('Error occurred during scraping:', error);
    });
