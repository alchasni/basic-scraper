const crScrapper = require('./catalog-scraper');

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

crScrapper.scrapeCatalog(url, maxPrice)
    .then(() => {
        console.log('Scraping completed successfully.');
    })
    .catch((error) => {
        console.error('Error occurred during scraping:', error);
    });
