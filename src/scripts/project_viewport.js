import { releaseContext, setContext } from "./keybinds.js"
import { registeredPopups } from "./popup_menu.js"
import { registeredIcons } from "./icon_manager.js"
import { createBlankProjectData, openProjects } from "./project_data.js"

var inputElement = undefined
var gridElement = undefined
var elementsElement = undefined
var pointerElement = undefined
var statsPos = undefined
var statsScale = undefined
var grabbing = false
export var projectId = ""

export var viewPanningMult = {x:1,y:1}

const transforms = {
    zoomLevel: 0,
    scale : 1.0,
    offset : {
        x: 0,
        y: 0
    },
    oldOffset: {
        x: 0,
        y: 0
    },
    mouseOffset : {
        x: 0,
        y: 0
    },
    size: {
        x: 0,
        y: 0
    }
}

document.addEventListener("mouseup", (ev) => {
    if (ev.button == 1) {
        if (grabbing) {
            releaseContext()
            SetCursorPos()
            document.exitPointerLock()
            pointerElement.innerHTML = ""
            viewPanningMult = {x:1,y:1}
            openProjects[projectId].viewportTransforms.oldOffset.x = openProjects[projectId].viewportTransforms.offset.x
            openProjects[projectId].viewportTransforms.oldOffset.y = openProjects[projectId].viewportTransforms.offset.y
        }
        grabbing = false
        // gridElement.style.transitionProperty = "background-image, background-position, background-size"
    }
})

function updateViewport() {
    // updateBackground()
    updateElements()
    updateGrid()
    if (!grabbing) {
        statsPos.textContent = "X:" + parseInt((-openProjects[projectId].viewportTransforms.offset.x + openProjects[projectId].viewportTransforms.mouseOffset.x) * 1/openProjects[projectId].viewportTransforms.scale) + " Y:" + parseInt((-openProjects[projectId].viewportTransforms.offset.y + openProjects[projectId].viewportTransforms.mouseOffset.y) * 1/openProjects[projectId].viewportTransforms.scale)
    }
    statsScale.textContent = "zoom: " + (openProjects[projectId].viewportTransforms.scale * 100).toFixed(3) + "%"
}

function updateElements() {
    elementsElement.style.translate = openProjects[projectId].viewportTransforms.offset.x + "px " + openProjects[projectId].viewportTransforms.offset.y + "px"
    elementsElement.style.scale = openProjects[projectId].viewportTransforms.scale
    document.querySelector(":root").style.setProperty("--outline-scale", 1 / openProjects[projectId].viewportTransforms.scale)
}

function updateGrid() {
    gridElement.style.backgroundPosition = openProjects[projectId].viewportTransforms.offset.x + "px " + openProjects[projectId].viewportTransforms.offset.y + "px"
    gridElement.style.backgroundSize = wrapCellSize(openProjects[projectId].viewportTransforms.scale) * 100 + "px " + wrapCellSize(openProjects[projectId].viewportTransforms.scale) * 100 + "px"
}
function wrapCellSize(scale, min = 1, max = 5) {
  const mod = (a, b) => ((a % b) + b) % b;
  return min * Math.exp(mod(Math.log(scale / min), Math.log(max / min)));
}

function zoom(ev, factor) {
    if ((!(openProjects[projectId].viewportTransforms.zoomLevel < 75) && factor > 0) || (!(openProjects[projectId].viewportTransforms.zoomLevel > -50) && factor < 0)) {
        return
    }
    openProjects[projectId].viewportTransforms.zoomLevel += factor
    let newScale = Math.pow(1.1,openProjects[projectId].viewportTransforms.zoomLevel)
    openProjects[projectId].viewportTransforms.scale = newScale
    var mousePos = {
        x: ev.layerX,
        y: ev.layerY
    }
    var newOffset = {
        x: mousePos.x - (mousePos.x - openProjects[projectId].viewportTransforms.offset.x) * Math.pow(1.1,factor),
        y: mousePos.y - (mousePos.y - openProjects[projectId].viewportTransforms.offset.y) * Math.pow(1.1,factor)
    }
    var newOldOffset = { /* XD */
        x: mousePos.x - (mousePos.x - openProjects[projectId].viewportTransforms.oldOffset.x) * Math.pow(1.1,factor),
        y: mousePos.y - (mousePos.y - openProjects[projectId].viewportTransforms.oldOffset.y) * Math.pow(1.1,factor)
    }
    openProjects[projectId].viewportTransforms.offset = newOffset
    openProjects[projectId].viewportTransforms.oldOffset = newOldOffset
    updateViewport()
}

