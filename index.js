const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer } = require('electron')
const { getDonwloadUrl, downloadBFile } = require('./src/utils/getLink')
const path = require('path')
const url = require('url')
const port = 2233

const getLink = (event, link) => {
  return getDonwloadUrl(link)
}
const percentFn = v => {
  console.log(v)
  win.webContents.send('percent', v)
}
const loadBlob = (event, url, title) => {
  return downloadBFile(url, title, percentFn)
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
      contextIsolation: false
      // preload: './preload.js'
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
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
  ipcMain.handle('link:GetLink', getLink)
  ipcMain.handle('link:LoadContent', loadBlob)
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
