import { Icon } from "../icon_manager.js"
import { moduleReady } from "./ready.js"

// #region templates

const appIconTemplate = `<svg class="svg-app-icon" width="26" height="26" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" data-id="icon.app.icon">
 <defs id="defs">
  <mask id="pin-mask">
   <circle fill="#fff" cx="1.6" cy="2.4" r="1.6" mask="url(#pin-mask)" stroke-width=".11" stroke="none"></circle>
   <path stroke="none" d="m2 1.3 0.76 0.65-0.51 0.22-0.45 0.92-0.31-0.26-0.72 0.7 0.57-0.83-0.3-0.26 0.84-0.6z" stroke-linecap="round" stroke-linejoin="round" stroke-width=".065" style="paint-order:normal" fill="#000"></path>
  </mask>
 </defs>
 <g transform="translate(0 -2.9)">
  <circle class="svg-app-icon yarn" transform="matrix(7.6 0 0 7.6 .25 .085)" cx="1.6" cy="2.4" r="1.6" mask="url(#pin-mask)" stroke-width="0"></circle>
  <path class="svg-app-icon strand" d="m8.8 29c2 0.82 9.6 2.3 12 1.5 4.6-1.3 4.7-9.1 7.9-8.9 4.4 0.19-0.25 6.2-0.25 6.2" fill-opacity="0" stroke-linecap="round" stroke-width="2" style="paint-order:normal"></path>
 </g>
</svg>
`
const AudioElementIconTemplate = `
    <svg class="svg-audio-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path class="svg-audio-element note" d="m1.3 8c0.56 0 0.5-1.5 1.1-1.5 0.56 0 0.56 4.5 1.1 4.5 0.56 0 0.56-7.5 1.1-7.5 0.56 0 0.56 9 1.1 9 0.62 0 0.48-11 1.1-10 0.48 0.012 0.56 12 1.1 12 0.32 0 0.61-12 1.1-12 0.56 0 0.63 10 1.1 10 0.27 0 0.56-9 1.1-9s0.55 7.5 1.1 7.5c0.32 0 0.56-4.5 1.1-4.5s0.65 1.5 1.1 1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" style="paint-order:stroke markers fill"/>
        <path class="svg-audio-element plus" d="m16 2.5h-2v-2h-1v2h-2v1h2v2h1v-2h2z" style="paint-order:stroke markers fill"/>
    </svg>`

const PhotoElementIconTemplate = `<svg class="svg-photo-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect class="svg-photo-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
    <rect class="svg-photo-element inner-rect" width="11" height="7" x="2.5" y="2.5"/>
    <path class="svg-photo-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,11 H 13"/>
    <path class="svg-photo-element line" style="stroke-linecap:square;paint-order:stroke fill" d="m 4.5,13 h 7"/>
    <path class="svg-photo-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
</svg>`

const PictureElementIconTemplate = `
<svg class="svg-picture-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect class="svg-picture-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
    <rect class="svg-picture-element inner-rect" width="11"height="11"x="2.5"y="2.5"/>
    <path class="svg-picture-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
</svg>`

const TextElementIconTemplate = `
<svg class="svg-text-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect class="svg-text-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,3 H 13"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,5 H 8"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 8,7 h 5"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 10,5 h 3"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,7 H 6"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,11 H 8"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 8,13 h 5"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="m 10,11 h 3"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill"d="M 3,13 H 6"/>
    <path class="svg-text-element line" style="stroke-linecap:square;paint-order:stroke fill" d="M 3,9 H 13"/>
    <path class="svg-text-element plus" style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
</svg>`

const NoteElementIconTemplate = `
<svg class="svg-note-element icon" width="26" height="26" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect class="svg-note-element outer-rect" style="paint-order:stroke fill"width="13"height="13"x="1.5"y="1.5"/>
    <path class="svg-note-element line"style="stroke-linecap:round;paint-order:stroke fill"d="M 3,8 C 3.5,7.5 3.5,7 4,7 5,7 5,8 6,8 7,8 7,7 8,7 c 1,0 1,1 2,1 1,0 1,-1 2,-1 0.5,0 0.5,0.5 1,1"/>
    <path class="svg-note-element line"style="stroke-linecap:round;paint-order:stroke fill"d="M 3.5,11 C 4,10.5 4,10 5,10 c 1,0 1,1 2,1 1,0 1,-1 2,-1 1,0 1,0.5 1.5,1"/>
    <rect class="svg-note-element shade"style="paint-order:stroke fill;"width="13.1"height="2.1"x="1.45"y="1.45"/>
    <circle class="svg-note-element dot"cx="13"cy="11"r="0.5"/>
    <path class="svg-note-element plus"style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
</svg>`

const videoElementIconTemplate = `
<svg class="svg-video-element icon" width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path class="svg-video-element plus"style="paint-order:stroke fill" d="m 13.5,0.5 v 2 h 2 v 1 h -2 v 2 h -1 v -2 h -2 v -1 h 2 v -2 z"/>
    <path class="svg-video-element triangle"style="stroke-width:1;stroke-linejoin:round;paint-order:stroke fill;"d="m 1.5,1.5 13,6.5 -13,6.5 z"/>
</svg>`

