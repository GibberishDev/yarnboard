import { BindAction} from "../keybinds.js"
import { togglePalette} from "../command_palette.js"
import { moduleReady} from "./ready.js"
import { openSettings, uuidv4, createWindow, closeCurrent } from "../window_manager.js"
import { lockTransformAxis, resetView, TRANSFORM_STATES } from "../project_viewport.js"
import { registeredPopups } from "../popup_menu.js"
import { lockPanAxis, setTransformMode } from "../project_viewport.js"
import { selectAll, deselectAll, invertSelection } from "../selection.js"


function newProject() {
    createWindow(uuidv4())
}

new BindAction("action.viewport.selection.transform_move" , ()=> {setTransformMode(TRANSFORM_STATES.DRAG)} , ["board"] , 'g')
new BindAction("action.viewport.selection.transform_move_reset" , ()=> {alert("reset move");window.yarnboardAPI.fixFocus()} , ["board"] , 'alt+g')
new BindAction("action.viewport.selection.transform_rotate" , ()=> {setTransformMode(TRANSFORM_STATES.ROTATE)} , ["board"] , 'r')
new BindAction("action.viewport.selection.transform_rotate_reset" , ()=> {alert("reset rotate");window.yarnboardAPI.fixFocus()} , ["board"] , 'alt+r')
new BindAction("action.viewport.selection.transform_scale" , ()=> {setTransformMode(TRANSFORM_STATES.SCALE)} , ["board"] , 's')
new BindAction("action.viewport.selection.transform_scale_reset" , ()=> {alert("reset scale");window.yarnboardAPI.fixFocus()} , ["board"] , 'alt+s')
new BindAction("action.viewport.selection.lock_axis_x" , ()=> {lockTransformAxis(true)} , ["scale","drag"] , 'x')
new BindAction("action.viewport.selection.lock_axis_y" , ()=> {lockTransformAxis(false)} , ["scale","drag"] , 'y')
new BindAction("action.viewport.selection.select_all" , selectAll , ["board"] , 'control+a')
new BindAction("action.viewport.selection.deselect_all" , deselectAll , ["board"] , 'control+shift+a')
new BindAction("action.viewport.selection.invert" , invertSelection, ["board"] , 'control+shift+i', true)
new BindAction("action.viewport.view.reset" , resetView, ["board"] , 'numpaddecimal')
new BindAction("action.app.project.new" , ()=> {newProject()} , [] , 'control+n')
new BindAction("action.app.project.open" , ()=> {alert("open");window.yarnboardAPI.fixFocus()} , [] , 'control+o')
new BindAction("action.app.project.save" , ()=> {alert("save");window.yarnboardAPI.fixFocus()} , [] , 'control+s')
new BindAction("action.app.project.save_as" , ()=> {alert("save_as");window.yarnboardAPI.fixFocus()} , [] , 'control+shift+s')
new BindAction("action.app.project.close" ,  closeCurrent , [] , 'control+w')
new BindAction("action.app.viewport.settings" , openSettings , [] , 'control+comma')
new BindAction("action.app.viewport.command_palette" , () => {togglePalette(true)} , [] , 'control+p')
new BindAction("action.app.general.close_app" , () => {window.yarnboardAPI.close()} , [] , 'altleft+f4', true, false, true)
new BindAction("action.app.theme.savepreset" , () => {alert("save_theme");window.yarnboardAPI.fixFocus()} , [] , '')
new BindAction("action.app.viewport.main_popup" , (ev) => {openMainPopup(ev)} , [] , 'altleft', true, false, true)
new BindAction("action.project.view_panning.lock_axis_x" , ()=> {lockPanAxis(true)} , ["view_panning"] , 'x', true, false, true)
new BindAction("action.project.view_panning.lock_axis_y" , ()=> {lockPanAxis(false)} , ["view_panning"] , 'y', true, false, true)


if (navigator.userAgent.includes("yarnboard")) {
    new BindAction("action.app.debug.toggleDevTools", ()=>{window.yarnboardAPI.devTools()}, [], 'f12')
}

function openMainPopup(event) {
    var rect = {}
    if (event == undefined) {
        event = {}
        if (document.querySelector("#title-bar-icon-button") != undefined) {
            event.source = document.querySelector("#title-bar-icon-button")
            rect = event.source.getBoundingClientRect()
        } else {
            rect = {
                x:0,y:0,width:0,height:0
            }
        }
    } else {
        rect = event.source.getBoundingClientRect()
    }
    registeredPopups["popup.app.main"].toggle({x:rect.x,y:2+rect.y+rect.height})
}

moduleReady("actions")