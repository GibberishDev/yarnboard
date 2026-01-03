import { AVALIABLE_LANGUAGES, localizeString } from "./localization.js"
import { inputText } from "./keybinds.js"

export var registeredSettings = {}
var settingsList = {}
export const SETTINGS_TYPE  = Object.freeze({
    STRING : 0,
    LIST : 1,
    INTEGER : 2,
    FLOAT : 3,
    BOOL : 4,

})

class Setting {
    constructor(id, type, default_value, category_id="settings.category.general", value = undefined) {
        this.id = id
        this.type = type
        this.default_value = default_value
        if (value == undefined) value = default_value
        this.value = value
        this.category_id = category_id
        registeredSettings[id] = this
    }
    set = (value) => {
        this.value = value
        let event = new Event("settingUpdated")
        event.id = this.id
        event.value = this.value
        document.dispatchEvent(event)
        console.info("Set " + this.id + " value to \"" + value + "\"")
    }
    get = () => {
        return self.value
    }
    getType = () => {
        return Object.keys(SETTINGS_TYPE).find(key => SETTINGS_TYPE[key] === this.type)
    }
}

export class IntSetting extends Setting {
    constructor(id, default_value, min = undefined, max = undefined, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.INTEGER, default_value, category_id, value)
        if (min != undefined) this.min = min
        if (max != undefined) this.min = max
    }
}
export class StringSetting extends Setting {
    constructor(id, default_value, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.STRING, default_value, category_id, value)
    }
}
export class ListSetting extends Setting {
    constructor(id, default_value, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.LIST, default_value, category_id, value)
    }
}
export class BoolSetting extends Setting {
    constructor(id, default_value, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.BOOL, default_value, category_id, value)
    }
}
export class FloatSetting extends Setting {
    constructor(id, default_value, step = undefined, min = undefined, max = undefined, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.INTEGER, default_value, category_id, value)
        if (step != undefined) this.step = step
        if (min != undefined) this.min = min
        if (max != undefined) this.min = max
    }
}

function generate_list() {
    var settingsNames = Object.keys(registeredSettings)
    for (let i = 0; i<settingsNames.length;i++) {
        let settting = registeredSettings[settingsNames[i]]
        if (settingsList[settting.category_id] == null) {
            settingsList[settting.category_id] = {}
        }
        settingsList[settting.category_id][settting.id] = settting.type
    }
}

function populate_sidebar() {
    var sidebar = document.querySelector("#settings-sidebar")
    sidebar.innerHTML = ""
    for (let cat = 0; cat < Object.keys(settingsList).length;cat++) {
        let category = settingsList[Object.keys(settingsList)[cat]]
        var categoryElement = document.createElement("div")
        categoryElement.dataset.id = Object.keys(settingsList)[cat]
        categoryElement.classList.add("settings-sidebar-category","expanded")
        var categoryLabelElement = document.createElement("p")
        categoryLabelElement.addEventListener("click", (ev)=>{ev.target.closest(".settings-sidebar-category").classList.toggle("expanded")})
        categoryLabelElement.innerText = localizeString(Object.keys(settingsList)[cat])
        categoryElement.appendChild(categoryLabelElement)
        for (let sett = 0; sett < Object.keys(category).length; sett++) {
            var settingElement = document.createElement("div")
            settingElement.innerText = localizeString(Object.keys(category)[sett])
            settingElement.classList.add("settings-sidebar-subcategory")
            settingElement.dataset.id = Object.keys(category)[sett]
            settingElement.addEventListener("click", (ev) => console.log(ev.target) /*TODO: change to scroll to element */)
            categoryElement.appendChild(settingElement)
        }
        sidebar.appendChild(categoryElement)
    }
}

// region templates
    var intTemplate = `
        <div class="setting-label"></div>
        <div class="setting-description"></div>
        <div class="input-number">
            <input type="number" min="0" step="1" value="256" onblur="ui_number(event)">
            <button class="number-input-increment up" onclick="ui_incrementor(event)">
            <svg width="10"height="10"viewBox="0 0 10 10"><path style="fill-opacity:1;stroke:none;"d="M 0,10 5,0 10,10 Z"/></svg>
            </button>
            <button class="number-input-increment down" onclick="ui_decrementor(event)">
            <svg width="10"height="10"viewBox="0 0 10 10"><path style="fill-opacity:1;stroke:none;"d="M 0,0 5,10 10,0 Z"/></svg>
            </button>
        </div>
    `

function numberSetting(id, default_value, value=undefined, step=undefined, min=undefined, max=undefined) {
    var element = document.createElement("div")
    if (value == undefined) value = default_value
    element.classList.add("setting","type-number")
    element.innerHTML = intTemplate
    element.querySelector(".setting-label").innerText = localizeString(id)
    element.querySelector(".setting-description").innerText = localizeString(id+".description")
    var inputElement = element.querySelector("input[type='number']")
    inputElement.id = id
    inputElement.dataset.default = default_value
    inputElement.value = value
    if (step != undefined) inputElement.step = step
    if (min != undefined) inputElement.min = min
    if (max != undefined) inputElement.max = max
    return element
}

