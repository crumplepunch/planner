import React, { useEffect, useRef } from 'react'
import { useKeyBindings, freeKeyBindings, registerKeyBindings } from '../hooks'

export const Action = ({
  label,
  isFocused,
  hotkey = '',
  mouseOptions = {},
  clickOptions = {},
  touchOptions = {}
}) => {
  const { onMouseLeave } = mouseOptions
  const keyBindingOpts = {}
  const actionRef = useRef()

  keyBindingOpts[hotkey] = {
    down: () => {
      actionRef.current.classList.add('active')
    },
    up: () => {
      actionRef.current.classList.remove('active')
    }
  }
  const actionKeyBindings = useKeyBindings(keyBindingOpts)


  useEffect(() => {
    const current = actionRef.current
    registerKeyBindings(window)(actionKeyBindings)
    return () => freeKeyBindings(window)(actionKeyBindings)
  }, [actionKeyBindings, actionRef])
  useEffect(() => {
    return () => onMouseLeave && onMouseLeave()
  }, [onMouseLeave])

  return <div
    ref={actionRef}
    className='button container hover-text'
    type='button'
    {...clickOptions}
    {...mouseOptions}
    {...touchOptions}
    style={{ color: isFocused ? '#fff' : 'inherit' }}
  > <span>{label}</span></div >
}

const Excuses = [
  `There's been some kind of mixup.`,
  `I definitely made mistakes building this.`,
  `Generally speaking, the real error was building this.`,
  `Look, no one's watching my back on this one. There's gonna be blindspots. Like this one!`,
  `Ah missed a bug.`,
  `I mean yes there are malfunctions but it's pretty sweet right?`,
  `The payload is in another castle.`
]

export const Error = ({ error }) => {
  const { message } = error

  return <div className='container centered max-height max-width flex-column justify-center'>
    <div className='container max-flex-room flex-column justify-center'>
      <h2 className='no-select'>{Excuses[Math.floor(Math.random() * Excuses.length)]}</h2>
      <code>{message}</code>
    </div>
  </div>
}