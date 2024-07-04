# basic-scraper
Basic Scraper using Js.

### Feature :
- **Tokopedia price checker**
  <br /> Using Tokopedia detail page and max price, determine whether you are able to afford it or not
- **Tokopedia catalog price search**
  <br /> Using Tokopedia catalog page and max price, find all product you can afford

### Prerequisite :
- node.js (tested in v20.15.0) 
- npm (tested in v10.7.0)

### Instalation :
```shell
npm install
```

### How to use :
- tokopedia price checker :
```shell
node scrappedia <tokopedia-url> <max-price>
```

- tokopedia catalog price search :
```shell
node catalog-scrappedia <tokopedia-catalog-url> <max-price>
```

- tokopedia catalog price search with UI :
```shell
npm start
```