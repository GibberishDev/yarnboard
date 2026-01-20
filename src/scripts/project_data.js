import { uuidv4 } from "./window_manager.js"

export var loadedData = {}

class ProjectData {
    constructor(id, viewportTransforms, elementsData={}, connectionsData={}, projectSettings = new ProjectSettings, projectStats=new ProjectStats) {
        this.id = id
        this.viewportTransforms = viewportTransforms
        this.elementsData = elementsData
        this.connectionsData = connectionsData
        this.projectSettings = projectSettings
        this.projectStats = projectStats
        loadedData[id] = this
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

class ProjectSettings {
    constructor (displayName="New Project") {
        this.displayName = displayName
    }
}

class ProjectStats {
    constructor (authors=[], elementCount=0, connectionsCount=0, elapsedTime=0) {
        this.authors = authors
        this.elementCount = elementCount
        this.connectionsCount = connectionsCount
        this.elapsedTime = elapsedTime
    }
}


console.log(new ProjectData(uuidv4(), new ProjectViewportTransforms()))