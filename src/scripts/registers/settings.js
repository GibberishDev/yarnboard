import { moduleReady } from "./ready.js";
import { BoolSetting, IntSetting, ListSetting, StringSetting, ColorSetting, ButtonSetting } from "../settings_menu.js";
import { AVALIABLE_LANGUAGES } from "../localization.js";
import { themes } from "./themes.js";

new ListSetting("setting.general.language","en_us", AVALIABLE_LANGUAGES)
new StringSetting("setting.general.username","")
new BoolSetting("setting.general.streamermode",false)
new StringSetting("setting.general.streamermode.entries","username")
new IntSetting("setting.general.undolimit",256,-1)
new BoolSetting("setting.general.undoselection",true)
new BoolSetting("setting.interface.hidetabbar",true,"settings.category.interface")
new ListSetting("setting.theme.picker","Yarnboard Dark", themes, "settings.category.theme")
new ButtonSetting("setting.theme.savepreset","action.app.theme.savepreset","settings.category.theme")
new ColorSetting("setting.theme.colorthemedarkest","#0d0d0d","settings.category.theme")
new ColorSetting("setting.theme.colorthemedark","#333333","settings.category.theme")
new ColorSetting("setting.theme.colorthemetextdark","#595959","settings.category.theme")
new ColorSetting("setting.theme.colorthemetext","#a6a6a6","settings.category.theme")
new ColorSetting("setting.theme.colorthemeaccent","#1d6600","settings.category.theme")
new ColorSetting("setting.theme.colorthemeaccentbright","#33b300","settings.category.theme")

moduleReady("settings")