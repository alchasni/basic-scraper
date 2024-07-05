const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log('Loading Detik.com...');
        await page.goto('https://www.detik.com/', { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('h2.media__title a.media__link');

        const mainNews = await page.$$eval('h2.media__title a.media__link', links => {
            return links.map(link => {
                const title = link.getAttribute('dtr-ttl');
                const href = link.getAttribute('href');
                return { title, href };
            });
        });

        console.log('Main News:', mainNews);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
