import React, { useState } from 'react'
import { Action } from '../components'
import debug from 'debug'

const log = debug('Project:general')
const statelog = debug('Project:state')
const Header = ({ name, description, expanded }) => {
  return <div className='header flex-column'>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
  </div>
}

export const ProjectDescription = ({ _id, description }) => {
  return <div>
    <h1>Description</h1>
    <p>{description}</p>
  </div>
}

export const ProjectLog = ({ markdown, date, name }) => {
  return <div className='container flex-column max-flex-room'>
    <header className='container flex-row justify-space-between'>
      <code>{name}</code>
      <code>{date || `April 20, 2020`}</code>
    </header>
    <p>{markdown}</p>
  </div>
}

export const NewProjectLog = ({ _id }) => {
  const [active, setActive] = useState(false)
  const newEntryAction = {
    mouseOptions: {
      onClick: e => {
        setActive('true')
      }
    }
  }

  return <div className={`container toolbar align-right flex-column ${active ? 'max-height' : ''}`}>
    <Action label='New Entry' {...newEntryAction} />
  </div>
}

export const Info = ({ project }) => {
  const { name, _id, description, tasks, updated } = project
  const [mode, setMode] = useState('r')

  return <div className='listInfo container flex-column max-height half-width padding' onClick={e => e.preventDefault()}>
    <div className='container flex-column max-flex-room overflow-scroll-y hide-scroll'>
      {project.logs.map((log, key) => <ProjectLog key={key} {...log} />)}
    </div>

    <NewProjectLog />
  </div>
}

export default ({ name, description, _id, mouseOptions, isFocused, isHovered }) => {
  const [showMenu, setMenu] = useState(false)
  const props = {
    style: {
      color: isFocused ? '#fff' : 'inherit'
    },
    className: `project container flex-column hover-text ${isHovered ? 'hovered' : ''}`,
    id: _id
  }

  return <div {...props} {...mouseOptions}>
    <span>{
      _id
        ? <Header name={name} description={description} expanded={isFocused || isHovered} />
        : <Header name={'+'} description={'Create a new project'} expanded={isFocused} />
    }</span>
  </div >
}