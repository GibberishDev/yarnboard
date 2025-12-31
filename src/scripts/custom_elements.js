function ui_checkbox(event) {
    let checkbox_element = event.target.closest(".checkbox")
    var value = event.target.checked
    var id = checkbox_element.id
    var signal = new InputEvent("ui_input")
    signal.inputdata = {"id": id, "value":value, "type": "checkbox"}
    document.dispatchEvent(signal)

}

function ui_number(event) {
    let element = event.target
    let min = parseFloat(element.min)
    let max = parseFloat(element.max)
    let step = parseFloat(element.step)
    let type_int = Number.isInteger(step)
    let value = element.value
    if (!isNaN(min)){if (value < min) {
        value = min
    }}
    if (!isNaN(max)){if (value > max) {
        value = max
    }}
    if (!isNaN(step)) {
        value = Math.round(value / step) * step
        if (type_int) value = Math.round(value)
    }
    element.value = value
    number_input(element)
}
function fixValue(event, element) {
    console.log(event)
    element.removeEventListener("blur", (ev) => fixValue(ev, element))
    let min = parseFloat(element.min)
    let max = parseFloat(element.max)
    let step = parseFloat(element.step)
    let type_int = Number.isInteger(step)
    let value = element.value
    if (!isNaN(min)){if (value < min) {
        value = min
    }}
    element.value = value
    number_input(element)
}
function ui_incrementor(event) {
    event.target.closest(".input-number").querySelector("input[type='number'").stepUp()
    number_input(event.target.closest(".input-number").querySelector("input[type='number'"))
}
function ui_decrementor(event) {
    event.target.closest(".input-number").querySelector("input[type='number'").stepDown()
    number_input(event.target.closest(".input-number").querySelector("input[type='number'"))
}

function number_input(element) {
    var value = element.value
    var id = element.id
    var signal = new InputEvent("ui_input")
    signal.inputdata = {"id": id, "value":value, "type": "number"}
    document.dispatchEvent(signal)

}

document.addEventListener("ui_input", (ev) => console.log(ev))