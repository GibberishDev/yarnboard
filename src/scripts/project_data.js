import { uuidv4 } from "./window_manager.js"

export var loadedData = {}

class ProjectData {
    constructor(id, viewportTransforms=new ProjectViewportTransforms, elementsData={}, connectionsData={}, projectSettings = new ProjectSettings, projectStats=new ProjectStats) {
        this.id = id
        this.viewportTransforms = viewportTransforms
        this.elementsData = elementsData
        this.connectionsData = connectionsData
        this.projectSettings = projectSettings
        this.projectStats = projectStats
        loadedData[id] = this
    }
    loadData(jsonString) {
        // Validate json keys and values
        
    }
    exportData() {
        let jsontext = JSON.stringify(this, null, 2)
        return jsontext
        // call for save path if aaliable in window_manager.js
        // save file using text and file path via preload
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

window.yarnboardAPI.saveText("./", "test.yarnboard", "test")