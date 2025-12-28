let modifiers = {
  "Control" : false,
  "Alt" : false,
  "Shift" : false,
  "Meta" : false,
}
var lastPressedKey = ""

export var listeningAccelerators = {}
export var registeredActions = {}
export var currentInputContext = "default"

export function setContext(newContext) {
  currentInputContext = newContext
}

export class BindAction {
  constructor(id, callable, context=[], defaultBind = '', currentBind = '') {
    this.id = id
    this.callable = callable
    this.context = context
    this.defaultBind = defaultBind
    this.currentBind = currentBind
    if (this.currentBind == "") {
      this.currentBind = this.defaultBind
    }
    if (registeredActions[id] == undefined) {
      registeredActions[id] = {}
    }
    if (registeredActions[id].context == undefined) {
      registeredActions[id].context = {}
    }
    if (this.context.length == 0) {
      registeredActions[id]["context"]["default"] = this
    } else {
      this.context.forEach((ctx) => {
        registeredActions[id]["context"][ctx] = this
      })
    }
    registeredActions[id]["currentBind"] = this.currentBind
    updateBinds()
  }
  getBind() {
    if (this.currentBind != "") {
      return listeningAccelerators[this.currentBind]
    } else {
      return undefined
    }
  }
}
export class Keybind {
  constructor(accelerator, action) {
    this.accelerator = accelerator
    this.action = action
    listeningAccelerators[this.accelerator]=this
  }
  setAccelerator(newAccelerator) {
    delete listeningAccelerators[this.accelerator]
    this.accelerator = newAccelerator
    listeningAccelerators[this.accelerator]=this
  }
}
window.onblur = ()=>{
  modifiers = {
    "Control" : false,
    "Alt" : false,
    "Shift" : false,
    "Meta" : false,
  }
}
document.addEventListener("keydown", (ev) => {
  if (Object.keys(modifiers).includes(ev.key)) {
    modifiers[ev.key] = true
  } else {
    lastPressedKey = ev.key
    var accelerator = constructAccelerator()
    checkBinds(accelerator)
  }
  ev.preventDefault()
})
document.addEventListener("keyup", (ev) => {
  if (Object.keys(modifiers).includes(ev.key)) {
    modifiers[ev.key] = false
  }
  ev.preventDefault()
})

function constructAccelerator() {
  var accelerator = ""
  if (modifiers.Control) {accelerator += "control+"} 
  if (modifiers.Alt) {accelerator += "alt+"} 
  if (modifiers.Shift) {accelerator += "shift+"} 
  if (modifiers.Meta) {accelerator += "meta+"}
  accelerator += lastPressedKey
  return accelerator.toLowerCase()
}

function checkBinds(accelerator) {
  if (Object.keys(listeningAccelerators).includes(accelerator)) {
    let keybindEvent = new KeyboardEvent("bind",{bubbles:true})
    keybindEvent.bind = listeningAccelerators[accelerator].context
    document.activeElement.dispatchEvent(keybindEvent)
  }
}

function updateBinds() {
  listeningAccelerators = {}
  Object.keys(registeredActions).forEach((action) => {
    if (listeningAccelerators[registeredActions[action].currentBind] == undefined) {
      listeningAccelerators[registeredActions[action].currentBind] = { context:{} }
    }
    let ctx = Object.keys(registeredActions[action]["context"])[0]
    listeningAccelerators[registeredActions[action].currentBind]["context"][ctx] = registeredActions[action].context[ctx]
  })
}

document.addEventListener("bind", (ev) => {
  ev.bind[currentInputContext].callable()
})
if (navigator.userAgent.includes("yarnboard-electron")) {
  window.yarnboardAPI.bindAccelerator((event, accelerator) => checkBinds(accelerator))
}