var strTemplate = `
        <div class="setting-label"></div>
        <div class="setting-description"></div>
        <input type="text">
        `

function stringSetting(id, value) {
    var element = document.createElement("div")
    element.classList.add("setting","type-text")
    element.innerHTML = strTemplate
    element.querySelector(".setting-label").innerText = localizeString(id)
    element.querySelector(".setting-description").innerText = localizeString(id+".description")
    var inputElement = element.querySelector("input[type='text']")
    inputElement.id = id
    inputElement.value = value
    inputElement.addEventListener("focus", ()=>{inputText(true)})
    inputElement.addEventListener("blur", ()=>{inputText(false)})
    inputElement.addEventListener("input", ev=>{
        var id = ev.target.id
        var value = ev.target.value
        var signal = new InputEvent("ui_input")
        signal.inputdata = {"id": id, "value":value, "type": "text"}
        document.dispatchEvent(signal)
    })
    return element
}

const listTemplate = `
        <div class="setting-label"></div>
        <div class="setting-description"></div>
        <select>
        </select>
`


function listSetting(id, value, list) {
    var element = document.createElement("div")
    element.classList.add("setting","type-dropdown")
    element.innerHTML = listTemplate
    element.querySelector(".setting-label").innerText = localizeString(id)
    element.querySelector(".setting-description").innerText = localizeString(id+".description")
    var selectElement = element.querySelector("select")
    selectElement.id = id
    for (let i=0;i<list.length;i++) {
        var option = document.createElement("option")
        option.value = list[i]
        option.innerText = localizeString(list[i])
        selectElement.appendChild(option)
    }
    selectElement.value = value
    selectElement.addEventListener("input", ev=>{
        var id = ev.target.id
        var value = ev.target.value
        registeredSettings[id].value = value
        var signal = new InputEvent("ui_input")
        signal.inputdata = {"id": id, "value":value, "type": "list"}
        document.dispatchEvent(signal)
    })
    return element
}

const boolTemplate =`
        <div class="setting-label"></div>
        <div class="setting-description"></div>
        <div class="checkbox">
            <div class="checkbox-visalizer"></div>
            <input type="checkbox" onclick="ui_checkbox(event)">
        </div>`

function boolSetting(id, value) {
    var element = document.createElement("div")
    element.classList.add("setting","type-checkbox")
    element.innerHTML = boolTemplate
    element.querySelector(".setting-label").innerText = localizeString(id)
    element.querySelector(".setting-description").innerText = localizeString(id+".description")
    element.querySelector(".checkbox").id = id
    element.querySelector("input[type='checkbox']").checked = value
    return element
}

// endregion

function populate_panel() {
    var panel = document.querySelector("#settings-panel")
    panel.innerHTML = ""
    for (let cat = 0; cat < Object.keys(settingsList).length;cat++) {
        let category = settingsList[Object.keys(settingsList)[cat]]
        var categoryElement = document.createElement("div")
        categoryElement.classList.add("settings-category")
        panel.appendChild(categoryElement)
        var categoryLabel = document.createElement("p")
        categoryLabel.innerText = localizeString(Object.keys(settingsList)[cat])
        categoryElement.appendChild(categoryLabel)
        
        for (let sett = 0; sett < Object.keys(category).length; sett++) {
            var setting = registeredSettings[Object.keys(category)[sett]]
            switch (setting.type) {
                case SETTINGS_TYPE.INTEGER : {
                    categoryElement.appendChild(numberSetting(setting.id, setting.default_value, setting.value, setting.step, setting.min, setting.max))
                    break
                }
                case SETTINGS_TYPE.FLOAT : {
                    categoryElement.appendChild(numberSetting(setting.id, setting.default_value, setting.value, setting.step, setting.min, setting.max))
                    break
                }
                case SETTINGS_TYPE.STRING : {
                    categoryElement.appendChild(stringSetting(setting.id, setting.value))
                    break
                }
                case SETTINGS_TYPE.LIST : {
                    categoryElement.appendChild(listSetting(setting.id, setting.value, AVALIABLE_LANGUAGES))
                    break
                }
                case SETTINGS_TYPE.BOOL : {
                    categoryElement.appendChild(boolSetting(setting.id, setting.value))
                    break
                }
                default : {
                    categoryElement.appendChild(stringSetting(setting.id, setting.value))
                    break
                }
            }
        }
        panel.appendChild(categoryElement)
    }


}
document.addEventListener("locale_changed", (ev) => {
    populate_sidebar()
    populate_panel()
})
document.addEventListener("ready", (ev)=>{
    generate_list()
    populate_sidebar()
    populate_panel()
})


document.addEventListener("ui_input", (ev) => {
    registeredSettings[ev.inputdata.id].set(ev.inputdata.value)
})