const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer } = require('electron')
const { getDonwloadUrl } = require('./src/utils/getLink')
const path = require('path')
const url = require('url')
const port = 2233

const getLink = (link) => {

  return getDonwloadUrl('https://www.bilibili.com/video/BV1KZ4y1e7cG?vd_source=29a1ec123bcf2daca305150b5b3a6a6b')
  // return getDonwloadUrl(link[0])
}

let win
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // backgroundColor: 'rgba(102, 204, 255, .2)',
    icon: 'assets/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: './preload.js'
    }
  })
  win.removeMenu()
  // win.loadFile('dist/index.html');
  win.loadURL(`http://localhost:${port}`)
  // win.loadURL(
  //     url.format({
  //         pathname: 'template.html'
  //     })
  // );
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null
  })
  ipcMain.handle('link:GetLink', getLink)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) { 
    createWindow()
  }
})
