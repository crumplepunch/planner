import React, { useState } from 'react'
import debug from 'debug'

const log = debug('Project:general')
const statelog = debug('Project:state')
const Button = ({ label, onClick = e => { e.preventDefault() } }) => <button type='button' onClick={onClick}>{label}</button>

export default ({ name, description, _id }) => {
  const [expanded, setExpand] = useState(false)
  statelog({
    expanded
  })

  return <div className='project container flex-column' id={_id} onClick={e => {
    e.preventDefault()
    log({
      currentTarget: e.currentTarget.id,
      target: e.target,
      type: e.target.type
    })
    if (e.target.type !== 'button') {
      setExpand(!expanded)
    }

  }}>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
    {expanded && <div className="buttons">
      <Button label='Edit Project'></Button>
      <Button label='View Project'></Button>
    </div>}
  </div >
}