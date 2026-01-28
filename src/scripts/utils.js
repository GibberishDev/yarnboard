//Useful snippets used throughout the project

function restartAnimations(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}

Array.prototype.remove = function(element) {
    if (this.includes(element)) {
        this.splice(this.indexOf(element),1)
    }
}