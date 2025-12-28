function restartAnimations(element) {
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = null;
}