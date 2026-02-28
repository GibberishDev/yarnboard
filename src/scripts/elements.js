export const ELEMENT_TYPES = Object.freeze({
    PICTURE: 0,
    PHOTO: 1,
    TEXT: 2,
    NOTE: 3,
    VIDEO: 4,
    AUDIO: 5
})

const DEFAULT_TRANSFORMS = {
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
    }
    getElement() {
        if (this.element == undefined)  {
            // Search for element if possible
            var el = document.querySelector(".element [data-element-id='"+this.id+"']")
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
    }
}

function getElementTypeClass(type) {
    if (Object.findKeyByValue(ELEMENT_TYPES, type)[0] != undefined) {
        return Object.findKeyByValue(ELEMENT_TYPES, type)[0].toLowerCase()
    } else {
        return "picture"
    }
}