import { update } from "./settings_menu.js"
import { getSetting, bindSearchEvents } from "./settings_menu.js"

export var openWindows = []
var openWindowsLastTime = ""
var selectedID = ""
var selectedIdHistory = []
var appWindowIds = [
    "settings",
]
var autoScrollMult = 0
var autoScroll = false
let edgeThreshold = 75 //Maybe make it a setting

class YarnboardWindow {
    constructor(id, displayName, saveLocation) {
        this.id = id
        this.displayName = displayName
        this.saveLocation = saveLocation
    }
}

function getBlankProject(id) {
    return new YarnboardWindow(id, "Untitled board", "null")
}

let tabBar = document.querySelector("#tab-bar")

tabBar.addEventListener("wheel", (event) => {
    scrollTabs(event)
})

function updateTabs() {
    if (openWindows.toString() !== openWindowsLastTime.toString()) {
        tabBar.innerHTML = ""
        openWindows.forEach((windowId) => {
            var tabElement = document.createElement("div")
            tabElement.innerHTML = document.querySelector("#tab-template").innerHTML
            tabElement.classList.add("tab")
            tabElement.querySelector(".tab-title").textContent = windowId
            tabElement.id = "tab-id-" + windowId
            bindTabEvents(tabElement)
            tabBar.appendChild(tabElement)
        })
    }
    openWindowsLastTime = openWindows.toString()
    if ((tabBar.childElementCount < 2 && getSetting("setting.interface.hidetabbar") == true) || tabBar.childElementCount < 1) {
        tabBar.classList.add("hidden")
    } else {
        tabBar.classList.remove("hidden")
    }
    if (tabBar.childElementCount >= 1) {
        if (selectedID != "") {
            if (document.querySelectorAll(".active-tab")[0] != undefined) {
                document.querySelectorAll(".active-tab").forEach(el=>el.classList.remove("active-tab"))
            }
            let tab = document.querySelector("#tab-id-"+selectedID)
            if (tab != null) {
                tab.classList.add("active-tab")
            } else {
                tabBar.children[0].classList.add("active-tab")
                selectedID = tabBar.children[0].id.replace("tab-id-", "")
            }
        } else {
            tabBar.children[0].classList.add("active-tab")
            selectedID = tabBar.children[0].id.replace("tab-id-", "")
        }
    } else {
        selectedID = ""
    }
}

window.onresize = (ev) => {scrollTabs()}

// TODO: scroll to tab

function scrollToTab(id) {
    let containerBoundingRect = document.querySelector("#window-container").getBoundingClientRect()
    if (tabBar.getBoundingClientRect().width <= containerBoundingRect.width) {
        tabBar.style.removeProperty("translate")
        return
    }
    let currentScroll = Math.abs(parseInt(tabBar.style.getPropertyValue("translate")))
    if (isNaN(currentScroll)) {currentScroll = 0}
    let maxScroll = tabBar.getBoundingClientRect().width - containerBoundingRect.width
    var tabRect = document.querySelector("#tab-id-" + id).getBoundingClientRect()
    var tabLeftOffest = document.querySelector("#tab-id-" + id).offsetLeft
    var tabRightOffest = tabLeftOffest + tabRect.width
    var wishScroll = 0
    var isToRight = (tabRightOffest-currentScroll) >= (containerBoundingRect.width + 2)
    var isToLeft = tabLeftOffest < currentScroll
    if (!isToLeft && !isToRight) {
        return
    }
    if (isToRight) {
        wishScroll = tabLeftOffest + tabRect.width - containerBoundingRect.width
    }
    if (isToLeft) {
        wishScroll = tabLeftOffest
    }
    if (wishScroll < 0) {
        tabBar.style.removeProperty("translate")
    } else if (wishScroll > maxScroll) {
        tabBar.style.setProperty("translate",String(-maxScroll) + "px")
    } else {
        tabBar.style.setProperty("translate",String(-wishScroll) + "px")
    }

}

