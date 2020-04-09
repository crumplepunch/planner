import React, { useState, useContext, useReducer } from 'react'
import './resets.scss'
import './reusable.scss'

const TagList = (props) => {
  return <div className='container border-radius flex-column'>
    {props.children}
  </div>
}

const Button = props => {
  return <div className='button container'>
    {props.children}
  </div>
}

const Input = (props) => {
  const [val, setValue] = useState('')
  const dispatch = useContext(TagsDispatch)

  return <input {...props} value={val} placeholder='Add a tag' onKeyPress={e => {
    if (e.key === 'Enter') {
      dispatch({type: 'add', tag: val})
      setValue('')
    }
  }} onChange={ e => {
    e.preventDefault()
    setValue(e.target.value)
  }} />
}


const TagsDispatch = React.createContext()

export default () => {
  const [state, dispatch] = useReducer(({tags}, {type, tag}) => {
    if (type === 'add') return { tags: [...tags, tag] }
  }, {
    tags: []
  })

  return (
    <div className="container window-sized centered border-radius">
      <TagsDispatch.Provider value={dispatch}>
        <Input className="line-height-sm" />
        <TagList>
          {state.tags.map(tag => <Button><span>{tag}</span></Button>)}
        </TagList>
      </TagsDispatch.Provider>
    </div>
  )
}
