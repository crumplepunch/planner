import React, { useEffect } from 'react'

export const Action = ({
  label,
  isFocused,
  mouseOptions = {},
  clickOptions = {},
  touchOptions = {}
}) => {
  const { onMouseLeave } = mouseOptions

  useEffect(() => {
    return () => onMouseLeave && onMouseLeave()
  }, [onMouseLeave])

  return <div
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