function scrollTabs(ev = null) {
    let containerBoundingRect = document.querySelector("#window-container").getBoundingClientRect()
    if (ev == null && tabBar.getBoundingClientRect().width <= containerBoundingRect.width) {
        tabBar.style.removeProperty("translate")
        return
    }
    let currentScroll = Math.abs(parseInt(tabBar.style.getPropertyValue("translate")))
    if (isNaN(currentScroll)) {currentScroll = 0}
    let maxScroll = tabBar.getBoundingClientRect().width - containerBoundingRect.width
    var wishScroll = 0
    if (ev != null) {
        wishScroll = currentScroll + ev.deltaY
    } else {
        wishScroll = currentScroll
    }
    if (wishScroll < 0) {
        tabBar.style.removeProperty("translate")
    } else if (wishScroll > maxScroll) {
        tabBar.style.setProperty("translate",String(-maxScroll) + "px")
    } else {
        tabBar.style.setProperty("translate",String(-wishScroll) + "px")
    }
}

function bindTabEvents(tab) {
    tab.addEventListener("click", () => {
        selectId(tab.id.replace("tab-id-", ""))
    })
    tab.addEventListener("mouseup", (ev) => {
        if (ev.which == 2) {
            closeWindow(tab.id.replace("tab-id-", ""))
        }
    })
    tab.querySelector(".tab-button").addEventListener("click", () => {
        closeWindow(tab.id.replace("tab-id-", ""))
    })
    tab.addEventListener("drag", (ev) => {
        tabDrag(ev)
    })
    tab.addEventListener("dragstart", (ev) => {
        tabDrag(ev)
    })
    tab.addEventListener("dragend", (ev) => {
        tabDrag(ev)
    })
}

export function createWindow(id) {
    if (openWindows.includes(id)) {
        // switch to opened window
        selectId(id)
        return
    } else {
        openWindows.push(id)
        // open corresponding project window
        openWindowViewport(id)
        selectId(id)
    }
}

function closeWindow(id) {
    if (openWindows.includes(id)) {
        // check if unsaved
        if (selectedIdHistory.includes(id)) {selectedIdHistory.splice(selectedIdHistory.indexOf(id),1)}
        openWindows.splice(openWindows.indexOf(id),1)
        closeViewport(id)
        if (selectedID == id) {
            selectId(selectedIdHistory[selectedIdHistory.length - 1])
        }
        updateTabs()
        scrollTabs()
    } else {
        console.error("ERROR: cannot close window with id " + id + " - no such window open")
    }
}

function openWindowViewport(id, path="") {
    if (appWindowIds.includes(id)) {
        var viewportElement = document.createElement("div")
        viewportElement.id = "viewport-id-" + id
        viewportElement.classList.add("viewport")
        document.querySelectorAll(".current-viewport").forEach((el)=>{
            el.classList.remove("current-viewport")
        })
        viewportElement.classList.add("current-viewport")
        document.querySelector("#viewport").appendChild(viewportElement)
        switch (id) {
            case "settings" : {
                viewportElement.innerHTML = SETTINGS_TEMPLATE
                bindSearchEvents(document.querySelector("#settings-search"))
                update()
            }
        }

    } else if (isUUID(id)) {
        var viewportElement = document.createElement("div")
        viewportElement.id = "viewport-id-" + id
        viewportElement.classList.add("viewport")
        document.querySelectorAll(".current-viewport").forEach((el)=>{
            el.classList.remove("current-viewport")
        })
        viewportElement.classList.add("current-viewport")
        document.querySelector("#viewport").appendChild(viewportElement)
        if (path!= "") {
            return
        } else {
            return
        }

    }
}

function updateViewports() {
    let viewportSelectedId = "viewport-id-" + selectedID
    document.querySelectorAll(".current-viewport").forEach((el)=>{
        el.classList.remove("current-viewport")
    })
    if (document.querySelector("#" + viewportSelectedId) == null) {
        if (document.querySelector("#viewport").childElementCount > 0) {
            document.querySelector("#viewport").children[0].classList.add("current-viewport")
        }
    } else {
        document.querySelector("#" + viewportSelectedId).classList.add("current-viewport")
    }
}

function closeViewport(id) {
    document.querySelector("#viewport-id-"+id).remove()
    updateViewports()
}

