const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#6cf',
        icon: 'assets/icon.ico'
    });
    win.removeMenu();
    win.loadURL(
        url.format({
            pathname: './template.html'
        })
    );
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
