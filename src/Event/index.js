import React, { useState } from 'react'
// import {
//   Time,
//   Date,
//   Name,
//   Description,
//   Location,
//   Relations,
//   People,
//   Projects,
//   Notes
// } from '../components/fields'

export function Field({ input, textarea, label, name, onChange }) {
  const inputProps = Object.assign({
    value: ''
  }, input)
  const [value, setValue] = useState(inputProps.value)
  const Input = `${textarea ? 'textarea' : 'input'}`

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Input id={name} name={name} {...inputProps} value={value} onChange={onChange ? e => {
        onChange(value, setValue, e)
        e.preventDefault()
      } : e => {
        setValue(e.target.value)
        e.preventDefault()
      }}></Input>
    </div >
  )
}

export function NewEvent({ event: { title, description } }) {
  return (
    <div className='new'>
      {Field({ name: 'title', label: 'Event', input: { type: 'text', placeholder: title, value: 'test val' } })}
      {Field({ name: 'description', label: 'Description', textarea: true, input: { placeholder: description } })}
    </div>
  )
}

const newEvent = { title: 'Untitled Event', description: 'Indescribable so far' }

export default function Event({ initialValue = newEvent }) {
  const [event, setEvent] = useState(initialValue)

  return (
    <div className='event'>
      <NewEvent event={event} setEvent={setEvent} />
    </div>
  )
}