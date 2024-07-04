const { chromium } = require('playwright');

const args = process.argv.slice(2);

// Example usage:
// const url = 'https://www.tokopedia.com/catalog/logitech-80213/logitech-g604';
// const maxPrice = 500000
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

async function scrapeTokopedia(url, maxPrice, isFirstPage) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await autoScroll(page)

        await page.waitForSelector('.pcv3__info-content', { timeout: 90000 });

        const productCards = await page.$$('.pcv3__info-content');
        const priceElements = await page.$$('.prd_link-product-price');
        const productLinks = [];
        let i = 0

        for (const card of productCards) {
            const link = await card.getAttribute('href');
            if (!priceElements[i]) {
                console.log('ERROR NO PRICE');
                continue;
            }

            const priceText = await priceElements[i].innerText();
            const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(/[,.]/g, ''));

            if (price && price <= maxPrice) {
                productLinks.push(link);
            }
            i = i + 1
        }
        
        // Output filtered links
        if (productLinks.length === 0) {
            if (isFirstPage) console.log('You cannot afford anything :(');
        }
        else {
            if (isFirstPage) console.log('Product that you can buy:');
            productLinks.forEach(link => console.log(link));
        }
        if (productLinks.length < 16) {
            return true
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

function getCatalogUrl(url, page) {
    return url + '?ob=3&page=' + page + '&start=' + 16*page
}

async function scrapeCatalog(url, maxPrice) {
    let page = 0
    let isLastPage = await scrapeTokopedia(getCatalogUrl(url, page), maxPrice, true)
    while (!isLastPage) {
        page = page + 1
        isLastPage = await scrapeTokopedia(getCatalogUrl(url, page), maxPrice, false)
    }
}

// Need this, because ProductList is at the bottom of catalogue
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

scrapeCatalog(url, maxPrice)
    .then(() => {
        console.log('Scraping completed successfully.');
    })
    .catch((error) => {
        console.error('Error occurred during scraping:', error);
    });
