import { moduleReady } from "./ready.js";
import { BoolSetting, IntSetting, ListSetting, StringSetting, ColorSetting } from "../settings_menu.js";

new ListSetting("setting.general.language","en_us")
new StringSetting("setting.general.username","")
new BoolSetting("setting.general.streamermode",false)
new StringSetting("setting.general.streamermode.entries","username")
new IntSetting("setting.general.undolimit",256,-1)
new BoolSetting("setting.general.undoselection",true)
new BoolSetting("setting.interface.hidetabbar",true,"settings.category.interface")
new ColorSetting("setting.theme.colorthemedarkest","#0d0d0d","settings.category.theme")
new ColorSetting("setting.theme.colorthemedark","#333333","settings.category.theme")
new ColorSetting("setting.theme.colorthemetextdark","#595959","settings.category.theme")
new ColorSetting("setting.theme.colorthemetext","#a6a6a6","settings.category.theme")
new ColorSetting("setting.theme.colorthemeacent","#1d6600","settings.category.theme")
new ColorSetting("setting.theme.colorthemeacentbright","#33b300","settings.category.theme")

moduleReady("settings")

document.addEventListener("settingUpdated", (ev)=>{
    if (ev.id == "setting.theme.colorthemedarkest") {document.documentElement.style.setProperty("--var-color-theme-darkest", ev.value)}
    else if (ev.id == "setting.theme.colorthemedark") { document.documentElement.style.setProperty("--var-color-theme-dark", ev.value)}
    else if (ev.id == "setting.theme.colorthemetextdark") { document.documentElement.style.setProperty("--var-color-theme-text-dark", ev.value)}
    else if (ev.id == "setting.theme.colorthemetext") { document.documentElement.style.setProperty("--var-color-theme-text", ev.value)}
    else if (ev.id == "setting.theme.colorthemeacent") { document.documentElement.style.setProperty("--var-color-theme-accent", ev.value)}
    else if (ev.id == "setting.theme.colorthemeacentbright") { document.documentElement.style.setProperty("--var-color-theme-accent-bright", ev.value)}
})

    // --var-color-theme-darkest : #0d0d0d;
    // --var-color-theme-dark : #333333;
    // --var-color-theme-text-dark : #595959;
    // --var-color-theme-text : #a6a6a6;
    // --var-color-theme-accent : #1d6600;
    // --var-color-theme-accent-bright : #33b300;