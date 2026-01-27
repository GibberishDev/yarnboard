import { executeAction, registeredActions } from "./keybinds.js"
import { localizeString } from "./localization.js"
import { registeredIcons } from "./icon_manager.js"

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
    constructor(id, PopupMenuItems = []) {
        this.id = id
        this.PopupMenuItems = PopupMenuItems
        this.childMenu = undefined
        registeredPopups[id] = this
    }
    // FIXME: keep track of opened popup trees and close and open them accordingly. Rn its super easy to close parent when clicking child or opening several children at once. fkn rewrite this shiet
    show(pos={x:0,y:0},isChild=false,parent=undefined) {
        if (this.popupElement != undefined) {
            this.hide()
            setTimeout(()=>{this.show(pos)}, 1)
            return
        }
        let popupWrapper = document.createElement("div")
        popupWrapper.dataset.popupId = this.id
        popupWrapper.classList.add("popup-menu-wrapper")
        let panel = document.createElement("div")
        let menu = document.createElement("div")
        panel.classList.add("popup-menu-panel")
        menu.classList.add("popup-menu")
        this.PopupMenuItems.forEach((entry)=>{
            if (entry == "divider") {
                let dividerElement = document.createElement("div")
                dividerElement.classList.add("popup-menu-divider")
                menu.appendChild(dividerElement)
            } else {
                let entryElement = document.createElement("div")
                entryElement.classList.add("popup-menu-entry")
                entryElement.innerHTML = menuEntryTemplate
                if (entry.icon != "") {
                    let iconElement = registeredIcons[entry.icon].getElement(26,26,entryElement)
                    entryElement.querySelector(".popup-menu-entry-icon").appendChild(iconElement)
                }
                entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString(entry.title)
                if (entry.submenu) {
                    entry.parent = popupWrapper
                    entryElement.querySelector(".popup-menu-entry-dropdown").innerText = ">"
                    entryElement.addEventListener("mousedown", (ev)=>{entry.execute(entryElement, true, popupWrapper)})
                    entryElement.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkHoveredEntry(ev,entryElement, entry)},250)})
                    popupWrapper.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkUnhoveredEntry(ev,entryElement, entry, popupWrapper)},250)})
                } else {
                    if (Object.keys(registeredActions).includes(entry.action) && registeredActions[entry.action].currentBind != "") {
                        // TODO: exchange for fancy getter so its formatted
                        entryElement.querySelector(".popup-menu-entry-bind").innerText = registeredActions[entry.action].currentBind
                    }
                    entryElement.addEventListener("mousedown", (ev)=>{
                        entry.execute()
                        document.body.removeChild(popupWrapper)
                        this.popupElement = undefined
                    }, {once:true})
                }
                menu.appendChild(entryElement)
            }
        })
        if (this.PopupMenuItems.length == 0) {
            let entryElement = document.createElement("div")
            entryElement.classList.add("popup-menu-entry")
            entryElement.innerHTML = menuEntryTemplate
            entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString("popup.emptylist")
            entryElement.addEventListener("mousedown", (ev)=>{
                document.body.removeChild(popupWrapper)
                this.popupElement = undefined
            }, {once:true})
            menu.appendChild(entryElement)
        }
        popupWrapper.appendChild(panel)
        popupWrapper.appendChild(menu)
        popupWrapper.style.left = String(pos.x) + "px"
        popupWrapper.style.top = String(pos.y) + "px"
        this.popupElement = popupWrapper
        if (isChild && parent!=undefined) {
            parent.appendChild(this.popupElement)
        } else {
            document.body.appendChild(this.popupElement)
        }
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

export class PopupMenuItem {
    constructor(action, title = "PopupMenuItem.title.default", icon = "") {
        this.action = action
        this.submenu = false
        if (action instanceof PopupMenu) {
            this.submenu = true
        }
        this.title = title
        this.icon = icon
    }
    execute(element = undefined, show = true, parent=undefined) {
        if (this.action instanceof PopupMenu) {
            if (element != undefined) {
                if (show) {
                    let rect = element.getBoundingClientRect()
                    registeredPopups[this.action.id].show( {x: 2 + rect.x + rect.width, y: rect.y - 2},true, parent)
                } else {
                    registeredPopups[this.action.id].hide()
                }
            }
        } else {
            executeAction(this.action)
        }
    }
}

document.addEventListener("mousemove", (ev)=>{
    mousePos.x = ev.clientX
    mousePos.y = ev.clientY
})