function selectId(id) {
    if (selectedIdHistory.includes(id)) {
        selectedIdHistory.push(selectedIdHistory.splice(selectedIdHistory.indexOf(id), 1)[0])
    } else {
        selectedIdHistory.push(id)
    }
    selectedID = id
    updateTabs()
    updateViewports()
    scrollToTab(id)
}

document.addEventListener("ready", (ev)=>{
    updateTabs()
})

const SETTINGS_TEMPLATE = `<div id="settings-viewport">
    <div id="settings-title">Settings</div>
    <input type="text" id="settings-search" placeholder="Search…" spellcheck="false">
    <div id="settings-sidebar">
    </div>
    <div id="settings-panel">
    </div>
</div>`


export function openSettings() {
    if (openWindows.includes("settings")) {
        selectId("settings")
    } else {
        createWindow("settings")
    }
}

export function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id)
}

function tabDrag(event) {
    if (event.type == "dragstart") {
        selectId(event.target.id.replace("tab-id-", ""))
        autoScroll = true
        smoothScroll()
    } else if (event.type == "dragend"){
        autoScrollMult = 0
        autoScroll = false
        reorderTabs(event, true)
        return
    } else if (event.x != 0) {
        if (event.x < edgeThreshold) {
            autoScrollMult = -1 + (event.x / edgeThreshold)
        } else if (event.x > document.querySelector("#window-container").getBoundingClientRect().width - edgeThreshold) {
            autoScrollMult =  1 - ((document.querySelector("#window-container").getBoundingClientRect().width - event.x) / edgeThreshold)
        } else {
            autoScrollMult = 0
        }
        reorderTabs(event, false)
    }
}

function smoothScroll() {
    if (autoScroll) {
        setTimeout(smoothScroll, 50)
    }
    var currentScroll = Math.abs(parseInt(tabBar.style.getPropertyValue("translate")))
    if (isNaN(currentScroll)) currentScroll = 0
    var wishScroll = currentScroll + (75 * autoScrollMult)
    var maxScroll = tabBar.getBoundingClientRect().width - document.querySelector("#window-container").getBoundingClientRect().width
    if (autoScrollMult < 0) {
        wishScroll = Math.max(0, wishScroll)
    } else if (autoScrollMult > 0) {
        wishScroll = Math.min(maxScroll, wishScroll)
    } else {
        wishScroll = currentScroll
    }
    tabBar.style.setProperty("translate", -wishScroll + "px")
}

function reorderTabs(event, drop) {
    let dropPoint = event.x
    let dropTab = event.target
    var tabs = tabBar.children
    var dropBefore = undefined
    var dropAfter = undefined
    for (let tab of tabs) {
        tab.classList.remove("insert-left","insert-right")
        let rect = tab.getBoundingClientRect()
        let tabWidth = rect.width
        let tabPos = rect.x
        if (dropPoint > tabPos &&
        dropPoint < tabPos + tabWidth/2.0) {
            tab.classList.add("insert-left")
            dropBefore = tab
        } else if (dropPoint > tabPos + tabWidth/2.0 && (dropPoint < tabPos + tabWidth ||tabWidth && tabBar.lastElementChild == tab)) {
            tab.classList.add("insert-right")
            dropAfter = tab
        }
    }
    if (drop) {
        document.querySelectorAll(".insert-left").forEach(el=>el.classList.remove("insert-left"))
        document.querySelectorAll(".insert-right").forEach(el=>el.classList.remove("insert-right"))
        if (dropBefore != undefined) {
            tabBar.insertBefore(dropTab, dropBefore)
        } else if (dropAfter != undefined) {
            tabBar.insertBefore(dropTab, dropAfter.nextSibling)
        }
        let newOrder = []
        for (let el of document.querySelectorAll('#tab-bar .tab')) newOrder.push(el.id.replace("tab-id-",""))
        console.log(newOrder)
        openWindows = newOrder
    }
}

document.addEventListener("settingUpdated", (ev) => {
    if (ev.id == "setting.interface.hidetabbar") {
        updateTabs()
    }
})

export function closeCurrent() {
    closeWindow(selectedID)
}