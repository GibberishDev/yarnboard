export const ELEMENT_TYPES = Object.freeze({
    PICTURE: 0,
    PHOTO: 1,
    TEXT: 2,
    NOTE: 3,
    VIDEO: 4,
    AUDIO: 5
})

export const DEFAULT_TRANSFORMS = {
    position: {
        x: 0,
        y: 0
    },
    rotation: 0,
    scale: {
        x: 0,
        y: 0
    }
}

export class Element {
    constructor(id, type, transforms = DEFAULT_TRANSFORMS, data = {}, connections = {}) {
        this.id = id
        this.type = type
        this.transforms = transforms
        this.data = data
        this.connections = connections
        this.element = undefined
        this.getElement()
    }
    getElement() {
        if (this.element == undefined)  {
            // Search for element if possible
            var el = document.querySelector("[data-element-id='"+this.id+"']")
            if (el == undefined) {
                this.createElement()
            } else {
                // validateElement()
                this.element = el
            }
        }
        return this.element
    }
    createElement() {
        if (this.element != undefined) {
            this.element.remove()
            this.element = undefined
        }
        this.element = document.createElement("div")
        this.element.dataset.elementId = this.id
        this.element.classList.add("element",getElementTypeClass(this.type))
        this.element.style = "left:0px;top:0px;"
        switch (this.type) {
            case ELEMENT_TYPES.PICTURE :
                this.element.innerHTML = "<img class='element-data'>"
                this.element.querySelector(".element-data").src = this.data.src
                break
            case ELEMENT_TYPES.TEXT :
                this.element.innerHTML = "<div class='element-data'></div>"
                this.element.querySelector(".element-data").textContent = this.data.text
                break
            default :
                this.element.innerHTML = ""
        }
        return this.element
    }
    addDOMElementToProject(projectId) {
        this.getElement()
        document.querySelector("#viewport-id-" + projectId).querySelector(".project-elements").appendChild(this.element)

    }
}

function getElementTypeClass(type) {
    if (findKeyByValue(ELEMENT_TYPES, type)[0] != undefined) {
        return findKeyByValue(ELEMENT_TYPES, type)[0].toLowerCase()
    } else {
        return "picture" /*failsafe picture element default... what could go wrong */
    }
}
