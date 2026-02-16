const {contextBridge, ipcRenderer, webUtils} = require('electron')


contextBridge.exposeInMainWorld('yarnboardAPI', {
    maximize : () => ipcRenderer.send('toggle-maximize'),
    minimize : () => ipcRenderer.send('minimize'),
    close : () => ipcRenderer.send('close'),
    devTools : () => ipcRenderer.send('devTools'),
    fixFocus : () => ipcRenderer.send('fixFocus'),
    saveText : (path, name, text) => ipcRenderer.send('saveText',[path, name, text]),
    saveAppSettings: (data) => ipcRenderer.send('saveAppSettings', data),
    loadAppSettings: () => ipcRenderer.send('loadAppSettings'),
    setMouseScreenPos : (pos) => ipcRenderer.send('setMouseScreenPos', pos),

    bindAccelerator : (accelerator) => ipcRenderer.on('bindAccelerator', accelerator),
    loadSettings : (settingsObject) => ipcRenderer.on('loadSettings', settingsObject),
})



document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();   
    const fileList = [];
    for(i=0;i<event.dataTransfer.files.length;i++){
        let path = webUtils.getPathForFile(event.dataTransfer.files[i]).replaceAll("\\","/")
        var type = getType(path)
        if (type == "dir") path += "/"
        fileList.push({
            path: path,
            type: type
        })
    }
    if(fileList.length>0) {
        console.log(fileList)
    }
})

function getType(path) {
    if (/\.[a-z0-9]+$/i.test(path)) {
        return "file"
    } else {
        return "dir"
    }
}
