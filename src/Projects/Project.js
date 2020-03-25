import React, { useState } from 'react'
import debug from 'debug'

const log = debug('Project:general')
const statelog = debug('Project:state')
const Header = ({ name, description, expanded }) => {
  return <div className='header flex-column'>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
  </div>
}


export default ({ name, description, _id, setFocus, isFocused }) => {
  const [showMenu, setMenu] = useState(false)

  const focusStyle = {
    color: isFocused ? '#fff' : 'inherit'
  }

  const focus = (e, preventDefault = false) => {
    if (preventDefault) {
      e.preventDefault()
    }

    setFocus(_id)
  }


  const props = {
    style: focusStyle,
    id: _id,
    onClick: e => {
      focus(e, true)
      statelog(JSON.stringify({
        showMenu
      }))
    },
    onContextMenu: e => e.target.type !== 'button' && !isFocused ? focus(e) : setMenu(!showMenu)
  }

  return <div className='project container flex-column' {...props}>
    <Header name={name} description={description} expanded={isFocused}></Header>
  </div >
}