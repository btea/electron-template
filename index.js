const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const port = 2233;

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // backgroundColor: 'rgba(102, 204, 255, .2)',
        icon: 'assets/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.removeMenu();
    // win.loadFile('dist/index.html');
    win.loadURL(`http://localhost:${port}`);
    // win.loadURL(
    //     url.format({
    //         pathname: 'template.html'
    //     })
    // );
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
