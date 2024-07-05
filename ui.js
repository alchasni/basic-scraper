const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const crScrapper = require('./catalog-scraper');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    ipcMain.on('start-scraping', async (event, data) => {
        const {catalogUrl, maxPrice} = data;

        console.log(`Received data: catalogUrl=${catalogUrl}, maxPrice=${maxPrice}`);
        const result = await crScrapper.scrapeCatalog(catalogUrl, maxPrice);
        setTimeout(() => {
            if (result.length === 0) {
                mainWindow.webContents.send('scraping-result', 'No Product with under Rp.' + maxPrice);
            } else {
                mainWindow.webContents.send('scraping-result-with-link', result);
            }
        }, 2000);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});