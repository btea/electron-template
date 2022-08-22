const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getLink: (link) => {
		ipcRenderer.invoke('link:Getlink', link)
	}
})
