import React, { useState } from 'react'
import { useApollo } from '../components/hoc'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'

import './index.scss'
import Project from './Project'


const log = debug('Projects:general')
const statelog = debug('Projects:state')

const Action = ({ isFocused, focus, unfocus, label, onClick = e => { e.preventDefault() } }) => {
  const props = {
    onMouseEnter: e => {
      e.preventDefault()
      focus(e)
    },
    onMouseLeave: e => {
      e.preventDefault()
      unfocus(e)
    },
    onClick,
    style: {
      color: isFocused ? '#fff' : 'inherit'
    }
  }
  return <div className='button' type='button' {...props}>{label}</div>
}

const Projects = props => {
  const { data, loading, error } = useQuery(GET_PROJECTS)
  const [focusedId, setFocus] = useState(null)
  const [action, setAction] = useState('')

  log({
    data,
    loading,
    error
  })

  if (loading) return <h1>Loading</h1>
  if (error) return <h1> error</h1>
  if (!data) return <h1> 404 Not found</h1>

  const { projects } = data
  if (!focusedId) {
    setFocus(projects[0]._id)
  }

  const actionFn = action => {
    return e => {
      setAction(action)
    }
  }

  const setEdit = actionFn('edit')
  const setView = actionFn('view')
  const setPrev = actionFn('prev')
  const setNext = actionFn('next')
  const setNone = actionFn('')
  const previousProject = e => {
    const index = projects.map(project => project._id).indexOf(focusedId)
    console.log(index)
    if (index <= 0) return
    setFocus(projects[index - 1]._id)
  }
  const nextProject = e => {
    const index = projects.map(project => project._id).indexOf(focusedId)
    if (!(index < (projects.length - 1))) return
    setFocus(projects[index + 1]._id)
  }



  return <div className='projects container flex-column flex-grow' onClick={e => {
    statelog({
      currentProject: projects[projects.map(({ _id }) => _id).indexOf(focusedId)],
      currentAction: action
    })
    if (action === 'next') {
      nextProject(e)
    } else if (action === 'prev') {
      previousProject(e)
    }
  }}>
    <h1 className='max-width justify-center'>Projects</h1>
    <div className='flex-column max-flex-room'>
      {projects.map((project) => {
        const props = {
          key: project._id,
          setFocus: e => {
            statelog({
              focusedId,
              project
            })
            setFocus(project._id)
          },
          isFocused: project._id === focusedId,
        }

        return <Project {...props} {...project} />
      })}
    </div>
    {
      <div className="max-width container justify-space-between footer">
        <div className="container">
          <Action label='View' focus={setView} unfocus={setNone} isFocused={action === 'view'}></Action>
          <Action label='Edit' focus={setEdit} unfocus={setNone} isFocused={action === 'edit'}></Action>
        </div>
        <div className="container">
          <Action label='▲' focus={setPrev} unfocus={setNone} isFocused={action === 'up'} />
          <Action label='▼' focus={setNext} unfocus={setNone} isFocused={action === 'down'} />
        </div>
      </div>
    }
  </div >
}
export default useApollo(client, Projects)