const newProjectIconTemplate =`<svg class="svg-new-project" width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g stroke-miterlimit="2">
        <path class="svg-new-project rect" d="m25 29v-26h-14l-4 4v22z" stroke-width="2" style="paint-order:stroke markers fill"/>
        <rect class="svg-new-project rect" x="16" y="7" width="6" height="6" stroke-width="2" style="paint-order:stroke markers fill"/>
        <rect class="svg-new-project rect" x="9" y="18" width="6" height="9" stroke-width="2" style="paint-order:stroke markers fill"/>
        <path class="svg-new-project line" d="m19 8c-1 5-7 11-7 11" fill="none" stroke-linecap="round" stroke-width="1" style="paint-order:stroke markers fill"/>
        <path class="svg-new-project rect" d="m7 7h4v-4z" stroke-width="2" style="paint-order:stroke markers fill"/>
        <path class="svg-new-project cross" d="m31 5v2h-4v4h-2v-4h-4v-2h4v-4h2v4z" stroke-width="2" style="paint-order:stroke markers fill"/>
    </g>
</svg>`

const openProjectIconTemplate = `<svg class="svg-open-project" width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path class="svg-open-project rect" d="m4 6h4c4 0 4 4 8 4h12v16h-24z" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" style="paint-order:stroke markers fill"/>
  <path class="svg-open-project shade" d="m3 10h13v-1c-4 0-4-4-8-4h-5z" style="paint-order:stroke markers fill"/>
</svg>`

const openRecentIconTemplate = `<svg class="svg-open-recent" width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
 <path  class="svg-open-recent rect" d="m4 6h4c4 0 4 4 8 4h12v16h-24z" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" style="paint-order:stroke markers fill"/>
 <path class="svg-open-recent shade" d="m3 10h13v-1c-4 0-4-4-8-4h-5z" style="paint-order:stroke markers fill"/>
 <circle class="svg-open-recent clock" cx="16" cy="18" r="6" fill="none" stroke-linecap="round" stroke-miterlimit="2" style="paint-order:stroke markers fill"/>
 <path class="svg-open-recent clock" d="m16 14v4l2 2" fill="none" stroke-linecap="round" stroke-miterlimit="2" style="paint-order:stroke markers fill"/>
</svg>`

const saveProjectIconTemplate = `<svg class="svg-save-project" width="128" height="128" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path class="svg-save-project rect" d="m4 4h20l4 4v20h-24z" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" style="paint-order:stroke markers fill"/>
  <circle class="svg-save-project circle" cx="16" cy="16" r="4" style="paint-order:stroke markers fill"/>
  <path class="svg-save-project cover" d="m9.5 3 12 1e-7v8h-12z" style="paint-order:stroke markers fill"/>
  <path class="svg-save-project window" d="m20 9h-3v-5h3z" style="paint-order:stroke markers fill"/>
</svg>`

const saveAsIconTemplate = `<svg class="svg-save-as" width="128" height="128" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path class="svg-save-as rect" d="m4 4h20l4 4v20h-24z" stroke-linecap="round" stroke-miterlimit="2" stroke-width="2" style="paint-order:stroke markers fill"/>
  <circle class="svg-save-as circle" cx="16" cy="16" r="4" style="paint-order:stroke markers fill"/>
  <path class="svg-save-as cover"  d="m9.5 3 12 1e-7v8h-12z" style="paint-order:stroke markers fill"/>
  <path class="svg-save-as window" d="m20 9h-3v-5h3z" style="paint-order:stroke markers fill"/>
  <path class="svg-save-as pencil" d="m19 30 1-3 8-8 2 2-8 8z" stroke-linecap="square" stroke-miterlimit="3" style="paint-order:stroke markers fill"/>
  <path class="svg-save-as pencil-tip" d="m18 31 1.5-2.5 1 1z" style="paint-order:stroke markers fill"/>
</svg>`

const viewPanIconTemplate = `<svg width="48" height="48" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
 <g fill="#fff" stroke="#000" stroke-linecap="square" stroke-miterlimit="2" stroke-width=".5">
  <path d="m9 32-8-8 8-8z" style="paint-order:stroke markers fill"/>
  <path d="m16 10 8-8 8 8z" style="paint-order:stroke markers fill"/>
  <path d="m38 16 8 8-8 7z" style="paint-order:stroke markers fill"/>
  <path d="m32 38-8 8-8-8z" style="paint-order:stroke markers fill"/>
  <path d="m24 16c-6.9 0-12 8-12 8s4.9 8 12 8c6.9 0 12-8 12-8s-4.9-8-12-8zm0.15 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" stroke-width=".5" style="paint-order:stroke markers fill"/>
 </g>
</svg>`
// #endregion

new Icon("icon.app.icon",appIconTemplate)
new Icon("icon.element.video",videoElementIconTemplate)
new Icon("icon.element.note",NoteElementIconTemplate)
new Icon("icon.element.text",TextElementIconTemplate)
new Icon("icon.element.picture",PictureElementIconTemplate)
new Icon("icon.element.photo",PhotoElementIconTemplate)
new Icon("icon.element.audio",AudioElementIconTemplate)
new Icon("icon.popup.newproject",newProjectIconTemplate)
new Icon("icon.popup.openproject",openProjectIconTemplate)
new Icon("icon.popup.openrecent",openRecentIconTemplate)
new Icon("icon.popup.saveproject",saveProjectIconTemplate)
new Icon("icon.popup.saveas",saveAsIconTemplate)
new Icon("icon.pointer.view.pan",viewPanIconTemplate)

moduleReady("icons")