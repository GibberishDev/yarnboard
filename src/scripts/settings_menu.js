import { AVALIABLE_LANGUAGES, localizeString } from "./localization.js"
import { inputText } from "./keybinds.js"
import { fuzzySearchStringArray } from "./fuzzy_search.js"

export var registeredSettings = {}
var settingsList = {}
var searchList = {}
export const SETTINGS_TYPE  = Object.freeze({
    STRING : 0,
    LIST : 1,
    INTEGER : 2,
    FLOAT : 3,
    BOOL : 4,
    COLOR : 5,
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
        // console.info("Set " + this.id + " value to \"" + value + "\"")
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
export class ColorSetting extends Setting {
    constructor(id, default_value, category_id="settings.category.general", value = undefined) {
        super(id, SETTINGS_TYPE.COLOR, default_value, category_id, value)
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
        settingsList[settting.category_id][settting.id] = {
            "type" : settting.type,
            "category" : settting.category_id,

        }
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

const colorTemplate = `
        <div class="setting-label"></div>
        <div class="setting-description"></div>
        <div class="color-input">
            <div class="color-preview">
            <div class="bg"></div>
            <input type="text" class="hex" onblur="ui_color_hex(event)">
            </div>
            <div class="color-picker-range hue"><input type="range" min="0" max="360" oninput="ui_color_hue(event)"><input type="number" min="0" max="360" onblur="ui_color_hue(event)"></div>
            <div class="color-picker-range sat"><input type="range" min="0" max="100" oninput="ui_color_sat(event)"><input type="number" min="0" max="100" onblur="ui_color_sat(event)"></div>
            <div class="color-picker-range val"><input type="range" min="0" max="100" oninput="ui_color_val(event)"><input type="number" min="0" max="100" onblur="ui_color_val(event)"></div>
        </div>`


function colorSetting(id, value) {
    var element = document.createElement("div")
    element.classList.add("setting","type-color")
    element.innerHTML = colorTemplate
    element.querySelector(".setting-label").innerText = localizeString(id)
    element.querySelector(".setting-description").innerText = localizeString(id+".description")
    element.querySelector(".hex").id = id
    colorInit(value, element)
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
        categoryElement.dataset.id = Object.keys(settingsList)[cat]
        panel.appendChild(categoryElement)
        var categoryLabel = document.createElement("p")
        categoryLabel.innerText = localizeString(Object.keys(settingsList)[cat])
        categoryElement.appendChild(categoryLabel)
        
        for (let sett = 0; sett < Object.keys(category).length; sett++) {
            var setting = registeredSettings[Object.keys(category)[sett]]
            var el = undefined
            switch (setting.type) {
                case SETTINGS_TYPE.INTEGER : {
                    el = numberSetting(setting.id, setting.default_value, setting.value, setting.step, setting.min, setting.max)
                    break
                }
                case SETTINGS_TYPE.FLOAT : {
                    el = numberSetting(setting.id, setting.default_value, setting.value, setting.step, setting.min, setting.max)
                    break
                }
                case SETTINGS_TYPE.STRING : {
                    el = stringSetting(setting.id, setting.value)
                    break
                }
                case SETTINGS_TYPE.LIST : {
                    el = listSetting(setting.id, setting.value, AVALIABLE_LANGUAGES)
                    break
                }
                case SETTINGS_TYPE.BOOL : {
                    el = boolSetting(setting.id, setting.value)
                    break
                }
                case SETTINGS_TYPE.COLOR : {
                    el = colorSetting(setting.id, setting.value)
                    break
                }
                default : {
                    el = stringSetting(setting.id, setting.value)
                    break
                }
            }
            el.dataset.panelid = setting.id
            settingsList[Object.keys(settingsList)[cat]][setting.id].translation = el.querySelector(".setting-label").innerText
            categoryElement.appendChild(el)
            
        }
        panel.appendChild(categoryElement)
    }
    genSearchList()
}

document.addEventListener("locale_changed", (ev) => {
    update()
})

document.addEventListener("ready", (ev)=>{
    generate_list()
})

document.addEventListener("ui_input", (ev) => {
    if (Object.keys(registeredSettings).includes(ev.inputdata.id)) {
        registeredSettings[ev.inputdata.id].set(ev.inputdata.value)
    } else {
    }
})

export function update() {
    populate_sidebar()
    populate_panel()
}

export function getSetting(id) {
    return registeredSettings[id].value
}

export function bindSearchEvents(searchBarElement) {
    searchBarElement.addEventListener("focus", ()=>{inputText(true)})
    searchBarElement.addEventListener("blur", ()=>{inputText(false)})
    searchBarElement.addEventListener("input", ev=>{searchSettings(ev)})
}

function genSearchList() {
    searchList = {}
    for (let cat in settingsList) {
        for (let setting in settingsList[cat]) {
            searchList[settingsList[cat][setting].translation] = setting
        }
    }
}

function searchSettings(event) {
    let searchTerm = event.target.value
    if (searchTerm == "") {
        update()
        return
    }
    let result = fuzzySearchStringArray(Object.keys(searchList), searchTerm, 0.4)
    document.querySelectorAll(".settings-sidebar-subcategory").forEach(el=>el.classList.add("hidden"))
    document.querySelectorAll(".setting").forEach(el=>el.classList.add("hidden"))
    for (let i = result.length - 1; i>=0;i--) {
        let settingId = searchList[result[i][0]]
        let sidebar_element = document.querySelector("[data-id=\"" +  settingId + "\"]")
        let panel_element = document.querySelector("[data-panelid=\"" + settingId  + "\"]")
        sidebar_element.classList.remove("hidden")
        panel_element.classList.remove("hidden")
        let sidebarCategoryElement = document.querySelector("#settings-sidebar").querySelector("[data-id=\""+ registeredSettings[settingId].category_id + "\"]")
        sidebarCategoryElement.insertBefore(sidebar_element, sidebarCategoryElement.firstChild.nextSibling)
        let panelCategoryElement = document.querySelector("#settings-panel").querySelector("[data-id=\""+ registeredSettings[settingId].category_id + "\"]")
        panelCategoryElement.insertBefore(panel_element, panelCategoryElement.firstChild.nextSibling)
    }


}