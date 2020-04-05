import { useEffect, useState } from 'react'
const registerKeyBindings = target => bindingFns => {
  target && Object.keys(bindingFns).forEach(eventType => target.addEventListener(eventType, bindingFns[eventType]))
}
const freeKeyBindings = target => bindingFns => {
  target && Object.keys(bindingFns).forEach(eventType => target.removeEventListener(eventType, bindingFns[eventType]))
}

export const useKeyBindings = (keys, target) => {
  const eventListeners = {
    keydown: ({ key }) => ((keys[key] || {}).down || (() => { }))(),
    keyup: ({ key }) => ((keys[key] || {}).up || (() => { }))(),
  }
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (enabled) {
      target && registerKeyBindings(target)(eventListeners)
    } else {
      target && freeKeyBindings(target)
    }

    return () => {
      freeKeyBindings(target)(eventListeners)
    }
  })

  return [
    () => setEnabled(false),
    () => setEnabled(true),
  ]
} 