import { BindAction, executeAction } from "./keybinds.js"
import { localizeString } from "./localization.js"

export var registeredPopups = {}
var mousePos = {
    x: 0,
    y: 0
}

const menuEntryTemplate = `<div class="popup-menu-entry-icon"></div>
<div class="popup-menu-entry-text"></div>
<div class="popup-menu-entry-bind"></div>
<div class="popup-menu-entry-dropdown"></div>`

export class PopupMenu {
    constructor(id, menuItems = []) {
        this.id = id
        this.menuItems = menuItems
        this.childMenu = undefined
        registeredPopups[id] = this
    }

    show(pos={x:0,y:0}) {
        if (this.popupElement != undefined) {
            this.hide()
            setTimeout(()=>{this.show(pos)}, 1)
            return
        }
        console.log("showing popup:", this.id)
        let popupWrapper = document.createElement("div")
        popupWrapper.dataset.popupId = this.id
        popupWrapper.classList.add("popup-menu-wrapper")
        let panel = document.createElement("div")
        let menu = document.createElement("div")
        panel.classList.add("popup-menu-panel")
        menu.classList.add("popup-menu")
        this.menuItems.forEach((entry)=>{
            if (entry == "divider") {
                let dividerElement = document.createElement("div")
                dividerElement.classList.add("popup-menu-divider")
                menu.appendChild(dividerElement)
            } else {
                let entryElement = document.createElement("div")
                entryElement.classList.add("popup-menu-entry")
                entryElement.innerHTML = menuEntryTemplate
                if (entry.icon != "") {/*call icon manager*/}
                entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString(entry.title)
                // TODO: call binds manager to get action bind
                if (entry.submenu) {
                    entryElement.querySelector(".popup-menu-entry-dropdown").innerText = ">"
                    entryElement.addEventListener("mousedown", (ev)=>{entry.execute(entryElement, true)})
                    entryElement.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkHoveredEntry(ev,entryElement, entry)},250)})
                    popupWrapper.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkUnhoveredEntry(ev,entryElement, entry, popupWrapper)},250)})
                } else {
                    entryElement.addEventListener("mousedown", (ev)=>{
                        entry.execute()
                        document.body.removeChild(popupWrapper)
                        this.popupElement = undefined
                    }, {once:true})
                }
                menu.appendChild(entryElement)
            }
        })
        this.popupElement = popupWrapper
        document.body.appendChild(this.popupElement)
        popupWrapper.appendChild(panel)
        popupWrapper.appendChild(menu)
        popupWrapper.style.left = String(pos.x) + "px"
        popupWrapper.style.top = String(pos.y) + "px"
        setTimeout(
        ()=>{document.addEventListener("mousedown", (ev)=>{removeOnOutsideClick(ev, this)}, {once:true})},
        1)
    }

    hide() {
        if (Array.from(document.body.children).includes(this.popupElement)) document.body.removeChild(this.popupElement)
        this.popupElement = undefined
    }

}

function checkHoveredEntry(ev, element, entry) {
    let elements = document.elementsFromPoint(mousePos.x, mousePos.y)
    if (elements.includes(element)) {
        entry.execute(element, true)
    } 
}

function checkUnhoveredEntry(ev, element, entry, menu) {
    let elements = document.elementsFromPoint(mousePos.x, mousePos.y)
    console.log(!elements.includes(registeredPopups[entry.action.id].popupElement))
    if (!elements.includes(element) && elements.includes(menu)) {
        entry.execute(element, false)
    }
}

function removeOnOutsideClick(event, popupMenu) {
    if (popupMenu.popupElement == undefined) return
    let elements = document.elementsFromPoint(event.clientX, event.clientY)
    if (!elements.includes(popupMenu.popupElement)) {
        popupMenu.hide()
    } else {
        document.addEventListener("mousedown", (ev)=>{removeOnOutsideClick(ev, popupMenu)}, {once:true})
    }
}

export class menuItem {
    constructor(action, title = "menuitem.title.default", icon = "") {
        this.action = action
        this.submenu = false
        if (action instanceof PopupMenu) {
            this.submenu = true
        }
        this.title = title
        this.icon = icon
    }
    execute(element = undefined, show = true) {
        if (this.action instanceof PopupMenu) {
            if (element != undefined) {
                if (show) {
                    let rect = element.getBoundingClientRect()
                    registeredPopups[this.action.id].show( {x: 2 + rect.x + rect.width, y: rect.y})
                } else {
                    registeredPopups[this.action.id].hide()
                }
            }
        } else {
            executeAction(this.action)
        }
    }
}

