var inputElement = document.querySelector(".project-cover.project-input")
var gridElement = document.querySelector(".project-cover.project-grid")

var viewport = {
    transforms: {
        zoomLevel: 0,
        scale : 1.0,
        offset : {
            x: 0,
            y: 0
        },
        ogOffset : {
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
    }
})
document.addEventListener("mouseup", (ev) => {
    console.log(ev)
    if (ev.button == 1) {
        grabbing = false
    }
})

inputElement.addEventListener("mousemove", (ev)=>{
    let rect = inputElement.getBoundingClientRect()
    viewport.transforms.size.x = rect.width
    viewport.transforms.size.y = rect.height
    viewport.transforms.pos.x = rect.x
    viewport.transforms.pos.y = rect.y
    if (grabbing) {
        viewport.transforms.offset.x += ev.movementX
        viewport.transforms.offset.y += ev.movementY
        viewport.transforms.ogOffset.x += ev.movementX
        viewport.transforms.ogOffset.y += ev.movementY
    }
    updateViewport()
})

function updateViewport() {
    // console.log(viewport.transforms.scale)
    // updateBackground()
    updateGrid()
    
}
function updateGrid() {
    gridElement.style.backgroundPosition = viewport.transforms.offset.x + "px " + viewport.transforms.offset.y + "px"
    gridElement.style.backgroundSize = wrapCellSize(viewport.transforms.scale) * 100 + "px " + wrapCellSize(viewport.transforms.scale) * 100 + "px"
}
function wrapCellSize(scale, min = 1, max = 5) {
  const mod = (a, b) => ((a % b) + b) % b;
  console.log(Math.log(scale / min), Math.log(max / min))
  return min * Math.exp(mod(Math.log(scale / min), Math.log(max / min)));
}

function zoom(ev, factor) {
    viewport.transforms.zoomLevel += factor
    let newScale = Math.pow(1.05,viewport.transforms.zoomLevel)
    viewport.transforms.scale = newScale
    var mousePos = {
        x: ev.layerX,
        y: ev.layerY
    }
    var newOffset = {
        x: mousePos.x - (mousePos.x - viewport.transforms.offset.x) * Math.pow(1.05,factor),
        y: mousePos.y - (mousePos.y - viewport.transforms.offset.y) * Math.pow(1.05,factor) //FIXME: come up with a way to reduce floating point precision affect
    }
    viewport.transforms.offset = newOffset
    updateViewport()
}

