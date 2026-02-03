import { setContext } from "./keybinds.js"
import { registeredPopups } from "./popup_menu.js"
import { windowBounds, mousePos } from "./electron_info.js"

var inputElement = undefined
var gridElement = undefined
var elementsElement = undefined
var statsPos = undefined
var statsScale = undefined
var grabbing = false
var viewportId = ""
var mouseLock = true

var viewport = {}

const transforms = {
    zoomLevel: 0,
    scale : 1.0,
    offset : {
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
        grabbing = false
        yarnboardAPI.stopMouseTrack()
        // gridElement.style.transitionProperty = "background-image, background-position, background-size"
    }
})

function updateViewport() {
    // updateBackground()
    updateElements()
    updateGrid()
    statsPos.textContent = "X:" + parseInt((-viewport[viewportId].transforms.offset.x + viewport[viewportId].transforms.mouseOffset.x) * 1/viewport[viewportId].transforms.scale) + " Y:" + parseInt((-viewport[viewportId].transforms.offset.y + viewport[viewportId].transforms.mouseOffset.y) * 1/viewport[viewportId].transforms.scale)
    statsScale.textContent = "zoom: " + (viewport[viewportId].transforms.scale * 100).toFixed(3) + "%"
}

function updateElements() {
    elementsElement.style.translate = viewport[viewportId].transforms.offset.x + "px " + viewport[viewportId].transforms.offset.y + "px"
    elementsElement.style.scale = viewport[viewportId].transforms.scale
}

function updateGrid() {
    gridElement.style.backgroundPosition = viewport[viewportId].transforms.offset.x + "px " + viewport[viewportId].transforms.offset.y + "px"
    gridElement.style.backgroundSize = wrapCellSize(viewport[viewportId].transforms.scale) * 100 + "px " + wrapCellSize(viewport[viewportId].transforms.scale) * 100 + "px"
}
function wrapCellSize(scale, min = 1, max = 5) {
  const mod = (a, b) => ((a % b) + b) % b;
  return min * Math.exp(mod(Math.log(scale / min), Math.log(max / min)));
}

function zoom(ev, factor) {
    if ((!(viewport[viewportId].transforms.zoomLevel < 50) && factor > 0) || (!(viewport[viewportId].transforms.zoomLevel > -50) && factor < 0)) {
        return
    }
    viewport[viewportId].transforms.zoomLevel += factor
    let newScale = Math.pow(1.1,viewport[viewportId].transforms.zoomLevel)
    viewport[viewportId].transforms.scale = newScale
    var mousePos = {
        x: ev.layerX,
        y: ev.layerY
    }
    var newOffset = {
        x: mousePos.x - (mousePos.x - viewport[viewportId].transforms.offset.x) * Math.pow(1.1,factor),
        y: mousePos.y - (mousePos.y - viewport[viewportId].transforms.offset.y) * Math.pow(1.1,factor)
    }
    viewport[viewportId].transforms.offset = newOffset
    updateViewport()
}

export function bindEvents(viewportElement) {
    inputElement = viewportElement.querySelector(".project-cover.project-input")
    gridElement = viewportElement.querySelector(".project-cover.project-grid")
    elementsElement = viewportElement.querySelector(".project-cover.project-elements")
    statsPos = viewportElement.querySelector(".viewport-position")
    statsScale = viewportElement.querySelector(".viewport-scale")

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
        yarnboardAPI.startMouseTrack()
    }
}
function mouseUpEvent(ev) {
    if (ev.which == 3) {
        // test if clicked on any of the elements or connections or selection is active
        registeredPopups["popup.project.addelement"].show({x:ev.clientX,y:ev.clientY})
    }
}
function mouseMoveEvent(ev) {
    viewport[viewportId].transforms.mouseOffset.x = ev.offsetX
    viewport[viewportId].transforms.mouseOffset.y = ev.offsetY
}
function mouseClickEvent(ev) {
    // console.log(ev)
}

export function projectViewportId(id) {
    viewportId = id
    if (Object.keys(viewport).includes(id)) {
        return
    }
    // TODO: project save data loading
    viewport[id] = {"transforms":{}}
    viewport[id].transforms = structuredClone(transforms)
}

export function getScale() {
    return viewport[viewportId].transforms.scale
}
export function getScreenRect() {
    let rect = {
        x: -viewport[viewportId].transforms.offset.x / getScale(),
        y: -viewport[viewportId].transforms.offset.y / getScale(),
        w: inputElement.getBoundingClientRect().width / getScale(),
        h: inputElement.getBoundingClientRect().height / getScale(),
    }
    return rect
}

export function resetView() {
    viewport[viewportId].transforms = structuredClone(transforms)
    updateViewport()
}

document.addEventListener("appMouseMove", appMouseMoveEvent)
function appMouseMoveEvent() {
    if (grabbing) {
        let rect = inputElement.getBoundingClientRect()
        var newMousePos = { x: mousePos.x, y: mousePos.y, mvX: mousePos.mvX, mvY: mousePos.mvY}
        let newRect = {
            x:rect.x + windowBounds.x, //left
            x2:rect.x + rect.width + windowBounds.x, //right
            y:rect.y + windowBounds.y, //top
            y2:rect.y + rect.height + windowBounds.y //bottom
        }
        var wrapped = false
        if (newRect.x > mousePos.x) {
            newMousePos.mvX = newRect.x - mousePos.x - 2
            newMousePos.x = newRect.x2 - 10
            yarnboardAPI.setMouseScreenPos({x:newMousePos.x,y:newMousePos.y})
            wrapped = true
        } else if (newRect.x2 < mousePos.x) {
            newMousePos.mvX = newRect.x2 - mousePos.x + 2
            newMousePos.x = newRect.x + 10
            yarnboardAPI.setMouseScreenPos({x:newMousePos.x,y:newMousePos.y})
            wrapped = true
        }
        if (newRect.y > mousePos.y) {
            newMousePos.mvY = newRect.y - mousePos.y - 2
            newMousePos.y = newRect.y2 - 10
            yarnboardAPI.setMouseScreenPos({x:newMousePos.x,y:newMousePos.y})
            wrapped = true
        } else if (newRect.y2 < mousePos.y) {
            newMousePos.mvY = newRect.y2 - mousePos.y + 2
            newMousePos.y = newRect.y + 10
            yarnboardAPI.setMouseScreenPos({x:newMousePos.x,y:newMousePos.y})
            wrapped = true
        }
        if (wrapped) {
            mousePos.x = newMousePos.x
            mousePos.y = newMousePos.y
            mousePos.mvX = newMousePos.mvX
            mousePos.mvY = newMousePos.mvY
        }
        viewport[viewportId].transforms.size.x = rect.width
        viewport[viewportId].transforms.size.y = rect.height
        viewport[viewportId].transforms.offset.x += mousePos.mvX
        viewport[viewportId].transforms.offset.y += mousePos.mvY
        updateViewport()
    }
}