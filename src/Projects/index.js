import React, { useState, useEffect } from 'react'
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
  const [hoveredId, setHover] = useState(null)
  const [action, setAction] = useState('')

  log({
    data,
    loading,
    error
  })


  const hoverPrev = _ => {
    const index = projects.map(project => project._id).indexOf(hoveredId)
    console.log({ index })
    if (index <= 0) return
    setHover(projects[index - 1]._id)
  }
  const hoverNext = _ => {
    const index = projects.map(project => project._id).indexOf(hoveredId)
    if (!(index < (projects.length - 1))) return
    setHover(projects[index + 1]._id)
  }

  const vimKeyDown = ({ key }) => {
    if (key === 'j') return hoverNext()
    if (key === 'k') return hoverPrev()
    if (key === 'Enter') return document.getElementById(hoveredId).classList.add('active')
  }

  const vimKeyUp = ({ key }) => {
    if (key === 'Enter') {
      document.getElementById(hoveredId).classList.remove('active')
      setFocus(hoveredId)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', vimKeyDown)
    window.addEventListener('keyup', vimKeyUp)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', vimKeyDown)
      window.removeEventListener('keyup', vimKeyUp)

    }
  }, [vimKeyDown, vimKeyUp])

  const actionFn = action => {
    return e => {
      setAction(action)
    }
  }

  const setNone = actionFn('')

  if (loading) return <h1>Loading</h1>
  if (error) return <h1> error</h1>
  if (!data) return <h1> 404 Not found</h1>

  const { projects } = data

  if (!focusedId) {
    setFocus(projects[0]._id)
  }
  if (!hoveredId) {
    setHover(projects[0]._id)
  }

  const previousProject = _ => {
    const index = projects.map(project => project._id).indexOf(focusedId)
    if (index <= 0) return
    setFocus(projects[index - 1]._id)
  }
  const nextProject = _ => {
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
          isHovered: project._id === hoveredId
        }

        return <Project {...props} {...project} />
      })}
    </div>
    {
      <div className="max-width container justify-space-between footer">
        <div className="container">
          <Action label='View' focus={actionFn('view')} unfocus={setNone} isFocused={action === 'view'}></Action>
          <Action label='Edit' focus={actionFn('edit')} unfocus={setNone} isFocused={action === 'edit'}></Action>
        </div>
        <div className="container">
          <Action label='▲' focus={actionFn('prev')} unfocus={setNone} isFocused={action === 'prev'} />
          <Action label='▼' focus={actionFn('next')} unfocus={setNone} isFocused={action === 'next'} />
        </div>
      </div>
    }
  </div >
}
export default useApollo(client, Projects)