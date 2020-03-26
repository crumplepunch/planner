import React from 'react'

export const Action = ({ isFocused, focus, unfocus, label, onClick = e => { e.preventDefault() } }) => <div
  className='button'
  type='button'
  onMouseEnter={focus}
  onMouseLeave={unfocus}
  onClick={onClick}
  onTouchStart={onClick}
  style={{ color: isFocused ? '#fff' : 'inherit' }}
>{label}</div>