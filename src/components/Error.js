import React from 'react'

const Excuses = [
  `There's been some kind of mixup.`,
  `I definitely made mistakes building this.`,
  `Generally speaking, the real error was building this.`,
  `Look, no one's watching my back on this one. There's gonna be blindspots. Like this one!`,
  `Ah missed a bug.`,
  `I mean yes there are malfunctions but it's pretty sweet right?`,
  `The payload is in another castle.`
]

const reports = {
  'Network error: Failed to fetch': 'Is the GraphQL server running? I couldn\'t fetch from it.'
}

export const Error = ({ error }) => {
  const { message } = error


  return <div className='container centered max-height max-width flex-column justify-center'>
    <div className='container max-flex-room flex-column justify-center'>
      <h2 className='no-select'>{Excuses[Math.floor(Math.random() * Excuses.length)]}</h2>
      <code>{reports[message] || message}</code>
    </div>
  </div>
}
