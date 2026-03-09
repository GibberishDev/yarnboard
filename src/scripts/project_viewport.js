// #region Imports
import { currentInputContext, releaseContext, setContext } from "./keybinds.js"
import { registeredPopups } from "./popup_menu.js"
import { registeredIcons } from "./icon_manager.js"
import { createBlankProjectData, openProjects } from "./project_data.js"
import { deselectAll, getMiddlePoint, selectedElements, selectElement, toggleElementSelection } from "./selection.js"
import { DEFAULT_TRANSFORMS, Element, ELEMENT_TYPES } from "./elements.js"
// #endregion

// #region Variables
var inputMousePos = {x:0,y:0}
var inputElement = undefined
var gridElement = undefined
var elementsElement = undefined
var pointerElement = undefined
var statsPos = undefined
var statsScale = undefined
var viewPanning = false
var elementTransformState = null
var rotateStartingAngle = 0

export var projectId = ""
export var viewPanningMult = {x:1,y:1}
export var elementTransformMult = {x:1,y:1}

export const TRANSFORM_STATES = Object.freeze({
    NONE: 0,
    DRAG: 1,
    SCALE: 2,
    ROTATE: 3
})
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
// #endregion


function updateViewport() {
    // updateBackground()
    updateElements()
    updateGrid()
    if (!viewPanning) {
        statsPos.textContent = "X:" + parseInt((-openProjects[projectId].viewportTransforms.offset.x + openProjects[projectId].viewportTransforms.mouseOffset.x) * 1/openProjects[projectId].viewportTransforms.scale) + " Y:" + parseInt((-openProjects[projectId].viewportTransforms.offset.y + openProjects[projectId].viewportTransforms.mouseOffset.y) * 1/openProjects[projectId].viewportTransforms.scale)
    }
    statsScale.textContent = "zoom: " + (openProjects[projectId].viewportTransforms.scale * 100).toFixed(3) + "%"
}

function updateElements() {
    elementsElement.style.translate = openProjects[projectId].viewportTransforms.offset.x + "px " + openProjects[projectId].viewportTransforms.offset.y + "px"
    elementsElement.style.scale = openProjects[projectId].viewportTransforms.scale
    document.querySelector(":root").style.setProperty("--var-outline-scale", 1 / openProjects[projectId].viewportTransforms.scale)
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

    setContext("board")
}

export function unbindEvents(viewportElement) {
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("wheel", wheelEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mousedown", mouseDownEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mouseup", mouseUpEvent)
    viewportElement.querySelector(".project-cover.project-input").removeEventListener("mousemove", mouseMoveEvent)
    setContext("default")
}

