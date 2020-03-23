import React, { useState } from 'react'
import { newEvent } from './models'
import Debug from 'debug'
const debug = Debug('Event:index:log')


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

export function Field({ input, textarea, label, name, setter }) {
  const inputProps = Object.assign({
    value: ''
  }, input)
  const Input = `${textarea ? 'textarea' : 'input'}`

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Input id={name} name={name} {...inputProps} onChange={e => {
        setter(e.target.value)
        e.preventDefault()
      }}></Input>
    </div >
  )
}

export function NewEvent({ event, setCurrentEvent }) {
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description)

  return (
    <div className='new'>
      <form onSubmit={
        e => {
          setCurrentEvent(newEvent(Object.assign(event, {
            title,
            description
          })))
          e.preventDefault()
        }
      }>
        {Field({
          name: 'title',
          label: 'Event',
          input: { type: 'text', placeholder: 'Untitled Event', value: title },
          setter: setTitle
        })}
        {Field({
          name: 'description',
          label: 'Description',
          textarea: true,
          input: { placeholder: 'Indescribable', value: description },
          setter: setDescription
        })}
        <input type="submit" value="Submit"></input>
      </form>
      {/* <EventActions /> */}
    </div>
  )
}

export default function Event(props) {
  const [currentEvent, setCurrentEvent] = useState(newEvent(Object.assign({ id: -1 }, props.event)))

  debug({ currentEvent })

  return (
    <div className='event'>
      {(currentEvent.id < 0) && <NewEvent event={currentEvent} setCurrentEvent={setCurrentEvent} />}
    </div>
  )
}