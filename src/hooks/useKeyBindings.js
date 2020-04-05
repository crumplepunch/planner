import { useEffect } from 'react'
const registerKeyBindings = target => bindingFns => target && Object.keys(bindingFns).forEach(eventType => target.addEventListener(eventType, bindingFns[eventType]))
const freeKeyBindings = target => bindingFns => target && Object.keys(bindingFns).forEach(eventType => target.removeEventListener(eventType, bindingFns[eventType]))

export const useKeyBindings = (keys, target) => {
  const eventListeners = {
    keydown: ({ key }) => ((keys[key] || {}).down || (() => { }))(),
    keyup: ({ key }) => ((keys[key] || {}).up || (() => { }))(),
  }

  useEffect(() => {
    target && registerKeyBindings(target)(eventListeners)

    return () => {
      freeKeyBindings(target)(eventListeners)
    }
  })

  return [
    () => { freeKeyBindings(target)(eventListeners) },
    () => { registerKeyBindings(target)(eventListeners) },
  ]
} 