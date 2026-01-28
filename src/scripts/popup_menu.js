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

export class PopupMenu {
    constructor(id, PopupMenuItems = []) {
        this.id = id
        this.PopupMenuItems = PopupMenuItems
        this.childPopupElement = undefined
        this.parentPopupElement = undefined
        registeredPopups[id] = this
    }
    // FIXME: keep track of opened popup trees and close and open them accordingly. Rn its super easy to close parent when clicking child or opening several children at once. fkn rewrite this shiet
    
    getChildren() {
        var result = []
        if (this.childPopupElement != undefined) {
            result.push(this.childPopupElement)
            let childrenOfChildren = registeredPopups[childPopupElement.dataset.popupId].getChildren()
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
                let bindText = registeredActions[entry.action].currentBind
                if (bindText != "") entryElement.querySelector(".popup-menu-entry-bind").innerText = bindText
            }

            this.bindEntryEvents(entryElement)

            menu.appendChild(entryElement)
        }}

        return element
    }

    bindEntryEvents(element) {
        return
    }


    show(pos={x:0,y:0},isChild=false,parent=undefined) {
        if (openPopups.includes(this.id)) {
            return /*TODO: change to move and check for off screen cases*/
        } else {
            this.popupElement = this.createPopUpElement()
            document.body.appendChild(this.popupElement)
            openPopups.push(this.id)
            this.popupElement.style.left = pos.x + "px"
            this.popupElement.style.top = pos.y + "px"
        }




        // if (this.popupElement != undefined) {
        //     this.hide()
        //     setTimeout(()=>{this.show(pos)}, 1)
        //     return
        // }
        // let popupWrapper = document.createElement("div")
        // popupWrapper.dataset.popupId = this.id
        // popupWrapper.classList.add("popup-menu-wrapper")
        // let menu = document.createElement("div")
        // menu.classList.add("popup-menu")
        // this.PopupMenuItems.forEach((entry)=>{
        //     if (entry == "divider") {
        //         let dividerElement = document.createElement("div")
        //         dividerElement.classList.add("popup-menu-divider")
        //         menu.appendChild(dividerElement)
        //     } else {
        //         let entryElement = document.createElement("div")
        //         entryElement.classList.add("popup-menu-entry")
        //         entryElement.innerHTML = menuEntryTemplate
        //         if (entry.icon != "") {
        //             let iconElement = registeredIcons[entry.icon].getElement(26,26,entryElement)
        //             entryElement.querySelector(".popup-menu-entry-icon").appendChild(iconElement)
        //         }
        //         entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString(entry.title)
        //         if (entry.submenu) {
        //             entry.parent = popupWrapper
        //             entryElement.querySelector(".popup-menu-entry-dropdown").innerText = ">"
        //             entryElement.addEventListener("mousedown", (ev)=>{entry.execute(entryElement, true, popupWrapper)})
        //             entryElement.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkHoveredEntry(ev,entryElement, entry)},250)})
        //             popupWrapper.addEventListener("mouseover", (ev)=>{setTimeout(()=>{checkUnhoveredEntry(ev,entryElement, entry, popupWrapper)},250)})
        //         } else {
        //             if (Object.keys(registeredActions).includes(entry.action) && registeredActions[entry.action].currentBind != "") {
        //                 // TODO: exchange for fancy getter so its formatted
        //                 entryElement.querySelector(".popup-menu-entry-bind").innerText = registeredActions[entry.action].currentBind
        //             }
        //             entryElement.addEventListener("mousedown", (ev)=>{
        //                 entry.execute()
        //                 document.body.removeChild(popupWrapper)
        //                 this.popupElement = undefined
        //             }, {once:true})
        //         }
        //         menu.appendChild(entryElement)
        //     }
        // })
        // if (this.PopupMenuItems.length == 0) {
        //     let entryElement = document.createElement("div")
        //     entryElement.classList.add("popup-menu-entry")
        //     entryElement.innerHTML = menuEntryTemplate
        //     entryElement.querySelector(".popup-menu-entry-text").innerText = localizeString("popup.emptylist")
        //     entryElement.addEventListener("mousedown", (ev)=>{
        //         document.body.removeChild(popupWrapper)
        //         this.popupElement = undefined
        //     }, {once:true})
        //     menu.appendChild(entryElement)
        // }
        // popupWrapper.appendChild(panel)
        // popupWrapper.appendChild(menu)
        // popupWrapper.style.left = String(pos.x) + "px"
        // popupWrapper.style.top = String(pos.y) + "px"
        // this.popupElement = popupWrapper
        // if (isChild && parent!=undefined) {
        //     parent.appendChild(this.popupElement)
        // } else {
        //     document.body.appendChild(this.popupElement)
        // }
        // setTimeout(
        // ()=>{document.addEventListener("mousedown", (ev)=>{removeOnOutsideClick(ev, this)}, {once:true})},
        // 1)
    }

    hide() {
        if (Array.from(document.body.children).includes(this.popupElement)) document.body.removeChild(this.popupElement)
        if (openPopups.includes(this.id)) openPopups.splice(openPopups.indexOf(this.id))
        this.popupElement = undefined
    }

    toggle(pos={x:0,y:0}) {
        if (openPopups.includes(this.id)) {
            this.hide()
        } else {
            this.show(pos)
        }
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
        if (this.submenu) {
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

document.addEventListener("mousemove", (event)=>{
    mousePos.x = event.clientX
    mousePos.y = event.clientY
})

document.addEventListener("mousedown", (event)=>{
    let elements = document.elementsFromPoint(event.clientX, event.clientY)
    for (let el of openPopups) {
        if (elements.includes(registeredPopups[el].popupElement)) return
    }
    for (let el of openPopups) {
        registeredPopups[el].hide()
    }
    openPopups = []
})