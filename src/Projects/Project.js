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


export default ({ name, description, _id, setFocus, isFocused, isHovered }) => {
  const [showMenu, setMenu] = useState(false)

  const focusStyle = {
    color: isFocused ? '#fff' : 'inherit'
  }

  const props = {
    style: focusStyle,
    className: `project container flex-column hover-text ${isHovered ? 'hovered' : ''}`,
    id: _id,
    onClick: setFocus,
    onContextMenu: e => e.target.type !== 'button' && !isFocused ? setFocus(e) : setMenu(!showMenu)
  }

  return <div {...props}>
    <span><Header name={name} description={description} expanded={isFocused}></Header></span>
  </div >
}