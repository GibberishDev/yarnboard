const ELEMENT_TYPE = Object.freeze({
    0: PICTURE,
    1: PHOTO,
    2: TEXT,
    3: NOTE,
    4: VIDEO,
    5: AUDIO,
})

export class ElementTransform {
    constructor (x=0, y=0, scaleX=1.0, scaleY=1.0, rotation=0, pivotX=0,pivotY=0) {
        this.x = x
        this.y = y
        this.scaleX = scaleX
        this.scaleY = scaleY
        this.rotation = rotation
        this.pivotX = pivotX
        this.pivotY = pivotY
    }
}

export class BoardElement {
    constructor(id, type, data = {}, transform = new ElementTransform(), selected = false, visible=false) {
        this.id = id;
        this.type = type;
        this.data = data;
        this.transform = transform;
        this.selected = selected;
        this.visible = visible;
        this.element = undefined

        this.setVisible(this.visible)
    }
    setVisible(visibility) {
        if (visibility) {
            this.addElement()
            this.applyTransforms()
        } else {
            this.element.remove()
            this.element = undefined
        }
        this.visible = visibility
    }
}