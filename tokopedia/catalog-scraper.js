const { chromium } = require('playwright');

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
        
        if (productLinks.length === 0) {
            if (isFirstPage) console.log('You cannot afford anything :(');
        }
        else {
            if (isFirstPage) console.log('Product that you can buy:');
            productLinks.forEach(link => console.log(link));
        }

        // Need this, because it is possible that the client budget is bigger than the most expensive item in catalog
        const nextButtonDisabled = await page.$eval('.css-16uzo3v-unf-pagination-item[aria-label="Laman berikutnya"]', button => button.disabled);
        return {
            productLinks : productLinks,
            isLastPage: productLinks.length < 16 || nextButtonDisabled,
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
    let productLinks = [];
    let result = await scrapeTokopedia(getCatalogUrl(url, page), maxPrice, true)
    productLinks = productLinks.concat(result.productLinks)
    while (!result.isLastPage) {
        page = page + 1
        result.isLastPage = await scrapeTokopedia(getCatalogUrl(url, page), maxPrice, false)
        productLinks = productLinks.concat(result.productLinks)
    }
    return productLinks
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

module.exports = {
    scrapeCatalog: scrapeCatalog
};