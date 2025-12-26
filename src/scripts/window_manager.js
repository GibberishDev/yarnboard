var openWindows = []
var selectedID = ""
var selectedIdHistory = []

class YarnboardWindow {
    constructor(id, displayName, saveLocation) {
        this.id = id
        this.displayName = displayName
        this.saveLocation = saveLocation
    }
}

function getBlankProject() {
    let id = uuidv4()
    return new YarnboardWindow(id, "Untitled board", "null")
}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

let tabBar = document.querySelector("#tab-bar")
tabBar.addEventListener("wheel", (event) => {
    scrollTabs(event)
})

function updateTabs() {
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
    if (tabBar.childElementCount < 2) {
        tabBar.classList.add("hidden")
    } else {
        tabBar.classList.remove("hidden")
    }
    if (tabBar.childElementCount > 1) {
        if (selectedID != "") {
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
    containerBoundingRect = document.querySelector("#window-container").getBoundingClientRect()
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
    console.log(isToLeft, isToRight)
    if (!isToLeft && !isToRight) {
        return
    }
    if (isToRight) {
        console.log("Right ", tabLeftOffest, tabRightOffest, currentScroll, containerBoundingRect.width)
        wishScroll = tabLeftOffest + tabRect.width - containerBoundingRect.width
    }
    if (isToLeft) {
        console.log("Left ", tabRightOffest, currentScroll)
        wishScroll = tabLeftOffest
    }
    console.log(wishScroll)
    if (wishScroll < 0) {
        tabBar.style.removeProperty("translate")
    } else if (wishScroll > maxScroll) {
        tabBar.style.setProperty("translate",String(-maxScroll) + "px")
    } else {
        tabBar.style.setProperty("translate",String(-wishScroll) + "px")
    }

}

function scrollTabs(ev = null) {
    containerBoundingRect = document.querySelector("#window-container").getBoundingClientRect()
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
}

function createWindow(id) {
    if (openWindows.includes(id)) {
        // switch to opened window
        selectId(id)
        updateTabs()
        return
    } else {
        openWindows.push(id)
        // open corresponding project window
        openWindowViewport(id)
        selectId(id)
        updateTabs()
    }
}

function closeWindow(id) {
    if (openWindows.includes(id)) {
        // check if unsaved
        if (selectedIdHistory.includes(id)) {selectedIdHistory.splice(selectedIdHistory.indexOf(id),1)}
        if (selectedID == id) {
            // Switch to last history item
            selectedID = ""
        }
        openWindows.splice(openWindows.indexOf(id),1)
        closeViewport(id)
        updateTabs()
    } else {
        console.error("ERROR: cannot close window with id " + id + " - no such window open")
    }
}

function openWindowViewport(id) {
    //TODO: if id is absent in the known id list and not found in loaded projects list drop it
    if (true) {
        var viewportElement = document.createElement("div")
        viewportElement.id = "viewport-id-" + id
        viewportElement.classList.add("viewport")
        document.querySelectorAll(".current-viewport").forEach((el)=>{
            el.classList.remove("current-viewport")
        })
        viewportElement.classList.add("current-viewport")
        document.querySelector("#viewport").appendChild(viewportElement)
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

updateTabs()


