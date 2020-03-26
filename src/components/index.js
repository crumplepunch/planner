import React from 'react'

export const Action = ({
  label,
  isFocused,
  mouseOptions = {},
  clickOptions = {},
  touchOptions = {}
}) => <div
  className='button'
  type='button'
  {...clickOptions}
  {...mouseOptions}
  {...touchOptions}
  style={{ color: isFocused ? '#fff' : 'inherit' }}
>{label}</div>