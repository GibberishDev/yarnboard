import { Theme, registeredThemes } from "../theme_manager.js";
import { moduleReady } from "./ready.js";

export var themes = []

new Theme("theme.default_dark","#0d0d0d","#333333","#595959","#a6a6a6","#1d6600","#33b300", "Yarnboard Dark")
new Theme("theme.gruvbox_dark","#282828","#928374","#ebdbb2","#fbf1c7","#98971a","#b8bb26", "Gruvbox dark")
new Theme("theme.solarized_dark","#002b36","#073642","#839496","#93a1a1","#268bd2","#268bd2", "Solarized dark")
new Theme("theme.default_light","#849967","#3d541d","#254000","#162600","#ccbb00","#ffea00", "Yarnboard Light")
new Theme("theme.gruvbox_light","#fbf1c1","#928374","#282828","#3c3836","#b57614","#d79921", "Gruvbox light")
new Theme("theme.solarized_light","#eee8d5","#839496","#657b83","#586e75","#859900","#859900", "Solarized light")
new Theme("theme.default_high_contrast","#000000","#ffffff","#ffffff","#ffffff","#d000ff","#ffff00", "High contrast")
new Theme("theme.print","#ffffff","#949494","#595959","#000000","#000000","#000000", "Print friendly")

for (let item in registeredThemes) {
    themes.push(registeredThemes[item].name)
}

moduleReady("themes")

document.addEventListener("ready",()=>{
    registeredThemes["theme.default_dark"].apply()
})
    
    