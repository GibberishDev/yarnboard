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
  document.querySelector("#status-bar-context").textContent = newContext
}

export class BindAction {
  constructor(id, callable, context=[], defaultBind = '', realeaseKeyAction=false, holdAction=false, hidden=false) {
    this.id = id
    this.callable = callable
    this.context = context
    this.defaultBind = defaultBind
    this.currentBind = defaultBind
    this.realeaseKeyAction = realeaseKeyAction
    this.holdAction = holdAction
    this.hidden = hidden
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
    registeredActions[id]["hidden"] = this.hidden
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
  determineBind(ev, true)
})
document.addEventListener("keyup", (ev) => {
  determineBind(ev, false)
})

function determineBind(ev, keyDown) {
  if (Object.keys(modifiers).includes(ev.key)) {
    modifiers[ev.key] = keyDown
  }
  modifiers["Control"] = ev.ctrlKey
  modifiers["Alt"] = ev.altKey
  modifiers["Shift"] = ev.shiftKey
  modifiers["Meta"] = ev.metaKey
  lastPressedKey = ev.code
  var accelerator = constructAccelerator()
  checkBinds(accelerator, ev.repeat, keyDown)

}

function constructAccelerator() {
  var accelerator = ""
  if (modifiers.Control) {accelerator += "control+"} 
  if (modifiers.Alt) {accelerator += "alt+"} 
  if (modifiers.Shift) {accelerator += "shift+"} 
  if (modifiers.Meta) {accelerator += "meta+"}
  accelerator += lastPressedKey.replace("Key","")
  var exceptions = [
    "alt+AltLeft",
    "control+ControlLeft",
    "shift+ShiftLeft",
    "alt+AltRight",
    "control+ControlRight",
    "shift+ShiftRight",
    "meta+MetaLeft"
  ]
  if (exceptions.includes(accelerator)) accelerator = lastPressedKey.replace("Key","")
  return accelerator.toLowerCase()
}

function checkBinds(accelerator, isHold, isKeyDown) {
  if (Object.keys(listeningAccelerators).includes(accelerator)) {
    let bind = listeningAccelerators[accelerator]
    let keybindEvent = new KeyboardEvent("bind",{bubbles:true})
    let ctx = ""
    if (Object.keys(bind.context).includes(currentInputContext)) {
      ctx = currentInputContext
    } else if (Object.keys(listeningAccelerators[accelerator].context).toString() == "default") {
      ctx = "default"
    } else {
      return
    }
    let contextBind = bind.context[ctx]
    if (isHold == contextBind.holdAction && isKeyDown != contextBind.realeaseKeyAction) {
      keybindEvent.bind = contextBind
    } else {
      return
    }
    document.activeElement.dispatchEvent(keybindEvent)
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
if (navigator.userAgent.includes("yarnboard")) {
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
    setContext("text_input")
  } else {
    setContext(previousInputContext)
  }
}

document.addEventListener("action", (ev) => {
  registeredActions[ev.action].context[ev.context].callable(ev)
})

// IDEA: develop way to display keybindings as html elements. Maybe implement different styles of display (icon, text,none and combined???)