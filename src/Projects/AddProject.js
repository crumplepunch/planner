import React, { useState, useRef, useEffect } from 'react'
import { useList } from '../hocs'
import { Action } from '../components'

const FormField = ({ name, _id, placeholder, isHovered, isFocused, mouseOptions, updateField }) => {
  const [value, setValue] = useState('')
  const props = {
    style: {
      color: isFocused ? '#fff' : '#343434'
    },
    className: `project container flex-column hover-text ${isHovered ? 'hovered' : ''}`,
    id: _id
  }

  const inputRef = useRef()

  isFocused && inputRef.current && inputRef.current.focus()
  if (isFocused) debugger

  mouseOptions.onClick = e => {
    e.preventDefault()
    inputRef.current.focus()
  }

  return <div className='project container hover-text max-width flex-column' key={_id} {...props} {...mouseOptions}>
    <span>{name}</span>
    <input placeholder={placeholder} value={value} ref={inputRef} onChange={e => {
      updateField({
        [_id]: e.target.value
      })
      setValue(e.target.value)
    }} />
  </div>
}

const FormFields = useList(FormField)

export default props => {
  const formRef = useRef()
  const [formValues, setFormValues] = useState({})
  const pointerState = useState()
  const { disableKeyBindings = {} } = props

  useEffect(() => {
    disableKeyBindings.forEach(({ free }) => free && free())

    return () => disableKeyBindings.forEach(({ register }) => register && register())
  }, [])

  const updateField = args => {
    setFormValues(Object.assign(formValues, args))
  }
  return <div className='container max-flex-room flex-column padding' tabIndex='0'>
    <h1>New Project</h1>
    <form ref={formRef} name='addproject' onSubmit={e => {
      console.log(formValues)
    }}>
      <FormFields {...props} pointerState={pointerState} items={[
        {
          name: 'Project Title',
          placeholder: 'Untitled',
          updateField,
          _id: 'title'
        },
        {
          name: 'Description',
          placeholder: 'Summary of the p',
          updateField,
          _id: 'description'
        }
      ]} AddListItem={false} />
      <button type='submit'> Submit </button>
    </form>
  </div>
}