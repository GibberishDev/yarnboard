var inputElement = document.querySelector(".project-cover.project-input")
var gridElement = document.querySelector(".project-cover.project-grid")
var elementsElement = document.querySelector(".project-cover.project-elements")
var statsPos = document.querySelector(".viewport-position")
var statsScale = document.querySelector(".viewport-scale")

var viewport = {
    transforms: {
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
        },
        pos: {
            x: 0,
            y: 0
        }
    }
}

inputElement = document.querySelector(".project-cover.project-input")

var grabbing = false

inputElement.addEventListener("wheel", (ev) => {
    if (ev.deltaY > 0) {
        zoom(ev, -1)
    }
    if (ev.deltaY < 0) {
        zoom(ev, 1)
    }

})
inputElement.addEventListener("mousedown", (ev) => {
    if (ev.button == 1) {
        grabbing = true
        // gridElement.style.transitionProperty = "background-image"
    }
})
document.addEventListener("mouseup", (ev) => {
    if (ev.button == 1) {
        grabbing = false
        // gridElement.style.transitionProperty = "background-image, background-position, background-size"
    }
})

inputElement.addEventListener("mousemove", (ev)=>{
    let rect = inputElement.getBoundingClientRect()
    viewport.transforms.size.x = rect.width
    viewport.transforms.size.y = rect.height
    viewport.transforms.pos.x = rect.x
    viewport.transforms.pos.y = rect.y
    viewport.transforms.mouseOffset.x = ev.offsetX
    viewport.transforms.mouseOffset.y = ev.offsetY
    if (grabbing) {
        viewport.transforms.offset.x += ev.movementX
        viewport.transforms.offset.y += ev.movementY
    }
    updateViewport()
})

function updateViewport() {
    // console.log(viewport.transforms.scale)
    // updateBackground()
    updateElements()
    updateGrid()
    statsScale.textContent = "zoom: " + (viewport.transforms.scale * 100).toFixed(3) + "%"
    statsPos.textContent = "X:" + parseInt((-viewport.transforms.offset.x + viewport.transforms.mouseOffset.x) * 1/viewport.transforms.scale) + " Y:" + parseInt((-viewport.transforms.offset.y + viewport.transforms.mouseOffset.y) * 1/viewport.transforms.scale)
}

function updateElements() {
    elementsElement.style.translate = viewport.transforms.offset.x + "px " + viewport.transforms.offset.y + "px"
    elementsElement.style.scale = viewport.transforms.scale
}

function updateGrid() {
    gridElement.style.backgroundPosition = viewport.transforms.offset.x + "px " + viewport.transforms.offset.y + "px"
    gridElement.style.backgroundSize = wrapCellSize(viewport.transforms.scale) * 100 + "px " + wrapCellSize(viewport.transforms.scale) * 100 + "px"
    console.log(wrapCellSize(viewport.transforms.scale))
}
function wrapCellSize(scale, min = 1, max = 5) {
  const mod = (a, b) => ((a % b) + b) % b;
  return min * Math.exp(mod(Math.log(scale / min), Math.log(max / min)));
}

function zoom(ev, factor) {
    if ((!(viewport.transforms.zoomLevel < 25) && factor > 0) || (!(viewport.transforms.zoomLevel > -100) && factor < 0)) {
        return
    }
    viewport.transforms.zoomLevel += factor
    let newScale = Math.pow(1.1,viewport.transforms.zoomLevel)
    viewport.transforms.scale = newScale
    var mousePos = {
        x: ev.layerX,
        y: ev.layerY
    }
    var newOffset = {
        x: mousePos.x - (mousePos.x - viewport.transforms.offset.x) * Math.pow(1.1,factor),
        y: mousePos.y - (mousePos.y - viewport.transforms.offset.y) * Math.pow(1.1,factor)
    }
    viewport.transforms.offset = newOffset
    updateViewport()
}

