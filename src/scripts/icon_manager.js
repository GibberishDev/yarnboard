export var registeredIcons = {}

export class Icon {
    constructor(id, svg) {
        this.id = id
        this.svg = svg
        registeredIcons[id] = this
    }
    getElement(width, height, highlightParentElement=undefined){
        let iconElement = document.createElement("div")
        iconElement.innerHTML = this.svg
        iconElement = iconElement.firstChild
        iconElement.dataset.id = this.id
        iconElement.setAttribute("width", width);
        iconElement.setAttribute("height", height);
        if (highlightParentElement!=undefined) {
            console.log(highlightParentElement)
            highlightParentElement.addEventListener("mouseover", ()=>{iconElement.classList.add("highlight")})
            highlightParentElement.addEventListener("mouseout", ()=>{iconElement.classList.remove("highlight")})
        } else {
            iconElement.addEventListener("mouseover", ()=>{iconElement.classList.add("highlight")})
            iconElement.addEventListener("mouseout", ()=>{iconElement.classList.remove("highlight")})
        }
        return iconElement
    }
}