export function bindEvents(viewportElement) {
    inputElement = viewportElement.querySelector(".project-cover.project-input")
    gridElement = viewportElement.querySelector(".project-cover.project-grid")
    elementsElement = viewportElement.querySelector(".project-cover.project-elements")
    statsPos = viewportElement.querySelector(".viewport-position")
    statsScale = viewportElement.querySelector(".viewport-scale")
    pointerElement = viewportElement.querySelector(".viewport-pointer-image")

    inputElement.addEventListener("wheel", wheelEvent)
    inputElement.addEventListener("mousedown", mouseDownEvent)
    inputElement.addEventListener("mouseup", mouseUpEvent)
    inputElement.addEventListener("mousemove", mouseMoveEvent)
    inputElement.addEventListener("click", mouseClickEvent)

    setContext("board")
    // if viewport
}

export function unbindEvents(viewportElement) {
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("wheel", wheelEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mousedown", mouseDownEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mouseup", mouseUpEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mousemove", mouseMoveEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("click", mouseClickEvent)
    setContext("default")
}
function wheelEvent(ev) {
    if (ev.deltaY > 0) {
        zoom(ev, -1)
    } else {
        zoom(ev, 1)
    }
}
function mouseDownEvent(ev) {
    if (ev.button == 1) {
        grabbing = true
        setContext("view_panning")
        totalPointerMovement = {x:0,y:0}
        startingPointerPosition = {x:ev.layerX,y:ev.layerY}
        inputElement.requestPointerLock()
        moveLockedPointerImage()
        pointerElement.appendChild(registeredIcons["icon.pointer.view.pan"].getElement(30,30,pointerElement))
    }
}

document.addEventListener("pointerlockchange", (_ev) => {
    if (!document.pointerLockElement && grabbing) cancelViewPanning()
})

function mouseUpEvent(ev) {
    if (ev.which == 3) {
        // test if clicked on any of the elements or connections or selection is active
        registeredPopups["popup.project.addelement"].show({x:ev.clientX,y:ev.clientY})
    }
}
function mouseMoveEvent(ev) {
    let rect = inputElement.getBoundingClientRect()
    openProjects[projectId].viewportTransforms.size.x = rect.width
    openProjects[projectId].viewportTransforms.size.y = rect.height
    openProjects[projectId].viewportTransforms.mouseOffset.x = ev.offsetX
    openProjects[projectId].viewportTransforms.mouseOffset.y = ev.offsetY
    if (grabbing) {
        processLockedPointer(ev)
    }
    updateViewport()

}
function mouseClickEvent(ev) {
    // console.log(ev)
}

export function projectViewportId(id) {
    projectId = id
    if (Object.keys(openProjects).includes(id)) {
        return
    }
    // TODO: project save data loading
    createBlankProjectData(id)
    openProjects[id].viewportTransforms = structuredClone(transforms)
}

export function getScale() {
    return openProjects[projectId].viewportTransforms.scale
}
export function getScreenRect() {
    let rect = {
        x: -openProjects[projectId].viewportTransforms.offset.x / getScale(),
        y: -openProjects[projectId].viewportTransforms.offset.y / getScale(),
        w: inputElement.getBoundingClientRect().width / getScale(),
        h: inputElement.getBoundingClientRect().height / getScale(),
    }
    return rect
}

export function resetView() {
    openProjects[projectId].viewportTransforms = structuredClone(transforms)
    updateViewport()
}



// #region: locked pointer tracking

var totalPointerMovement = {x:0,y:0}
var startingPointerPosition = {x:0,y:0}

function processLockedPointer(event) {
    totalPointerMovement.x += event.movementX
    totalPointerMovement.y += event.movementY
    openProjects[projectId].viewportTransforms.offset.x = openProjects[projectId].viewportTransforms.oldOffset.x + totalPointerMovement.x * viewPanningMult.x
    openProjects[projectId].viewportTransforms.offset.y = openProjects[projectId].viewportTransforms.oldOffset.y + totalPointerMovement.y * viewPanningMult.y
    moveLockedPointerImage()
}

function moveLockedPointerImage() {
    var newPos = {
        x: startingPointerPosition.x + totalPointerMovement.x,
        y: startingPointerPosition.y + totalPointerMovement.y
    }
    let projectRect = inputElement.getBoundingClientRect()
    if (newPos.x > (projectRect.width)) {
        newPos.x = newPos.x%projectRect.width
    } else if (newPos.x < 0) {
        newPos.x = projectRect.width+(newPos.x%projectRect.width)
    }
    if (newPos.y > (projectRect.height)) {
        newPos.y = newPos.y%projectRect.height
    } else if (newPos.y < 0) {
        newPos.y = projectRect.height+(newPos.y%projectRect.height)
    }
    pointerElement.style.left = (newPos.x - 15)+"px"
    pointerElement.style.top = (newPos.y - 15)+"px"
    statsPos.textContent = "X:" + parseInt(totalPointerMovement.x * viewPanningMult.x) + " Y:" + parseInt(totalPointerMovement.y * viewPanningMult.y)
}

function SetCursorPos() {
    var newPos = {
        x: startingPointerPosition.x + totalPointerMovement.x,
        y: startingPointerPosition.y + totalPointerMovement.y
    }
    let projectRect = inputElement.getBoundingClientRect()
    if (newPos.x > (projectRect.width)) {
        newPos.x = newPos.x%projectRect.width
    } else if (newPos.x < 0) {
        newPos.x = projectRect.width+(newPos.x%projectRect.width)
    }
    if (newPos.y > (projectRect.height)) {
        newPos.y = newPos.y%projectRect.height
    } else if (newPos.y < 0) {
        newPos.y = projectRect.height+(newPos.y%projectRect.height)
    }
    window.yarnboardAPI.setMouseScreenPos({
        x:newPos.x+projectRect.x,
        y:newPos.y+projectRect.y
    })
}

export function lockPanAxis(xAxis = true) {
    if (xAxis) {
        viewPanningMult.y == 0 ? viewPanningMult.y = 1 : viewPanningMult.y = 0
        viewPanningMult.x = 1
    } else {
        viewPanningMult.x == 0 ? viewPanningMult.x = 1 : viewPanningMult.x = 0
        viewPanningMult.y = 1
    }
    openProjects[projectId].viewportTransforms.offset.x = openProjects[projectId].viewportTransforms.oldOffset.x + totalPointerMovement.x * viewPanningMult.x
    openProjects[projectId].viewportTransforms.offset.y = openProjects[projectId].viewportTransforms.oldOffset.y + totalPointerMovement.y * viewPanningMult.y
    statsPos.textContent = "X:" + parseInt(totalPointerMovement.x * viewPanningMult.x) + " Y:" + parseInt(totalPointerMovement.y * viewPanningMult.y)
    updateViewport()
}
export function cancelViewPanning() {
    grabbing = false
    SetCursorPos()
    totalPointerMovement = {x:0,y:0}
    releaseContext()
    pointerElement.innerHTML = ""
    viewPanningMult = {x:1,y:1}
    openProjects[projectId].viewportTransforms.offset.x = openProjects[projectId].viewportTransforms.oldOffset.x
    openProjects[projectId].viewportTransforms.offset.y = openProjects[projectId].viewportTransforms.oldOffset.y
    updateViewport()
}
//  #endregion