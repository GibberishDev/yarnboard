import {BindAction} from "../keybinds.js"

new BindAction("viewport.selection.transform_move", ()=>{alert("move")}, [], 'g')
new BindAction("viewport.selection.transform_rotate", ()=>{alert("rotate")}, [], 'r')
new BindAction("viewport.selection.transform_scale", ()=>{alert("scale")}, [], 's')
new BindAction("viewport.selection.select_all", ()=>{alert("select_all")}, [], 'control+a')
new BindAction("viewport.selection.deselect_all", ()=>{alert("deselct_all")}, [], 'control+shift+a')
new BindAction("viewport.selection.invert", ()=>{alert("invert_selection")}, [], 'control+shift+i')
new BindAction("app.project.new", newProject, [], 'control+n')
new BindAction("app.project.open", ()=>{alert("open")}, [], 'control+o')
new BindAction("app.project.save", ()=>{alert("save")}, [], 'control+s')
new BindAction("app.project.save_as", ()=>{alert("save_as")}, [], 'control+shift+s')
new BindAction("app.project.close", ()=>{alert("close")}, [], 'control+w')
new BindAction("app.viewport.settings", ()=>{alert("settings")}, [], 'control+,')
if (navigator.userAgent.includes("yarnboard-electron")) {
    new BindAction("app.debug.toggleDevTools", ()=>{window.yarnboardAPI.devTools()}, [], 'f12')
}
function newProject() {
    createWindow(uuidv4())
}