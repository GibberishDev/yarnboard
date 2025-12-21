const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require('electron')
const PATH = require('path')

let mainWindow;

function createWindow() {
  const win = new BrowserWindow({
    width : 960,
    height : 540,
    minWidth : 360,
    minHeight : 270,
    resizable : true,
    frame: false,
    darkTheme : true,
    icon : "./assets/images/icons/app.ico",
    webPreferences : {
      nodeIntegration: true,
      contextIsolation: true,
      preload: PATH.join(__dirname,"preload.js") 
    }
  })
  let position = determine_screen_with_pointer_center()
  position = {
    x: parseInt(position.x - win.getSize()[0] / 2.0),
    y: parseInt(position.y - win.getSize()[1] / 2.0)
  }
  win.setPosition(position.x, position.y)
//   win.maximize()
  win.loadFile('index.html')
  return win
}

app.whenReady().then(() => {
  mainWindow = createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function determine_screen_with_pointer_center() {
    // get config if user wants app loaded specific way
    let pointer_location = electron.screen.getCursorScreenPoint()
    let screen_data = electron.screen.getDisplayNearestPoint(pointer_location)
    let screen_center = {x: screen_data.bounds.x + screen_data.bounds.width/2.0, y: screen_data.bounds.y + screen_data.bounds.height/2.0}
    return screen_center
}

ipcMain.on('toggle-maximize', toggleMaximize)
ipcMain.on('minimize', minimize)
ipcMain.on('close', close)

function toggleMaximize() {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
}
function minimize() {
  mainWindow.minimize()
}
function close() {
  // TODO: implement confirmations and proper shutdown procedure
  mainWindow.close()
}