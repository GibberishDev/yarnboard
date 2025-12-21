const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('yarnboardAPI', {
    maximize : () => ipcRenderer.send('toggle-maximize'),
    minimize : () => ipcRenderer.send('minimize'),
    close : () => ipcRenderer.send('close'),
})