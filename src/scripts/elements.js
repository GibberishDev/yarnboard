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
    }
    getElement() {
        
    }
}