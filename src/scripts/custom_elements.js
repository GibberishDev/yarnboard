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
    if (!isNaN(step)) {if (value % step != 0) {
        value = Math.round(value / step) * step
    }}
    if (value == "") {value = element.dataset.default}
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
    var signal = new Event("ui_input")
    signal.inputdata = {"id": id, "value":value, "type": "number"}
    document.dispatchEvent(signal)

}

class HSV {
    constructor(h,s,v) {
        this.h = h
        this.s = s
        this.v = v
    }
    toHex = () => {
        var sat = this.s / 100;
        var val = this.v / 100;

        const c = val * sat;
        const x = c * (1 - Math.abs((this.h / 60) % 2 - 1));
        const m = val - c;

        let r = 0, g = 0, b = 0;

        if (this.h >= 0 && this.h < 60) {
            r = c; g = x; b = 0;
        } else if (this.h < 120) {
            r = x; g = c; b = 0;
        } else if (this.h < 180) {
            r = 0; g = c; b = x;
        } else if (this.h < 240) {
            r = 0; g = x; b = c;
        } else if (this.h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const toHex = n =>
            Math.round((n + m) * 255)
            .toString(16)
            .padStart(2, "0");

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    fromHex = (hex) => {
        hex = hex.replace(/^#/, "");

        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let hue = 0;
        let sat = 0;
        let val = max;

        if (delta !== 0) {
            sat = delta / max;

            switch (max) {
            case r:
                hue = ((g - b) / delta) % 6;
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
            }

            hue *= 60;
            if (hue < 0) hue += 360;
        }
        this.h = hue,
        this.s = sat * 100,
        this.v = val * 100
        return this
    }
}

function ui_color_hex(event) {
    let el = event.target
    let Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if (Reg_Exp.test(el.value)) {
        colorInit(el.value, el.closest(".setting.type-color"))
        setColor(el)
    } else {
        colorInit(el.closest(".setting.type-color").dataset.hex, el.closest(".setting.type-color"))
    }

}
function ui_color_hue(event) {
    let el = event.target
    let val = getColorRangeVal(el)
    el.closest(".setting.type-color").dataset.hue = val
    el.closest(".setting.type-color").querySelector(".color-picker-range.sat").querySelector("input[type='range']").style.setProperty("--color-picker-hue", new HSV(val, 100, 100).toHex())
    el.closest(".setting.type-color").querySelector(".color-picker-range.sat").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(val, el.closest(".setting.type-color").dataset.sat, 100).toHex())
    el.closest(".setting.type-color").querySelector(".color-picker-range.hue").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(val, 100, 100).toHex())
    setColor(el)
}
function ui_color_sat(event) {
    let el = event.target
    let val = getColorRangeVal(el)
    el.closest(".setting.type-color").dataset.sat = val
    el.closest(".setting.type-color").querySelector(".color-picker-range.sat").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(el.closest(".setting.type-color").dataset.hue, val, 100).toHex())
    setColor(el)
}
function ui_color_val(event) {
    let el = event.target
    let val = getColorRangeVal(el)
    el.closest(".setting.type-color").dataset.val = val
    el.closest(".setting.type-color").querySelector(".color-picker-range.val").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(0, 0, val).toHex())
    setColor(el)
}

function getColorRangeVal(el) {
    if (el.type == "number") {
        var input = el.value
        if (el.min != undefined) input = Math.max(el.min, input)
        if (el.max != undefined) input = Math.min(el.max, input)
        el.value = input
        el.previousSibling.value = el.value
    } else {
        el.nextSibling.value = el.value
    }
    return el.value
}

function setColor(inputElement) {
    let el = inputElement.closest(".setting.type-color")
    el.dataset.hex = new HSV(el.dataset.hue, el.dataset.sat, el.dataset.val).toHex()
    el.querySelector(".color-preview .hex").value = el.dataset.hex
    el.querySelector(".color-preview .bg").style.background = el.dataset.hex
    var id = el.querySelector(".color-preview .hex").id
    var signal = new InputEvent("ui_input")
    signal.inputdata = {"id": id, "value":el.dataset.hex, "type": "color"}
    document.dispatchEvent(signal)
}

function colorInit(value, el) {
    el.dataset.hex = value
    let color = new HSV().fromHex(value)
    el.dataset.hue = color.h
    el.dataset.sat = color.s
    el.dataset.val = color.v
    el.querySelector(".color-picker-range.hue").querySelector("input[type='range']").value = color.h
    el.querySelector(".color-picker-range.sat").querySelector("input[type='range']").value = color.s
    el.querySelector(".color-picker-range.val").querySelector("input[type='range']").value = color.v
    el.querySelector(".color-picker-range.hue").querySelector("input[type='number']").value = color.h
    el.querySelector(".color-picker-range.sat").querySelector("input[type='number']").value = color.s
    el.querySelector(".color-picker-range.val").querySelector("input[type='number']").value = color.v
    el.querySelector(".color-picker-range.hue").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(color.h, 100, 100).toHex())
    el.querySelector(".color-picker-range.sat").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(color.h, color.s, 100).toHex())
    el.querySelector(".color-picker-range.val").querySelector("input[type='range']").style.setProperty("--color-picker-thumb-val", new HSV(0, 0, color.v).toHex())
    el.querySelector(".color-picker-range.sat").querySelector("input[type='range']").style.setProperty("--color-picker-hue", new HSV(color.h, 100, 100).toHex())
    el.querySelector(".color-preview .bg").style.background = color.toHex()
    el.querySelector(".color-preview .hex").value = color.toHex()
}