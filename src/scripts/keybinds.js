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

var previousInputContext = "default"

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
window.onfocus = ()=>{
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
  }
  modifiers["Control"] = ev.ctrlKey
  modifiers["Alt"] = ev.altKey
  modifiers["Shift"] = ev.shiftKey
  modifiers["Meta"] = ev.metaKey
  lastPressedKey = ev.code
  var accelerator = constructAccelerator()
  checkBinds(accelerator)
  if (accelerator == "control+p") ev.preventDefault()
})
document.addEventListener("keyup", (ev) => {
  if (Object.keys(modifiers).includes(ev.key)) {
    modifiers[ev.key] = false
  }
})

function constructAccelerator() {
  var accelerator = ""
  if (modifiers.Control) {accelerator += "control+"} 
  if (modifiers.Alt) {accelerator += "alt+"} 
  if (modifiers.Shift) {accelerator += "shift+"} 
  if (modifiers.Meta) {accelerator += "meta+"}
  accelerator += lastPressedKey.replace("Key","")
  return accelerator.toLowerCase()
}

function checkBinds(accelerator) {
  if (Object.keys(listeningAccelerators).includes(accelerator)) {
    let keybindEvent = new KeyboardEvent("bind",{bubbles:true})
    if (Object.keys(listeningAccelerators[accelerator].context).includes(currentInputContext)) {
      keybindEvent.bind = listeningAccelerators[accelerator].context[currentInputContext]
      document.activeElement.dispatchEvent(keybindEvent)
    } else if (Object.keys(listeningAccelerators[accelerator].context).toString() == "default") {
      keybindEvent.bind = listeningAccelerators[accelerator].context["default"]
      document.activeElement.dispatchEvent(keybindEvent)
    }
  }
}

function updateBinds() {
  listeningAccelerators = {}
  Object.keys(registeredActions).forEach((action) => {
    if (listeningAccelerators[registeredActions[action].currentBind] == undefined) {
      listeningAccelerators[registeredActions[action].currentBind] = { context:{} }
    }
    let ctxList = Object.keys(registeredActions[action]["context"])
    ctxList.forEach((ctx)=>{
      listeningAccelerators[registeredActions[action].currentBind]["context"][ctx] = registeredActions[action].context[ctx]
    })
  })
}

document.addEventListener("bind", (ev) => {
  ev.bind.callable()
})
if (navigator.userAgent.includes("yarnboard-electron")) {
  window.yarnboardAPI.bindAccelerator((event, accelerator) => checkBinds(accelerator))
}

export function executeAction(id) {
  if (Object.keys(registeredActions[id].context).includes(currentInputContext)) {
    registeredActions[id].context[currentInputContext].callable()
  } else if (Object.keys(registeredActions[id].context).includes("default")){
    registeredActions[id].context["default"].callable()
  }
}

export function inputText(state) {
  if (state) {
    previousInputContext = currentInputContext
    currentInputContext = "text_input"
  } else {
    currentInputContext = previousInputContext
  }
}

document.addEventListener("action", (ev) => {
  registeredActions[ev.action].context[ev.context].callable()
})


// IDEA: develop way to display keybindings as html elements. Maybe implement different styles of display (icon, text,none and combined???)