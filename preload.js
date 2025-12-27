const {contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('yarnboardAPI', {
    maximize : () => ipcRenderer.send('toggle-maximize'),
    minimize : () => ipcRenderer.send('minimize'),
    close : () => ipcRenderer.send('close'),
    devTools : () => ipcRenderer.send('devTools'),

    bindAccelerator : (accelerator) => {ipcRenderer.on('bindAccelerator', accelerator)},
})
