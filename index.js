const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
 
let win;
function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // win.loadURL('http://101.37.12.105:8098/zhdj_web/first_page.html');
 
  win.on('closed', () => {
    win = null
  })
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
