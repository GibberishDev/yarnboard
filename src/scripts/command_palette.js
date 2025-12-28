import {registeredActions, executeAction} from "./keybinds.js"

const paletteWrapper = document.querySelector("#command-palette-wrapper")
const paletteElement = document.querySelector("#command-palette")
const searchElement = document.querySelector("#command-palette-search")
const actionsListElement = document.querySelector("#command-palette-actions-list")
const elementsListElement = document.querySelector("#command-palette-elements-list")

export async function togglePalette() {
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
        populateActionsList()
        paletteWrapper.classList.remove("hidden")
        paletteWrapper.classList.add("shown")
        searchElement.focus()
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
        localizeString(id).then((responce) => {element.textContent = responce})
        element.addEventListener("click", (ev) => {
            executeAction(element.dataset.id)
            togglePalette()
        })
        actionsListElement.appendChild(element)
    }
}