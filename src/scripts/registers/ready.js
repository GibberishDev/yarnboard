var modules = {
    "language" : false,
    "fallbackLanguage" : false,
    "actions" : false,
    "settings" : false,
}

export function moduleReady(module) {
    let ev = new Event("moduleready")
    ev.module = module
    document.dispatchEvent(ev)
}

function appReady() {
    let ev = new Event("ready")
    document.dispatchEvent(ev)
}

document.addEventListener("moduleready", (ev) => {
    modules[ev.module] = true
    let moduleNames = Object.keys(modules)
    var check = true
    var progress = 0
    for (let i = 0; i < moduleNames.length; i++) {
        if (!modules[moduleNames[i]]) check = false
        if (modules[moduleNames[i]]) progress++ 
    }
    console.info(progress + "/" + moduleNames.length +" Module \"" + ev.module + "\" loaded")
    if (check) {
        console.info("%cAll modules ready","color:lime;text-decoration:underline")
        appReady()
    }
})