new PopupMenu("test-popup-submenu", [
    "divider",
    new menuItem("action.app.project.new","popupitem.file.newproject")
])
new PopupMenu("test-popup-submenu2", [
    "divider",
    new menuItem("action.app.project.new","popupitem.file.newproject")
])

new PopupMenu("test-popup",[
    new menuItem("action.app.project.new","popupitem.file.newproject"),
    "divider",
    new menuItem("action.app.project.new","popupitem.file.newproject"),
    new menuItem(registeredPopups["test-popup-submenu"],"submenu"),
    new menuItem(registeredPopups["test-popup-submenu2"],"submenu2"),
    new menuItem("action.app.project.new","popupitem.file.newproject")
])
document.addEventListener("mousemove", (ev)=>{
    mousePos.x = ev.clientX
    mousePos.y = ev.clientY
})
document.addEventListener("ready", (ev) => {
    registeredPopups["test-popup"].show({x:50,y:30})
})
/*
<div class="popup-menu-wrapper">
    <div class="popup-menu-panel"></div>
    <div class="popup-menu">
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-audio-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path class="svg-audio-element note"style="paint-order:stroke fill"d="m 14.5,12.5 v -11 h -11 v 9 c 0,0 -2,0 -2,2 0,2 2,2 2,2 0,0 2,0 2,-2 v -9 h 7 v 7 c 0,0 -2,0 -2,2 0,2 2,2 2,2 0,0 2,0 2,-2 z"/>
                    <path class="svg-audio-element plus"style="paint-order:stroke fill"d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">New project</div>
            <div class="popup-menu-entry-bind">Ctrl N</div>
            <div class="popup-menu-entry-dropdown"></div>
        </div>
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-photo-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <rect class="svg-photo-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
                    <rect class="svg-photo-element inner-rect" width="11" height="7" x="2.5" y="2.5"/>
                    <path class="svg-photo-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,11 H 13"/>
                    <path class="svg-photo-element line" style="stroke-linecap:square;paint-order:stroke fill" d="m 4.5,13 h 7"/>
                    <path class="svg-photo-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">Open project</div>
            <div class="popup-menu-entry-bind">Ctrl O</div>
            <div class="popup-menu-entry-dropdown">></div>
        </div>
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-picture-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <rect class="svg-picture-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
                    <rect class="svg-picture-element inner-rect" width="11"height="11"x="2.5"y="2.5"/>
                    <path class="svg-picture-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">Open recent</div>
            <div class="popup-menu-entry-bind">Ctrl Shift O</div>
            <div class="popup-menu-entry-dropdown">></div>
        </div>
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-text-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <rect class="svg-text-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,3 H 13"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,5 H 8"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 8,7 h 5"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 10,5 h 3"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,7 H 6"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,11 H 8"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 8,13 h 5"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 10,11 h 3"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,13 H 6"/>
                    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,9 H 13"/>
                    <path class="svg-text-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">Save project</div>
            <div class="popup-menu-entry-bind">Ctrl S</div>
            <div class="popup-menu-entry-dropdown"></div>
        </div>
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-note-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <rect class="svg-note-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
                    <path class="svg-note-element line"style="stroke-linecap:round;paint-order:stroke fill"d="M 3,8 C 3.5,7.5 3.5,7 4,7 5,7 5,8 6,8 7,8 7,7 8,7 c 1,0 1,1 2,1 1,0 1,-1 2,-1 0.5,0 0.5,0.5 1,1"/>
                    <path class="svg-note-element line"style="stroke-linecap:round;paint-order:stroke fill"d="M 3.5,11 C 4,10.5 4,10 5,10 c 1,0 1,1 2,1 1,0 1,-1 2,-1 1,0 1,0.5 1.5,1"/>
                    <rect class="svg-note-element shade"style="paint-order:stroke fill;"width="13.1"height="2.1"x="1.45"y="1.45"/>
                    <circle class="svg-note-element dot"cx="13"cy="11"r="0.5"/>
                    <path class="svg-note-element plus"style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">Save project as...</div>
            <div class="popup-menu-entry-bind">Ctrl Shift S</div>
            <div class="popup-menu-entry-dropdown"></div>
        </div>
        <div class="popup-menu-divider"></div>
        <div class="popup-menu-entry">
            <div class="popup-menu-entry-icon">
                <svg class="svg-video-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path class="svg-video-element plus"style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
                    <path class="svg-video-element triangle"style="stroke-width:1;stroke-linejoin:round;paint-order:stroke fill;"d="m 1.5,1.5 13,6.5 -13,6.5 z"/>
                </svg>
            </div>
            <div class="popup-menu-entry-text">New photo element</div>
            <div class="popup-menu-entry-bind">Ctrl P</div>
            <div class="popup-menu-entry-dropdown">></div>
        </div>
    </div>
</div> */