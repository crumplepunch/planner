import React, { useState, useRef, useEffect } from 'react'
import { useList } from '../hocs'
const FormField = ({ name, _id, placeholder, isHovered, isFocused, mouseOptions }) => {
  const [value, setValue] = useState('')
  const props = {
    id: _id
  }
  const inputRef = useRef()

  mouseOptions.onClick = e => {
    e.preventDefault()
    inputRef.current.focus()
  }

  return <div className='project container hover-text max-width flex-column' key={_id} {...props} {...mouseOptions}>
    <span>{name}</span>
    <input placeholder={placeholder} value={value} ref={inputRef} onChange={e => {
      setValue(e.target.value)
    }} />
  </div>
}


const FormFields = useList(FormField)

export default props => {
  const formRef = useRef()
  const pointerState = useState()
  const [currentField] = pointerState
  const { disableKeyBindings = {} } = props

  useEffect(() => {
    disableKeyBindings.forEach(({ free }) => free && free())

    return () => disableKeyBindings.forEach(({ register }) => register && register())
  }, [])

  return <div className='container max-flex-room flex-column padding' tabIndex='0'>
    <h1>New Project</h1>
    <form ref={formRef}>
      <FormFields {...props} pointerState={pointerState} items={[
        {
          name: 'Project Title',
          placeholder: 'Untitled',
          _id: 'title'
        },
        {
          name: 'Description',
          placeholder: 'Summary of the p',
          _id: 'description'
        }
      ]} AddListItem={false} />

    </form>
  </div>
}