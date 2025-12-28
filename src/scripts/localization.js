var currentLanguage = "en_us"
var loadedLanguage = undefined
var fallbackLanguage = undefined

async function localizeString(code) {
    if (loadedLanguage == undefined) {
        await loadLanguageFile(currentLanguage).then(data => loadedLanguage = data)
    } else if (loadedLanguage["language"] != currentLanguage) {
        await loadLanguageFile(currentLanguage).then(data => loadedLanguage = data)
    }
    return loadedLanguage[code]
}

async function loadLanguageFile(language) {
    var path = "./src/lang/" + language + ".json"
    if (!fileExists(path)) {
        path = "./src/lang/en_us.json"
    }
    await fetch(path)
    .then((response) => response.json()).then(data=>{
        text = data
    })
    return text
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}
currentLanguage = "en_us" //TODO: Change to load save language from preferences
loadLanguageFile(currentLanguage).then(lang => loadedLanguage = lang)
loadLanguageFile("en_us")