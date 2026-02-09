export var windowBounds = { x: 0, y: 0, width: 0, height: 0 }
export var mousePos = { x: 0, y: 0, mvX: 0, mvY: 0}

if (navigator.userAgent.includes("yarnboard")) {
    yarnboardAPI.setWindowBounds((_event, data) => {
        windowBounds = data
    })
    yarnboardAPI.getMouseScreenPos((_event, data) => {
        mousePos.mvX = data.x - mousePos.x
        mousePos.mvY = data.y - mousePos.y
        mousePos.x = data.x
        mousePos.y = data.y
        let event = new Event('appMouseMove')
        event.mousePos = mousePos
        document.dispatchEvent(event)
    })
}