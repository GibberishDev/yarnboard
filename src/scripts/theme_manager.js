import { registeredSettings, updateSettingsViewport } from "./settings_menu.js"

export var registeredThemes = {}

export class Theme {
    constructor(id, bg,border,textDark, text, accent, accentBright, name) {
        this.bg = bg
        this.border = border
        this.textDark = textDark
        this.text = text
        this.accent = accent
        this.accentBright = accentBright
        this.name = name
        registeredThemes[id] = this
    }
    apply = () => {
        registeredSettings["setting.theme.colorthemedarkest"].set(this.bg)
        registeredSettings["setting.theme.colorthemedark"].set(this.border)
        registeredSettings["setting.theme.colorthemetextdark"].set(this.textDark)
        registeredSettings["setting.theme.colorthemetext"].set(this.text)
        registeredSettings["setting.theme.colorthemeaccent"].set(this.accent)
        registeredSettings["setting.theme.colorthemeaccentbright"].set(this.accentBright)
        document.documentElement.style.setProperty("--var-color-theme-darkest", this.bg)
        document.documentElement.style.setProperty("--var-color-theme-dark", this.border)
        document.documentElement.style.setProperty("--var-color-theme-text-dark", this.textDark)
        document.documentElement.style.setProperty("--var-color-theme-text", this.text)
        document.documentElement.style.setProperty("--var-color-theme-accent", this.accent)
        document.documentElement.style.setProperty("--var-color-theme-accent-bright", this.accentBright)
    }
}

document.addEventListener("settingUpdated", (ev)=>{
    if (ev.id == "setting.theme.colorthemedarkest") {document.documentElement.style.setProperty("--var-color-theme-darkest", ev.value)}
    else if (ev.id == "setting.theme.colorthemedark") { document.documentElement.style.setProperty("--var-color-theme-dark", ev.value)}
    else if (ev.id == "setting.theme.colorthemetextdark") { document.documentElement.style.setProperty("--var-color-theme-text-dark", ev.value)}
    else if (ev.id == "setting.theme.colorthemetext") { document.documentElement.style.setProperty("--var-color-theme-text", ev.value)}
    else if (ev.id == "setting.theme.colorthemeaccent") { document.documentElement.style.setProperty("--var-color-theme-accent", ev.value)}
    else if (ev.id == "setting.theme.colorthemeaccentbright") { document.documentElement.style.setProperty("--var-color-theme-accent-bright", ev.value)}
})

document.addEventListener("settingUpdated", (ev)=>{
    if (ev.id == "setting.theme.picker") {
        for (let id in registeredThemes) {
            if (registeredThemes[id].name == ev.value) {
                registeredThemes[id].apply()
                updateSettingsViewport()
            }
        }
    }
})