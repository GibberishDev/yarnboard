//Useful snippets used throughout the project

function restartAnimations(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}

Array.prototype.remove = function(element) {
    if (this.includes(element)) {
        return this.splice(this.indexOf(element),1)
    }
}

function findKeyByValue(object, value) {
    return Object.keys(object).filter(key => object[key] === value)
}

class Line {
    constructor(start = {x:0,y:0}, end = {x:0,y:0}) {
        this.start = start
        this.end = end
    }
    /**
     * Returns absolute length of the line
     */
    getLength() {
        return (Math.sqrt(Math.pow((this.end.x - this.start.x),2) + Math.pow((this.end.y - this.start.y),2)))
    }
    /**
     * Returns angle from RIGHT direction in degrees
     */
    getAngle() {
        return (Math.atan2(this.end.x - this.start.x, this.end.y - this.start.y))
    }
}