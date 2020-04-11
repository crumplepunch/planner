import React, { useEffect, useRef } from 'react'
import { useKeyBindings } from '../hooks'

export const Action = ({
  label,
  isFocused,
  hotkey = '',
  ref = window,
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
  useKeyBindings(keyBindingOpts, ref)

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
