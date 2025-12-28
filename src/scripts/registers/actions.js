import {BindAction} from "../keybinds.js"
import {togglePalette} from "../command_palette.js"

new BindAction("action.viewport.selection.transform_move" , ()=>{alert("move")}, [], 'g')
new BindAction("action.viewport.selection.transform_rotate" , ()=>{alert("rotate")}, [], 'r')
new BindAction("action.viewport.selection.transform_scale" , ()=>{alert("scale")}, [], 's')
new BindAction("action.viewport.selection.select_all" , ()=>{alert("select_all")}, [], 'control+a')
new BindAction("action.viewport.selection.deselect_all" , ()=>{alert("deselct_all")}, [], 'control+shift+a')
new BindAction("action.viewport.selection.invert" , ()=>{alert("invert_selection")}, [], 'control+shift+i')
new BindAction("action.app.project.new" , newProject, [], 'control+n')
new BindAction("action.app.project.open" , ()=>{alert("open")}, [], 'control+o')
new BindAction("action.app.project.save" , ()=>{alert("save")}, [], 'control+s')
new BindAction("action.app.project.save_as" , ()=>{alert("save_as")}, [], 'control+shift+s')
new BindAction("action.app.project.close" , ()=>{alert("close")}, [], 'control+w')
new BindAction("action.app.viewport.settings" , ()=>{alert("settings")}, [], 'control+,')
new BindAction("action.app.viewport.command_palette" , togglePalette, [], 'control+p')

if (navigator.userAgent.includes("yarnboard-electron")) {
    new BindAction("action.app.debug.toggleDevTools", ()=>{window.yarnboardAPI.devTools()}, [], 'f12')
}
function newProject() {
    createWindow(uuidv4())
}