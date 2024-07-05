# basic-scraper
Basic Scraper using Js.

### Feature :
- **Tokopedia price checker**
  <br /> Using Tokopedia detail page and max price, determine whether you are able to afford it or not
- **Tokopedia catalog price search**
  <br /> Using Tokopedia catalog page and max price, find all product you can afford
- **Detik.com Top News Scrapper**
  <br /> Automatically retrive current top news from Detik.com
- **Garasi.id Newest Article Scrapper**
  <br /> Automatically retrive the newest automotive article from Garasi.id

### Prerequisite :
- node.js (tested in v20.15.0) 
- npm (tested in v10.7.0)

### Instalation :
```shell
npm install
```

### How to use :
- Tokopedia price checker :
```shell
node tokopedia/scrappedia <tokopedia-url> <max-price>
```

- Tokopedia catalog price search :
```shell
node tokopedia/catalog-scrappedia <tokopedia-catalog-url> <max-price>
```

- Tokopedia catalog price search with UI :
```shell
npm start
```

- Detik.com article headless scraper :
```shell
node detik/detik
```

- Garasi.id article API scraper :
```shell
node garasi/garascrapper
```