export function projectViewportId(id) {
    projectId = id
    if (Object.keys(openProjects).includes(id)) {
        return
    }
    // TODO: project save data loading
    createBlankProjectData(id)
    openProjects[id].viewportTransforms = structuredClone(transforms)
    openProjects[id].elementsData.addElement(new Element("default_text", ELEMENT_TYPES.TEXT,DEFAULT_TRANSFORMS,{text:"New Project"}))
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

function setPointerPos() {
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
    viewPanning = false
    setPointerPos()
    totalPointerMovement = {x:0,y:0}
    releaseContext()
    pointerElement.innerHTML = ""
    viewPanningMult = {x:1,y:1}
    openProjects[projectId].viewportTransforms.offset.x = openProjects[projectId].viewportTransforms.oldOffset.x
    openProjects[projectId].viewportTransforms.offset.y = openProjects[projectId].viewportTransforms.oldOffset.y
    updateViewport()
}
//  #endregion

function determineTopmostElement(ev) {
    var elements = []
    var connections = [] 
    for (let el of document.elementsFromPoint(ev.clientX,ev.clientY)) {
        if (el.classList.contains("element")) elements.push(el)
        if (el.classList.contains("connection")) connections.push(el)
    }
    if (connections.length != 0) {
        return connections[0]
    } else if (elements.length != 0) {
        return elements[0]
    } else {
        return null
    }
}

function dragElements(event) {
    totalPointerMovement.x += event.movementX
    totalPointerMovement.y += event.movementY
    showTransformGuide()
    for (let id of selectedElements) {
        let el = openProjects[projectId].elementsData.elements[id].element
        el.style.left = ((parseFloat(el.dataset.dragStartX) + (totalPointerMovement.x * (1 / getScale())) * elementTransformMult.x)) + "px"
        el.style.top = ((parseFloat(el.dataset.dragStartY) + (totalPointerMovement.y * (1 / getScale())) * elementTransformMult.y)) + "px"
    }
    moveLockedPointerImage()
}

function scaleElements(event) {
    totalPointerMovement.x += event.movementX
    totalPointerMovement.y += event.movementY
    showTransformGuide()
    for (let id of selectedElements) {
        let el = openProjects[projectId].elementsData.elements[id].element
        if (event.shiftKey) {
            let dist = Math.sqrt(totalPointerMovement.x*totalPointerMovement.x+totalPointerMovement.y*totalPointerMovement.y)
            el.style.scale = (parseFloat(el.dataset.scaleStartX) + (dist / (100 * (getScale())) * elementTransformMult.x))
            el.style.setProperty("--var-domvar-inverse-scale-x", 1 / (parseFloat(el.dataset.scaleStartX) + (dist / (100 * (getScale())) * elementTransformMult.x)))
            el.style.setProperty("--var-domvar-inverse-scale-y", 1 / (parseFloat(el.dataset.scaleStartX) + (dist / (100 * (getScale())) * elementTransformMult.x)))
        } else {
            el.style.scale = (parseFloat(el.dataset.scaleStartX) + (totalPointerMovement.x / (100 * (getScale())) * elementTransformMult.x)) + " " + (parseFloat(el.dataset.scaleStartY) + (totalPointerMovement.y / (100 * (getScale())) * elementTransformMult.y))
            el.style.setProperty("--var-domvar-inverse-scale-x", 1 / (parseFloat(el.dataset.scaleStartX) + (totalPointerMovement.x / (100 * (getScale())) * elementTransformMult.x)))
            el.style.setProperty("--var-domvar-inverse-scale-y", 1 / (parseFloat(el.dataset.scaleStartY) + (totalPointerMovement.y / (100 * (getScale())) * elementTransformMult.y)))
        }
    }
    moveLockedPointerImage()
}

function rotateElements(event) {
    totalPointerMovement.x += event.movementX
    totalPointerMovement.y += event.movementY
    var midPoint = getMiddlePoint()
    var transformLine = new Line(
        {
            x: midPoint.x,
            y: midPoint.y
        },
        {
            x: startingPointerPosition.x + totalPointerMovement.x,
            y: startingPointerPosition.y + totalPointerMovement.y
        }
    )
    var angleToPointer = -(transformLine.getAngle() * 180 / Math.PI) + 180 //0-360deg
    var addAngle = (angleToPointer - rotateStartingAngle + 360) % 360
    
    for (let id of selectedElements) {
        let el = openProjects[projectId].elementsData.elements[id].element
        el.style.rotate = (parseFloat(el.dataset.rotateStart) + addAngle) + "deg"
    }
    showTransformGuide()
    moveLockedPointerImage()
}

function showTransformGuide() {
    let el = document.querySelector(".transform-guide")
    var line
    if (elementTransformState == TRANSFORM_STATES.ROTATE) {
        line = new Line(
            {
                x:parseFloat(el.style.left),
                y:parseFloat(el.style.top)
            },
            {
                x:inputMousePos.x + totalPointerMovement.x,
                y:inputMousePos.y + totalPointerMovement.y
            }
        )
    } else {
        line = new Line(
            {
                x:startingPointerPosition.x,
                y:startingPointerPosition.y
            },
            {
                x:startingPointerPosition.x + totalPointerMovement.x *elementTransformMult.x,
                y:startingPointerPosition.y + totalPointerMovement.y *elementTransformMult.y
            }
        )
    }
    el.style.left = line.start.x
    el.style.top = line.start.y
    el.style.width = line.getLength() + "px"
    el.style.rotate = (90-(line.getAngle() * 180 / Math.PI)) + "deg"
}

export function lockTransformAxis(xAxis = true) {
    if (xAxis) {
        elementTransformMult.y == 0 ? elementTransformMult.y = 1 : elementTransformMult.y = 0
        elementTransformMult.x = 1
    } else {
        elementTransformMult.x == 0 ? elementTransformMult.x = 1 : elementTransformMult.x = 0
        elementTransformMult.y = 1
    }
    if (elementTransformState == TRANSFORM_STATES.DRAG) {
        dragElements({movementX: 0, movementY: 0})
    } else if (elementTransformState == TRANSFORM_STATES.SCALE) {
        scaleElements({movementX: 0, movementY: 0})
    }
}


// #region event handlers
/*
mouseupEvent.button:
0: Main button, usually the left button or the un-initialized state
1: Auxiliary button, usually the wheel button or the middle button (if present)
2: Secondary button, usually the right button
3: Fourth button, typically the Browser Back button
4: Fifth button, typically the Browser Forward button
*/
document.addEventListener("mouseup", (ev) => {
    if (ev.button == 1) {
        if (viewPanning) {
            releaseContext()
            setPointerPos()
            document.exitPointerLock()
            pointerElement.innerHTML = ""
            viewPanningMult = {x:1,y:1}
            openProjects[projectId].viewportTransforms.oldOffset.x = openProjects[projectId].viewportTransforms.offset.x
            openProjects[projectId].viewportTransforms.oldOffset.y = openProjects[projectId].viewportTransforms.offset.y
            viewPanning = false
        }
    }
    if (elementTransformState != TRANSFORM_STATES.NONE && projectId != "") {
        if (ev.button == 0) { // left click while dragging/scaling to apply changes
            setTransformMode(TRANSFORM_STATES.NONE)
        } else if (ev.button == 2) {
            cancelCurrentTransform()
        }
    }
})

function wheelEvent(ev) {
    if (currentInputContext == "board") {
        if (ev.deltaY > 0) {
            zoom(ev, -1)
        } else {
            zoom(ev, 1)
        }
    }
}
function mouseDownEvent(ev) {
    if (ev.button == 1) {
        viewPanning = true
        setContext("view_panning")
        totalPointerMovement = {x:0,y:0}
        startingPointerPosition = {x:ev.layerX,y:ev.layerY}
        inputElement.requestPointerLock()
        moveLockedPointerImage()
        pointerElement.appendChild(registeredIcons["icon.pointer.view.pan"].getElement(30,30,pointerElement))
    }
}
function mouseUpEvent(ev) {
    var element = determineTopmostElement(ev)
    if (currentInputContext == "board") {
        if (ev.shiftKey) {
            if (ev.button == 0) { //Shift+Left click
                if (element != null) {
                    toggleElementSelection(element.dataset.elementId)
                }
            }
        } else {
            if (ev.button == 0) { //Left click
                if (element == null) { //Left click on empty space = deselect everything
                    deselectAll()
                } else { //Left click on element = deselect all other elements and select this one
                    deselectAll()
                    selectElement(element.dataset.elementId)
                }
            }
        }
        if (ev.button == 2) { //Right click
            if (element == null) { // Bring up context menu on clicking empty space
                registeredPopups["popup.project.addelement"].show({x:ev.clientX,y:ev.clientY})
            } else if (element != null) { //Bring up element context menu 
                
            }
        }
    }
    
}
function mouseMoveEvent(ev) {
    let rect = inputElement.getBoundingClientRect()
    openProjects[projectId].viewportTransforms.size.x = rect.width
    openProjects[projectId].viewportTransforms.size.y = rect.height
    openProjects[projectId].viewportTransforms.mouseOffset.x = ev.offsetX
    openProjects[projectId].viewportTransforms.mouseOffset.y = ev.offsetY
    inputMousePos = {x:ev.layerX,y:ev.layerY}
    if (viewPanning) {
        processLockedPointer(ev)
    }
    if (elementTransformState == TRANSFORM_STATES.DRAG) {
        dragElements(ev)
    } else if (elementTransformState == TRANSFORM_STATES.SCALE) {
        scaleElements(ev)
    } else if (elementTransformState == TRANSFORM_STATES.ROTATE) {
        rotateElements(ev)
    }
    updateViewport()

}

document.addEventListener("pointerlockchange", (_ev) => {
    if (!document.pointerLockElement && viewPanning) {
        cancelViewPanning()
    } else if (!document.pointerLockElement && elementTransformState!=TRANSFORM_STATES.NONE) {
        cancelCurrentTransform()
    }
})
// #endregion


// #region point translation
/**
 * Translates from element layer point to input layer point
 * @param {Object} point Object with x and y keys for coordinates
 * @returns {Object} point in input layer system
 */
function getInputLayerPoint(point) {
    let inputRect = inputElement.getBoundingClientRect()
    let newPoint = {x:point.x,y:point.y}
    if (newPoint.x > (inputRect.width)) {
        newPoint.x = newPoint.x % inputRect.width
    } else if (newPoint.x < 0) {
        newPoint.x = inputElement.width + (newPoint.x % inputElement.width)
    }
    if (newPoint.y > (inputRect.height)) {
        newPoint.y = newPoint.x % inputRect.height
    } else if (newPoint.y < 0) {
        newPoint.y = inputElement.height + (newPoint.y % inputElement.height)
    }
    return newPoint
}

/**
 * Translates from input layer point to element layer point
 * @param {Object} point Object with x and y keys for coordinates
 * @returns {Object} point in element layer system
 */
function getElementLayerPoint(point) {
    let elementPos = {
        x:openProjects[projectId].viewportTransforms.offset.x,
        y:openProjects[projectId].viewportTransforms.offset.y
    }
    return {x:elementPos.x + point.x, y:elementPos.y + point.y}
}

// #endregion


// #region element transform

/**
 * 
 * @param {TRANSFORM_STATES} mode selects transformation mode. if none it applies transformation 
 */
export function setTransformMode(mode) {
    totalPointerMovement = {x:0,y:0}
    elementTransformMult = {x:1,y:1}
    if (mode == TRANSFORM_STATES.NONE || selectedElements.length == 0) {
        document.exitPointerLock()
        setContext("board")
        setPointerPos()
        pointerElement.innerHTML = ""
        document.querySelector(".transform-guide").style.display = "none"
        document.querySelector(".transform-guide").style.width = "0"
        if (elementTransformState != TRANSFORM_STATES.NONE) {
            for (let id of selectedElements) {
                let el = openProjects[projectId].elementsData.elements[id].element
                el.dataset.dragStartX = parseFloat(el.style.left)
                el.dataset.dragStartY = parseFloat(el.style.top)
                let scaleValue = el.style.scale.split(" ")
                if (scaleValue.length < 2) {
                    el.dataset.scaleStartX = scaleValue[0]
                    el.dataset.scaleStartY = scaleValue[0]
                } else {
                    el.dataset.scaleStartX = scaleValue[0]
                    el.dataset.scaleStartY = scaleValue[1]
                }
                el.dataset.rotateStart = parseFloat(el.style.rotate)
            }
        }
        elementTransformState = TRANSFORM_STATES.NONE
        return
    }
    switch (mode) {
        case TRANSFORM_STATES.NONE :
            break
        case TRANSFORM_STATES.DRAG :
            elementTransformState = TRANSFORM_STATES.DRAG
            setContext("drag")
            startingPointerPosition = inputMousePos
            inputElement.requestPointerLock()
            moveLockedPointerImage()
            pointerElement.appendChild(registeredIcons["icon.pointer.view.pan"].getElement(30,30,pointerElement))
            var midPoint = getMiddlePoint()
            document.querySelector(".transform-guide").style.left = midPoint.x + "px"
            document.querySelector(".transform-guide").style.top = midPoint.y + "px"
            document.querySelector(".transform-guide").style.display = "block"
            for (let id of selectedElements) {
                let el = openProjects[projectId].elementsData.elements[id].element
                el.dataset.dragStartX = parseFloat(el.style.left)
                el.dataset.dragStartY = parseFloat(el.style.top)
            }
            break
        case TRANSFORM_STATES.SCALE :
            elementTransformState = TRANSFORM_STATES.SCALE
            setContext("scale")
            startingPointerPosition = inputMousePos
            inputElement.requestPointerLock()
            moveLockedPointerImage()
            var midPoint = getMiddlePoint()
            document.querySelector(".transform-guide").style.left = midPoint.x + "px"
            document.querySelector(".transform-guide").style.top = midPoint.y + "px"
            document.querySelector(".transform-guide").style.display = "block"
            pointerElement.appendChild(registeredIcons["icon.pointer.view.pan"].getElement(30,30,pointerElement))
            for (let id of selectedElements) {
                let el = openProjects[projectId].elementsData.elements[id].element
                let scaleValue = el.style.scale.split(" ")
                if (scaleValue.length < 2) {
                    el.dataset.scaleStartX = parseFloat(el.style.scale.split(" ")[0])
                    el.dataset.scaleStartY = parseFloat(el.style.scale.split(" ")[0])
                } else {
                    el.dataset.scaleStartX = parseFloat(el.style.scale.split(" ")[0])
                    el.dataset.scaleStartY = parseFloat(el.style.scale.split(" ")[1])
                }
                    
            }
            break
        case TRANSFORM_STATES.ROTATE :
            elementTransformState = TRANSFORM_STATES.ROTATE
            setContext("rotate")
            startingPointerPosition = inputMousePos
            var midPoint = getMiddlePoint()
            document.querySelector(".transform-guide").style.left = midPoint.x + "px"
            document.querySelector(".transform-guide").style.top = midPoint.y + "px"
            document.querySelector(".transform-guide").style.display = "block"
            inputElement.requestPointerLock()
            moveLockedPointerImage()
            pointerElement.appendChild(registeredIcons["icon.pointer.view.pan"].getElement(30,30,pointerElement))
            rotateStartingAngle = new Line(
                {
                    x:midPoint.x,
                    y:midPoint.y
                },
                {
                    x:startingPointerPosition.x,
                    y:startingPointerPosition.y
                }
            ).getAngle() * 180 / Math.PI * -1 + 180
            for (let id of selectedElements) {
                let el = openProjects[projectId].elementsData.elements[id].element
                el.dataset.rotateStart = parseFloat(el.style.rotate)
            }
            break
        
    }
    
    moveLockedPointerImage()
    showTransformGuide()
}

export function cancelCurrentTransform() {
    if (elementTransformState == TRANSFORM_STATES.DRAG) {
        for (let id of selectedElements) {
            let el = openProjects[projectId].elementsData.elements[id].element
            el.style.left = el.dataset.dragStartX + "px"
            el.style.top = el.dataset.dragStartY + "px"
        }
    } else if (elementTransformState == TRANSFORM_STATES.SCALE) {
        for (let id of selectedElements) {
            let el = openProjects[projectId].elementsData.elements[id].element
            el.style.scale = el.dataset.scaleStartX + " " + el.dataset.scaleStartY
        }
    } else if (elementTransformState == TRANSFORM_STATES.ROTATE) {
        for (let id of selectedElements) {
            let el = openProjects[projectId].elementsData.elements[id].element
            el.style.rotate = el.dataset.rotateStart + "deg"
        }
    }
    setTransformMode(TRANSFORM_STATES.NONE)
}

// #endregion