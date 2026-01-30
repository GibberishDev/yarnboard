import { PopupMenu, PopupMenuItem, registeredPopups } from "../popup_menu.js";
import { moduleReady } from "./ready.js";

new PopupMenu("popup.app.openrecent",[])

new PopupMenu("popup.app.file",[
    new PopupMenuItem("action.app.project.new", "popupmenu.title.newproject", "icon.popup.newproject"),
    new PopupMenuItem("action.app.project.open", "popupmenu.title.open", "icon.popup.openproject"),
    new PopupMenuItem(registeredPopups["popup.app.openrecent"], "popupmenu.title.open_recent", "icon.popup.openrecent"),
    new PopupMenuItem("action.app.project.save", "popupmenu.title.save", "icon.popup.saveproject"),
    new PopupMenuItem("action.app.project.save_as", "popupmenu.title.save_as", "icon.popup.saveas"),
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

new PopupMenu("popup.project.addelement", [
    new PopupMenuItem("action.project.elementadd.picture", "popupmenu.title.element_add_picture", "icon.element.picture"),
    new PopupMenuItem("action.project.elementadd.photo", "popupmenu.title.element_add_photo", "icon.element.photo"),
    new PopupMenuItem("action.project.elementadd.text", "popupmenu.title.element_add_text", "icon.element.text"),
    new PopupMenuItem("action.project.elementadd.note", "popupmenu.title.element_add_note", "icon.element.note"),
    new PopupMenuItem("action.project.elementadd.video", "popupmenu.title.element_add_video", "icon.element.video"),
    new PopupMenuItem("action.project.elementadd.aduio", "popupmenu.title.element_add_audio", "icon.element.audio"),
])

moduleReady("popup")