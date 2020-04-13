import React, { useState, useRef, useMemo, useCallback } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useList, useApollo } from '../../hocs'
import { useListContext } from '../../hooks'
import { client, ADD_PROJECT } from '../apollo'
import { Action, Error } from '../../components'

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

export default useApollo(client, props => {
  const formRef = useRef()
  const [variables, setFormValues] = useState({})
  const [addProject, { data, error, errors }] = useMutation(ADD_PROJECT)
  const [ListContext, listState, ops] = useListContext()

  const updateField = args => {
    setFormValues(Object.assign(variables, args))
  }

  if (error) return <Error error={error} />

  useMemo(() => {
    ops.loadList([
      {
        name: 'Project Name',
        placeholder: 'New Project 01',
        updateField,
        _id: 'name'
      },
      {
        name: 'Description',
        placeholder: 'Summary of the project',
        updateField,
        _id: 'description'
      },
      {
        name: 'Repository',
        placeholder: 'git@github.com:user/repo.git',
        updateField,
        _id: 'repository'
      }
    ])
  }, [ops.loadList])
  const { currentItem } = listState
  const currentFieldId = useMemo(() => (currentItem || {})._id, [currentItem])

  ops.enter = useCallback(() => {
    const input = document.getElementById(currentFieldId).children[1]
    input.focus()
  }, [currentFieldId])

  return <div className='container max-flex-room flex-column padding' tabIndex='0'>
    <form ref={formRef} name='addproject' onSubmit={async e => {
      e.preventDefault()
      await addProject({ variables }).catch(err => console.log(err))
    }}>
      <ListContext.Provider value={{
        listState,
        ops
      }}>
        <FormFields {...props} />
      </ListContext.Provider>
      <Action label='Submit' mouseOptions={{
        onClick: () => formRef.current.dispatchEvent(new Event('submit'))
      }} />
    </form>
  </div>
})