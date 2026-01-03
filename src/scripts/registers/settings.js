import { moduleReady } from "./ready.js";
import { BoolSetting, IntSetting, ListSetting, StringSetting } from "../settings_menu.js";

new ListSetting("setting.general.language","en_us")
new StringSetting("setting.general.username","")
new BoolSetting("setting.general.streamermode",false)
new StringSetting("setting.general.streamermode.entries","username")
new IntSetting("setting.general.undolimit",256,-1)
new BoolSetting("setting.general.undoselection",true)

moduleReady("settings")
