const { app, BrowserWindow, ipcMain, globalShortcut, Menu, MenuItem } = require('electron')
const fs = require('fs')
const electron = require('electron')
const PATH = require('path')
const robot = require('@jitsi/robotjs')

let mainWindow;

function createWindow() {
  const win = new BrowserWindow({
    title: "Yarnboard",
    width : 960,
    height : 540,
    minWidth : 360,
    minHeight : 270,
    resizable : true,
    frame: false,
    darkTheme : true,
    icon : "./assets/images/icons/app.ico",
    fullscreenable : false,
    roundedCorners : false,
    webPreferences : {
      nodeIntegration: false,
      contextIsolation: true,
      autoplayPolicy: 'no-user-gesture-required',
      preload: PATH.join(__dirname,"preload.js"),
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
  .then(() => {disableDefaultSortcuts()})
  

  win.webContents.on( //Disable alt+f4 to enable proper project closing sequence and ability to rebind alt+f4
    "before-input-event",
    (ev,input) => {
      if ( input.code == 'F4' && input.alt ) {
        ev.preventDefault()
        mainWindow.webContents.send('bindAccelerator', "alt+f4")
      }
    }
  )
  
  return win
}

app.setPath("sessionData", app.getPath('temp'))

app.whenReady().then(() => {
  mainWindow = createWindow()
  disableDefaultSortcuts()
  mainWindow.webContents.toggleDevTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('browser-window-focus', () => {
  disableDefaultSortcuts()
})
app.on('browser-window-blur', () => {
  enableDefaultSortcuts()
})

function determine_screen_with_pointer_center() {
    // get config if user wants app loaded specific way
    let pointer_location = electron.screen.getCursorScreenPoint()
    let screen_data = electron.screen.getDisplayNearestPoint(pointer_location)
    let screen_center = {x: screen_data.bounds.x + screen_data.bounds.width/2.0, y: screen_data.bounds.y + screen_data.bounds.height/2.0}
    return screen_center
}

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

function devTools() {
  mainWindow.webContents.toggleDevTools()
}

function fixFocus() {
  mainWindow.blur()
  mainWindow.focus()
}

function disableDefaultSortcuts() {
  globalShortcut.register("CommandOrControl+=", () => {mainWindow.webContents.send('bindAccelerator', "control+=")}) //zoom in secondary
  globalShortcut.register("CommandOrControl+Shift+=", () => {mainWindow.webContents.send('bindAccelerator', "control+shift+=")}) //zoom in
  globalShortcut.register("CommandOrControl+-", () => {mainWindow.webContents.send('bindAccelerator', "control+-")}) //zoom out
  globalShortcut.register("CommandOrControl+Shift+-", () => {mainWindow.webContents.send('bindAccelerator', "control+shift+-")}) //zoom out secondary
  globalShortcut.register("CommandOrControl+W", () => {mainWindow.webContents.send('bindAccelerator', "control+w")}) //close window
  globalShortcut.register("F5", () => {mainWindow.webContents.send('bindAccelerator', "f5")}) //reload secondary
  globalShortcut.register("CommandOrControl+R", () => {mainWindow.webContents.send('bindAccelerator', "control+r")}) //reload
  globalShortcut.register("CommandOrControl+Shift+I", () => {mainWindow.webContents.send('bindAccelerator', "control+shift+i")}) //developer console
  globalShortcut.register("Alt+F4", () => {mainWindow.webContents.send('bindAccelerator', "alt+f4")}) //close app
  globalShortcut.register("CommandOrControl+M", () => {mainWindow.webContents.send('bindAccelerator', "control+m")}) //minimize app
}
function enableDefaultSortcuts() {
  globalShortcut.unregister("CommandOrControl+=") //zoom in secondary
  globalShortcut.unregister("CommandOrControl+Shift+=") //zoom in
  globalShortcut.unregister("CommandOrControl+-") //zoom out
  globalShortcut.unregister("CommandOrControl+Shift+-") //zoom out secondary
  globalShortcut.unregister("CommandOrControl+W") //close window
  globalShortcut.unregister("F5") //reload secondary
  globalShortcut.unregister("CommandOrControl+R") //reload
  globalShortcut.unregister("CommandOrControl+Shift+I") //developer console
  globalShortcut.unregister("Alt+F4") //close app
  globalShortcut.unregister("CommandOrControl+M") //minimize app. Why is this even default bind on ctrl m wtf
}

// #region file saving

function saveTextFile(path, filename, textContents) {
  if (!fs.existsSync(path)) {
    fs.mkdir(path,function (err) {if (err) {
      if (err.code == "EPERM") {
        console.log("ERROR: cannot save in " + path + ". Missing admin priviledges")
        return
      }
      throw err
    }})
  }
  fs.writeFile(path + filename, textContents, function (err) {if (err) {
      if (err.code == "EPERM") {
        console.log("ERROR: cannot save in " + path + ". Missing admin priviledges")
        return
      }
      throw err
    }})
}

function saveAppSettings(data) {
  let userPath = app.getPath("userData")
  fs.writeFile(PATH.join(userPath, "settings.json"), data, function (err) {if (err) {
      if (err.code == "EPERM") {
        console.log("ERROR: cannot save in " + path + ". Missing admin priviledges")
        return
      }
      throw err
    }})
}

function loadAppSettings() {
  let userPath = app.getPath("userData")
  mainWindow.webContents.send("loadSettings", fs.readFileSync(PATH.join(userPath, "settings.json"),"utf-8"))
}

function setMousePosition(pos={x:0,y:0}) {
  let winRect = mainWindow.getContentBounds()
  robot.moveMouse(pos.x + winRect.x,pos.y + winRect.y)
}

// #endregion

// #region ipc event listeners

ipcMain.on('toggle-maximize', toggleMaximize)
ipcMain.on('minimize', minimize)
ipcMain.on('close', close)
ipcMain.on('devTools', devTools)
ipcMain.on('fixFocus', fixFocus)
ipcMain.on('saveText', (_ev, data)=>saveTextFile(data[0], data[1], data[2]))
ipcMain.on('saveAppSettings', (_ev, data)=>saveAppSettings(data))
ipcMain.on('loadAppSettings', loadAppSettings)
ipcMain.on('setMouseScreenPos', (_ev,pos)=>{setMousePosition(pos)})

// #endregion
