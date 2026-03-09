import { projectId } from "./project_viewport.js"
import { openProjects } from "./project_data.js"
import { Element, ELEMENT_TYPES, DEFAULT_TRANSFORMS } from "./elements.js"

export var selectedElements = []

export function selectAll() {
    openProjects[projectId].elementsData.addElement(new Element("aaaa",ELEMENT_TYPES.PICTURE, DEFAULT_TRANSFORMS, {"src":"https://static-cdn.jtvnw.net/jtv_user_pictures/3e987d45-269a-41b7-8d64-1f1f7c155682-profile_image-300x300.png"}))
    let elements = getAllElements()
    selectedElements = []
    for (let elementId of Object.keys(elements)) {
        elements[elementId].element.classList.add("selected")
        selectedElements.push(elementId)
    }
}

export function deselectAll() {
    let elements = getAllElements()
    selectedElements = []
    for (let elementId of Object.keys(elements)) {
        elements[elementId].element.classList.remove("selected")
    }
}

export function invertSelection() {
    let elements = getAllElements()
    selectedElements = []
    for (let elementId of Object.keys(elements)) {
        if (!elements[elementId].element.classList.contains("selected")) {
            selectedElements.push(elementId)
            elements[elementId].element.classList.add("selected")
        } else {
            elements[elementId].element.classList.remove("selected")
        }
    }
}

export function selectElement(id) {
    let elementObject = getElement(id)
    if (!selectedElements.includes(id)) selectedElements.push(id)
    elementObject.element.classList.add("selected")
}
export function deselectElement(id) {
    let elementObject = getElement(id)
    if (selectedElements.includes(id)) selectedElements.remove(id)
    elementObject.element.classList.remove("selected")
}
export function toggleElementSelection(id) {
    let elementObject = getElement(id)
    if (!selectedElements.includes(id)) {
        selectedElements.push(id)
        elementObject.element.classList.add("selected")
    } else {
        selectedElements.remove(id)
        elementObject.element.classList.remove("selected")
    }
}

function getAllElements() {
    return openProjects[projectId].elementsData.elements
}

function getElement(id) {
    return openProjects[projectId].elementsData.elements[id]
}


export function getMiddlePoint() {
    var points = []
    let allElements = getAllElements()
    for (let elementId of selectedElements) {
        let rect = allElements[elementId].element.getBoundingClientRect()
        var point = {
            x: parseFloat(allElements[elementId].element.style.left),
            y: parseFloat(allElements[elementId].element.style.top),
        }
        points.push(point)
    }
    var midPoint = {x:0,y:0}
    for (var i = 0; i < points.length; i++) {
        if (i == 0) {
            midPoint = points[0]
        } else {
            midPoint = {
                x: (midPoint.x + points[i].x)/2,
                y: (midPoint.y + points[i].y)/2,
            }
        }
    }
    return midPoint
}