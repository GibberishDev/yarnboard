import { projectId } from "./project_viewport.js"
import { openProjects } from "./project_data.js"
import { Element, ELEMENT_TYPES, DEFAULT_TRANSFORMS } from "./elements.js"

export var selectedElements = []

export function selectElement(id) {

}

export function selectAll() {
    openProjects[projectId].elementsData.addElement("aaaa",new Element("aaaa",ELEMENT_TYPES.PICTURE, DEFAULT_TRANSFORMS, {"src":"https://static-cdn.jtvnw.net/jtv_user_pictures/3e987d45-269a-41b7-8d64-1f1f7c155682-profile_image-300x300.png"}))
    let el = openProjects[projectId].elementsData.elements["aaaa"].element
    document.querySelector("#viewport-id-" + projectId).querySelector(".project-elements").appendChild(el)
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

function getAllElements() {
    return openProjects[projectId].elementsData.elements
}