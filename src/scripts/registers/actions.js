import {BindAction, registeredActions} from "../keybinds.js"
import {togglePalette} from "../command_palette.js"

new BindAction("action.viewport.selection.transform_move" , ()=> {alert("move");window.yarnboardAPI.fixFocus()} , [] , 'g')
new BindAction("action.viewport.selection.transform_move_reset" , ()=> {alert("reset move")} , [] , 'alt+g')
new BindAction("action.viewport.selection.transform_rotate" , ()=> {alert("rotate");window.yarnboardAPI.fixFocus()} , [] , 'r')
new BindAction("action.viewport.selection.transform_rotate_reset" , ()=> {alert("reset rotate");window.yarnboardAPI.fixFocus()} , [] , 'alt+r')
new BindAction("action.viewport.selection.transform_scale" , ()=> {alert("scale");window.yarnboardAPI.fixFocus()} , [] , 's')
new BindAction("action.viewport.selection.transform_scale_reset" , ()=> {alert("reset scale");window.yarnboardAPI.fixFocus()} , [] , 'alt+s')
new BindAction("action.viewport.selection.lock_axis_x" , ()=> {alert("lock_axis_x");window.yarnboardAPI.fixFocus()} , ["scale","move"] , 'x')
new BindAction("action.viewport.selection.lock_axis_y" , ()=> {alert("lock_axis_y");window.yarnboardAPI.fixFocus()} , ["scale","move"] , 'y')
new BindAction("action.viewport.selection.select_all" , ()=> {alert("select_all");window.yarnboardAPI.fixFocus()} , [] , 'control+a')
new BindAction("action.viewport.selection.deselect_all" , ()=> {alert("deselct_all");window.yarnboardAPI.fixFocus()} , [] , 'control+shift+a')
new BindAction("action.viewport.selection.invert" , ()=> {alert("invert_selection");window.yarnboardAPI.fixFocus()} , [] , 'control+shift+i')
new BindAction("action.app.project.new" , ()=> {newProject()} , [] , 'control+n')
new BindAction("action.app.project.open" , ()=> {alert("open");window.yarnboardAPI.fixFocus()} , [] , 'control+o')
new BindAction("action.app.project.save" , ()=> {alert("save");window.yarnboardAPI.fixFocus()} , [] , 'control+s')
new BindAction("action.app.project.save_as" , ()=> {alert("save_as");window.yarnboardAPI.fixFocus()} , [] , 'control+shift+s')
new BindAction("action.app.project.close" , ()=> {alert("close");window.yarnboardAPI.fixFocus()} , [] , 'control+w')
new BindAction("action.app.viewport.settings" , ()=> {alert("settings");window.yarnboardAPI.fixFocus()} , [] , 'control+,')
new BindAction("action.app.viewport.command_palette" , () => {togglePalette(true)} , [] , 'control+p')
new BindAction("action.app.general.close_app" , () => {window.yarnboardAPI.close()} , [] , 'alt+f4')

if (navigator.userAgent.includes("yarnboard-electron")) {
    new BindAction("action.app.debug.toggleDevTools", ()=>{window.yarnboardAPI.devTools()}, [], 'f12')
}
function newProject() {
    createWindow(uuidv4())
}