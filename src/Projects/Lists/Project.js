import React from 'react'

const Header = ({ name, description, expanded }) => {
  return <div className='header flex-column'>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
  </div>
}

export default ({ name, description, _id, mouseOptions, isFocused, isHovered }) => {
  // const [showMenu, setMenu] = useState(false)
  const props = {
    style: {
      color: isFocused ? '#fff' : '#343434'
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