import {registeredActions} from "./keybinds.js"

const paletteWrapper = document.querySelector("#command-palette-wrapper")
const paletteElement = document.querySelector("#command-palette")
const searchElement = document.querySelector("#command-palette-search")
const actionsListElement = document.querySelector("#command-palette-actions-list")

export function togglePalette() {
    paletteWrapper.classList.toggle("shown")
    paletteWrapper.classList.toggle("hidden")
    restartAnimations(paletteWrapper)
    restartAnimations(paletteElement)
    restartAnimations(document.querySelector("#command-palette-panel"))
}
function hidepalette() {
    
}