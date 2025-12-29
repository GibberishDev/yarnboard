import {registeredActions, executeAction, inputText} from "./keybinds.js"

const paletteWrapper = document.querySelector("#command-palette-wrapper")
const paletteElement = document.querySelector("#command-palette")
const searchElement = document.querySelector("#command-palette-search")
const actionsListElement = document.querySelector("#command-palette-actions-list")
const elementsListElement = document.querySelector("#command-palette-elements-list")

var actionsNames = {}

searchElement.addEventListener("input", search)
searchElement.addEventListener("focus", ()=>{inputText(true)})
searchElement.addEventListener("blur", ()=>{inputText(false)})

export async function togglePalette(actionList = false) {
    restartAnimations(paletteWrapper)
    restartAnimations(paletteElement)
    restartAnimations(document.querySelector("#command-palette-panel"))
    if (paletteWrapper.classList.contains("shown")) {
        paletteWrapper.classList.remove("shown")
        paletteWrapper.classList.add("hidden")
        searchElement.blur()
        document.removeEventListener('mousedown', hideOnOutsideClick)
        actionsListElement.innerHTML = ""
        elementsListElement.innerHTML = ""
    } else {
        searchElement.value = ""
        populateActionsList()
        paletteWrapper.classList.remove("hidden")
        paletteWrapper.classList.add("shown")
        searchElement.focus()
        if (actionList) {
            searchElement.value = ">"
        }
        document.addEventListener('mousedown', hideOnOutsideClick)
    }
}

function hideOnOutsideClick(event) {
    let elements = document.elementsFromPoint(event.clientX, event.clientY)
    if (!elements.includes(paletteWrapper)) {
        togglePalette()
        document.removeEventListener('mousedown', hideOnOutsideClick)
    }
}

function populateActionsList() {
    let actionsList = Object.keys(registeredActions)
    for (let i=0;i<actionsList.length;i++) {
        let id = actionsList[i]
        let element = document.createElement("div")
        element.classList.add("command-palette-item")
        element.dataset.id = id
        element.dataset.search_score = 0
        localizeString(id).then((responce) => {
            element.textContent = responce
            actionsNames[responce] = id
        })
        element.addEventListener("click", (ev) => {
            executeAction(element.dataset.id)
            togglePalette()
        })
        actionsListElement.appendChild(element)
    }
}

function search() {
    var searchTerm = searchElement.value
    if (searchTerm.indexOf(">") == 0) {searchTerm = searchTerm.replace(">","")}
    if (searchTerm == "") {
        showAllElements()
        return
    }
    let searchArray = Object.keys(actionsNames)
    var searchResult = fuzzySearchStringArray(searchArray, searchTerm,0.4)
    hideAllElements()
    for (let i = searchResult.length - 1; i>=0;i--) {
        showElement(actionsNames[searchResult[i][0]], searchResult[i][1])
    }

}

function hideAllElements() {
    for (let i=0;i<actionsListElement.children.length;i++){
        actionsListElement.children[i].style.display = "none"
    }
}

function showAllElements() {
    for (let i=0;i<actionsListElement.children.length;i++){
        actionsListElement.children[i].style.display = ""
    }
}

function showElement(id, score) {
    let element = document.querySelector("[data-id='"+ id + "']")
    element.dataset.search_score = score
    element.style.display = ""
    actionsListElement.insertBefore(element, actionsListElement.firstChild)
}

function sortActionsAlphabetically() {
    
}