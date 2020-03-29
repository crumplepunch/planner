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

const Excuses = [
  `There's been some kind of mixup.`,
  `I definitely made mistakes building this.`,
  `Generally speaking, the real error was building this`,
  `Look, no one's watching my back on this one. There's gonna be blindspots. Like this one!`,
  `Ah missed a bug.`,
  `I mean yes there are malfunctions but it's pretty sweet right?`
]

export const Error = ({ error }) => {
  const { graphQLErrors, message, networkError } = error


  return <div className='container centered max-height max-width flex-column justify-center'>
    <h2>{Excuses[Math.floor(Math.random() * Excuses.length)]}</h2>
    <code>{message}</code>
    <code>(Esc)ape</code>
  </div>
}