import { uuidv4 } from "./window_manager.js"

class ProjectData {
    constructor(id, viewportTransforms) {
        this.id = id
        this.viewportTransforms = viewportTransforms
    }
}

class ProjectViewportTransforms {
    constructor(zoomLevel=0,scale=1.0,offset={x: 0,y: 0},mouseOffset = {x: 0,y: 0},size= {x: 0,y: 0}) {
        this.zoomLevel = zoomLevel
        this.scale = scale
        this.offset = offset
        this.mouseOffset = mouseOffset
        this.size = size
    }
}

console.log(JSON.stringify(new ProjectData(uuidv4(), new ProjectViewportTransforms())))