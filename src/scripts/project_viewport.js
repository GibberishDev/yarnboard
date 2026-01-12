var inputElement = document.querySelector(".project-cover.project-input")

inputElement = document.querySelector(".project-cover.project-input")

inputElement.addEventListener("mousemove", (ev)=>{
    let rect = inputElement.getBoundingClientRect()
    console.log(ev)
    document.querySelector(".project-cover.project-grid").style.backgroundPosition = (ev.offsetX) + "px " + (ev.offsetY) + "px"
    document.querySelector(".project-cover.project-background").style.backgroundPosition = (ev.offsetX) + "px " + (ev.offsetY) + "px"
})
