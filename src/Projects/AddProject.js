import React, { useState, useRef, useEffect } from 'react'
import { useList } from '../hocs'
import { Action, Error } from '../components'
import { useMutation } from '@apollo/react-hooks'
import { ADD_PROJECT } from './apollo/queries'


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
  const [variables, setFormValues] = useState({})
  const pointerState = useState()
  const [addProject, { data, error, errors }] = useMutation(ADD_PROJECT)
  const { disableKeyBindings = {} } = props

  useEffect(() => {
    disableKeyBindings.forEach(({ free }) => free && free())

    return () => disableKeyBindings.forEach(({ register }) => register && register())
  }, [])

  const updateField = args => {
    setFormValues(Object.assign(variables, args))
  }

  if (error) return <Error error={error} />


  return <div className='container max-flex-room flex-column padding' tabIndex='0'>
    <h1>New Project</h1>
    <form ref={formRef} name='addproject' onSubmit={async e => {
      await addProject({ variables }).catch(err => console.log(err))
    }}>
      <FormFields {...props} pointerState={pointerState} items={[
        {
          name: 'Project Name',
          placeholder: 'Untitled',
          updateField,
          _id: 'name'
        },
        {
          name: 'Description',
          placeholder: 'Summary of the p',
          updateField,
          _id: 'description'
        }
      ]} AddListItem={false} />

      <Action label='Submit' mouseOptions={{
        onClick: () => formRef.current.dispatchEvent(new Event('submit'))
      }} />
    </form>
  </div>
}