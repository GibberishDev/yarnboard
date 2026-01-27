import { PopupMenu, PopupMenuItem, registeredPopups } from "../popup_menu.js";
import { moduleReady } from "./ready.js";

new PopupMenu("popup.app.file",[
    new PopupMenuItem("action.app.project.new", "popupmenu.title.newproject", "icon.popup.newproject"),
    new PopupMenuItem("action.app.project.open", "popupmenu.title.open"),
    new PopupMenuItem("action.app.project.open_recent", "popupmenu.title.open_recent"),
    new PopupMenuItem("action.app.project.save", "popupmenu.title.save"),
    new PopupMenuItem("action.app.project.save_as", "popupmenu.title.save_as"),
])
new PopupMenu("popup.app.edit",[
    new PopupMenuItem("action.app.project.undo", "popupmenu.title.undo"),
    new PopupMenuItem("action.app.project.redo", "popupmenu.title.redo"),
    new PopupMenuItem("action.app.project.undo_history", "popupmenu.title.openundo_history_recent"),
    "divider",
    new PopupMenuItem("action.app.viewport.settings", "popupmenu.title.settings"),
    new PopupMenuItem("action.app.viewport.command_palette", "popupmenu.title.command_aplette"),
])
new PopupMenu("popup.app.view",[
    new PopupMenuItem("action.app.project.close", "popupmenu.title.close_viewport")
])

new PopupMenu("popup.app.main",[
    new PopupMenuItem(registeredPopups["popup.app.file"], "popup.title.file"),
    new PopupMenuItem(registeredPopups["popup.app.edit"], "popup.title.edit"),
    new PopupMenuItem(registeredPopups["popup.app.view"], "popup.title.view")
])

moduleReady("popup")