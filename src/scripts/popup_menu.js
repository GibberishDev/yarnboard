import { executeAction, registeredActions } from "./keybinds.js"
import { localizeString } from "./localization.js"
import { registeredIcons } from "./icon_manager.js"

export var registeredPopups = {}
var mousePos = {
    x: 0,
    y: 0
}
var openPopups = []

const menuEntryTemplate = `<div class="popup-menu-entry-icon"></div>
<div class="popup-menu-entry-text"></div>
<div class="popup-menu-entry-bind"></div>
<div class="popup-menu-entry-dropdown"></div>`

const popupButtons = [
    "#title-bar-icon-button",
]

export class PopupMenu {
    constructor(id, PopupMenuItems = []) {
        this.id = id
        this.PopupMenuItems = PopupMenuItems
        this.childPopupElement = undefined
        this.parentPopupElement = undefined
        this.popupElement = undefined

        registeredPopups[id] = this
    }
    
    getChildren() {
        var result = []
        if (this.childPopupElement) {
            result.push(this.childPopupElement.dataset.id)
            let childrenOfChildren = registeredPopups[this.childPopupElement.dataset.id].getChildren()
            childrenOfChildren.forEach((el)=>{result.push(el)})
        }
        return result
    }

    createPopUpElement() {
        let element = document.createElement("div")
        element.dataset.id = this.id;
        element.classList.add("popup-menu-wrapper")

        let menu = document.createElement("div")
        element.appendChild(menu)
        menu.classList.add("popup-menu")

        
        if (this.PopupMenuItems.length == 0) {
            let entryElement = document.createElement("div")
            menu.appendChild(entryElement)
            entryElement.classList.add("popup-menu-entry", "inactive")
            entryElement.innerHTML = menuEntryTemplate
            entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString("popup.emptylist")
        } else { for (let entry of this.PopupMenuItems) {
            if (entry == "divider") {
                let dividerElement = document.createElement("div")
                dividerElement.classList.add("popup-menu-divider")
                menu.appendChild(dividerElement)
                continue
            }

            let entryElement = document.createElement("div")
            menu.appendChild(entryElement)
            entryElement.classList.add("popup-menu-entry")
            entryElement.innerHTML = menuEntryTemplate

            if (entry.icon != '') {
                let iconElement = registeredIcons[entry.icon].getElement(26,26,entryElement) // <- binds highlight hover styling to supplied element in 3rd param
                entryElement.querySelector(".popup-menu-entry-icon").appendChild(iconElement)
            }

            entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString(entry.title)

            if (entry.submenu) {
                entryElement.querySelector(".popup-menu-entry-dropdown").innerText = ">"
            } else { // meaning its bind action
                // TODO: exchange for getting bind elements with styling
                if (Object.keys(registeredActions).includes(entry.action)) {
                    let bindText = registeredActions[entry.action].currentBind
                    if (bindText != "") entryElement.querySelector(".popup-menu-entry-bind").innerText = bindText
                }
            }

            this.bindEntryEvents(entry, entryElement)

            menu.appendChild(entryElement)
        }}

        return element
    }

    bindEntryEvents(entry, element) {
        if (entry.submenu) {
            element.addEventListener("click", (_ev)=>{entry.showSubmenu(this, element)})
        } else {
            element.addEventListener("click", (_ev)=>{entry.execute()})
        }
        element.addEventListener("mouseover", (_ev)=>{setTimeout(()=>{checkHoveredEntry(this,element,entry)},250)})
        
    }

    show(pos={x:0,y:0}) {
        if (openPopups.includes(this.id)) {
            return /*TODO: change to move and check for off screen cases*/
        } else {
            this.popupElement = this.createPopUpElement()
            document.body.appendChild(this.popupElement)
            openPopups.push(this.id)
            this.popupElement.style.left = pos.x + "px"
            this.popupElement.style.top = pos.y + "px"
        }
    }

    hide() {
        if (Array.from(document.body.children).includes(this.popupElement)) {
            document.body.removeChild(this.popupElement)
        }
        this.childPopupElement = undefined
        this.parentPopupElement = undefined
        this.popupElement = undefined
    }

    toggle(pos={x:0,y:0}) {
        if (openPopups.includes(this.id)) {
            this.hide()
            openPopups.remove(this.id)
        } else {
            this.show(pos)
        }
    }

    setParent(parent) {
        this.parentPopupElement = parent.popupElement
        parent.childPopupElement = this.popupElement
    }

    hideOtherSubmenus(newSubmenuId) {
        if (this.childPopupElement) {
            if (newSubmenuId != this.childPopupElement.dataset.id) {
                this.getChildren().forEach((childId)=>{
                    registeredPopups[childId].hide()
                    this.childPopupElement = undefined
                    openPopups.remove(childId)
                })
            }
        }
    }
}

function checkHoveredEntry(parentPopup, entryElement, entry) {
    let elements = document.elementsFromPoint(mousePos.x, mousePos.y)
    if (elements.includes(entryElement)) {
        parentPopup.hideOtherSubmenus("")
        if (entry.submenu) entry.showSubmenu(parentPopup, entryElement)
        
        
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
    execute() {
        executeAction(this.action)
        hideAllMenuPopups()
    }

    showSubmenu(parentPopup, entryElement) {
        if (this.submenu) {
            let rect = entryElement.getBoundingClientRect()
            parentPopup.hideOtherSubmenus(this.action.id)
            registeredPopups[this.action.id].show({x: 4 + rect.x + rect.width, y: rect.y - 2})
            registeredPopups[this.action.id].setParent(parentPopup)
        }

    }
}


document.addEventListener("mousemove", (event)=>{
    mousePos.x = event.clientX
    mousePos.y = event.clientY
})
document.addEventListener("mousedown", (event)=>{
    let elements = document.elementsFromPoint(event.clientX, event.clientY)
    for (let el of openPopups) {
        if (elements.includes(registeredPopups[el].popupElement)) return
    }
    for (let el of popupButtons) {
        if (elements.includes(document.querySelector(el))) return
    }
    hideAllMenuPopups()
})

export function hideAllMenuPopups() {
    openPopups.forEach((el)=>{
        registeredPopups[el].hide()
    })
    openPopups = []
}