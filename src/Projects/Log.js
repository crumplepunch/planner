import React from 'react'
import ReactMarkdown from 'react-markdown'
const LogName = ({ name }) => <code>{name}</code>
const LogDate = ({ date }) => {

  return <code>{Intl.DateTimeFormat().format(date)}</code>
}
export default ({ name, date, markdown }) => {
  return <div className='container flex-column max-flex-room'>
    <div className='container flex-row justify-space-between'>
      <LogName name={name} />
      <LogDate date={date} />
    </div>
    <div className='container'>
      <ReactMarkdown source={markdown} />
    </div>
  </div>
}