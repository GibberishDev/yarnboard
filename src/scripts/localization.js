import { moduleReady } from "./registers/ready.js"

export const AVALIABLE_LANGUAGES = [ //HACK: either update each time new language added or read file system for lang files
    "en_us",
    "ru_ru",
]

var currentLanguage = "en_us"
var loadedLanguage = undefined
var fallbackLanguage = undefined

export function localizeString(code) {
    if (loadedLanguage[code] != undefined) {
        return loadedLanguage[code]
    } else if (fallbackLanguage[code] != undefined) {
        console.warn("Localisation code does not exist in " + currentLanguage + ": " + code)
        return fallbackLanguage[code]
    } else {
        console.warn("Localisation code does not exist: " + code)
        return code
    }
}

async function loadLanguageFile(language) {
    var path = "./src/lang/" + language + ".json"
    if (!fileExists(path)) {
        path = "./src/lang/en_us.json"
    }
    var text = {}
    await fetch(path)
    .then((response) => response.json()).then(data=>{
        text = data
    })
    return text
}

function fileExists(url) {
    if (url) {
        var reqeust = new XMLHttpRequest();
        reqeust.open('GET', url, false);
        reqeust.send();
        return reqeust.status==200;
    } else {
        return false;
    }
}
currentLanguage = "en_us" //TODO: Change to load saved language from preferences
loadLanguageFile(currentLanguage).then(lang => {
    loadedLanguage = lang
    moduleReady("language")
})
loadLanguageFile("en_us").then(lang => {
    fallbackLanguage = lang
    moduleReady("fallbackLanguage")
})


document.addEventListener("ui_input", (ev) => {
    if (ev.inputdata.id == "setting.general.language") {
        currentLanguage = ev.inputdata.value
        loadLanguageFile(currentLanguage).then(lang => {
            loadedLanguage = lang
            var event = new Event("locale_changed")
            document.dispatchEvent(event)
            console.log(currentLanguage)
        })
    }
})