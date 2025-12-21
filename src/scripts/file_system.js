var openProjects = []
var selectedProjectId = "" 

class Project {
    constructor(id, displayName, saveLocation) {
        this.id = id
        this.displayName = displayName
        this.saveLocation = saveLocation
    }
}

function getBlankProject() {
    let id = uuidv4()
    return new Project(id, "Untitled board", "null")
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

function update_tabs() {
    tabBar.innerHTML = ""
    openProjects.forEach((project) => {
        var tabElement = document.createElement("div")
        tabElement.classList.add("tab")
        tabElement.innerText = project.displayName
        tabElement.id = "tab-id-" + project.id
        bindTabEvents(tabElement)
        tabBar.appendChild(tabElement)
    })
    if (selectedProjectId != "") {
        let tab = document.querySelector("#tab-id-"+selectedProjectId)
        console.log(tabBar, tab)
        if (tab != null) {
            tab.classList.add("active-tab")
        } else {
            tabBar.children[0].classList.add("active-tab")
            selectedProjectId = tabBar.children[0].id.replace("tab-id-", "")
        }
    } else {
        tabBar.children[0].classList.add("active-tab")
        selectedProjectId = tabBar.children[0].id.replace("tab-id-", "")
    }
}

window.onresize = (ev) => {scrollTabs()}

function scrollTabs(ev = null) {
    containerBoundingRect = document.querySelector("#project-container").getBoundingClientRect()
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
    tab.addEventListener("click", (ev) => {
        selectedProjectId = tab.id.replace("tab-id-", "")
        update_tabs()
    })
}
for (let i = 0; i < 20; i++) {
    openProjects.push(getBlankProject())
}
openProjects.push(new Project(uuidv4(), "Very long and certainly interesting name xd", ""))
update_tabs()