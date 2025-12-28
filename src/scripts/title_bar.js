let titlebarLabel = document.querySelector("#title-bar-label")
let minimizeButton = document.querySelector("#button-minimize")
let maximizeButton = document.querySelector("#button-maximize")
let closeButton = document.querySelector("#button-close")

let userAgent = navigator.userAgent
if (userAgent.includes("yarnboard-electron") == false) { //Not an application and runs on web
    minimizeButton.remove()
    maximizeButton.remove()
    closeButton.remove()
} else {
    minimizeButton.addEventListener("click", () => {
        window.yarnboardAPI.minimize()
    })
    maximizeButton.addEventListener("click", () => {
        window.yarnboardAPI.maximize()
    })
    closeButton.addEventListener("click", () => {
        window.yarnboardAPI.close()
    })
    
    localizeString("ui.titlebar.hint.minimize").then(text=>minimizeButton.title = text)
    localizeString("ui.titlebar.hint.maxomize").then(text=>maximizeButton.title = text)
    localizeString("ui.titlebar.hint.close").then(text=>closeButton.title = text)

}
