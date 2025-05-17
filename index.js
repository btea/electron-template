const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer, dialog } = require('electron')
const { getDonwloadUrl, downloadBFile } = require('./src/utils/getLink')
const path = require('path')
const url = require('url')
const port = 2233

const getLink = (event, link) => {
  return getDonwloadUrl(link)
}
const percentFn = v => {
  win.webContents.send('percent', v)
}
/**
 * @params url { audio/video source }
 * @params pos { file save position }
 *
 */
const loadBlob = (event, url, pos) => {
  return downloadBFile(url, pos, percentFn)
}
const selectPosition = () => {
  const urls = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
  win.webContents.send('selectPosition', urls)
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
  win.webContents.openDevTools() // 打开开发者工具
  win.on('closed', () => {
    win = null
  })
  ipcMain.handle('link:GetLink', getLink)
  ipcMain.handle('link:LoadContent', loadBlob)
  ipcMain.handle('selectPosition', selectPosition)
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
