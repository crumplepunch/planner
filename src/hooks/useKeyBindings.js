export const registerKeyBindings = target => bindingFns => Object.keys(bindingFns).forEach(eventType => target.addEventListener(eventType, bindingFns[eventType]))
export const freeKeyBindings = target => bindingFns => Object.keys(bindingFns).forEach(eventType => target.removeEventListener(eventType, bindingFns[eventType]))

export const useKeyBindings = (keys) => {
  const eventListeners = {
    keydown: ({ key }) => ((keys[key] || {}).down || (() => { }))(),
    keyup: ({ key }) => ((keys[key] || {}).up || (() => { }))(),
  }

  return eventListeners
}