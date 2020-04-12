import React, { useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useKeyBindings } from '../hooks'


export const Action = ({
  label,
  isFocused,
  hotkey = '',
  ref = window,
  to,
  mouseOptions = {},
  clickOptions = {},
  touchOptions = {}
}) => {
  const { onMouseLeave } = mouseOptions
  const keyBindingOpts = {}
  const actionRef = useRef()
  const history = useHistory()

  keyBindingOpts[hotkey] = {
    down: () => {
      actionRef.current.classList.add('active')
    },
    up: () => {
      actionRef.current.classList.remove('active')
      if (to) history.push(to)
    }
  }

  useKeyBindings(keyBindingOpts, ref)
  useEffect(() => {
    return () => onMouseLeave && onMouseLeave()
  }, [onMouseLeave])

  if (to) {
    return <Link to={to}>
      <div
        ref={actionRef}
        className='button container hover-text'
        type='button'
        {...clickOptions}
        {...mouseOptions}
        {...touchOptions}
        style={{ color: isFocused ? '#fff' : 'inherit' }}
      > <span>{label}</span></div >
    </Link>
  }
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
