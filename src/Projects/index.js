import React, { useState, useEffect } from 'react'
import { useApollo } from '../components/hoc'
import { Action } from '../components'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'

import './index.scss'
import Project from './Project'

const log = debug('Projects:general')
const statelog = debug('Projects:state')

const Projects = props => {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })
  const [focusedId, setFocus] = useState(null)
  const [hoveredId, setHover] = useState(null)
  const [action, setAction] = useState('')

  const setListItem = arg => {
    return setFocus(arg)
  }

  log({ data, loading, error })

  const projects = data && data.projects ? data.projects : []

  useEffect(() => {
    if (projects.length) {
      const hoverPrev = _ => {
        const index = projects.map(project => project._id).indexOf(hoveredId)
        if (index <= 0) return setHover(projects[projects.length - 1]._id)
        setHover(projects[index - 1]._id)
      }
      const hoverNext = _ => {
        const index = projects.map(project => project._id).indexOf(hoveredId)
        if (!(index < (projects.length - 1))) return setHover(projects[0]._id)
        setHover(projects[index + 1]._id)
      }
      const vimKeyDown = ({ key }) => {
        if (key === 'j') return hoverNext()
        if (key === 'k') return hoverPrev()
        if (key === 'Enter') return document.getElementById(hoveredId).classList.add('active')
      }
      const vimKeyUp = ({ key }) => {
        document.getElementById(hoveredId).classList.remove('active')

        if (key === 'Enter') {
          setListItem(hoveredId)
        }
      }

      window.addEventListener('keydown', vimKeyDown)
      window.addEventListener('keyup', vimKeyUp)
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', vimKeyDown)
        window.removeEventListener('keyup', vimKeyUp)
      }
    }
  }, [hoveredId, projects])

  if (loading) return <h1>Loading</h1>
  if (error) return <h1> error</h1>
  if (!data) return <h1> 404 Not found</h1>

  if (!focusedId) setListItem(projects[0]._id)
  if (!hoveredId) setHover(projects[0]._id)

  const actions = {
    prev: _ => {
      const index = projects.map(project => project._id).indexOf(focusedId)
      if (index <= 0) return
      setListItem(projects[index + 1]._id)
    },
    next: _ => {
      const index = projects.map(project => project._id).indexOf(focusedId)
      if (!(index < (projects.length - 1))) return
      setListItem(projects[index + 1]._id)
    }
  }

  const setNone = _ => setAction('')

  return <div className='projects container flex-column flex-grow' onClick={e => { action && actions[action]() }}>
    <h1 className='max-width justify-center'>Projects</h1>
    <div className='flex-column max-flex-room'>
      {projects.map((project) => <Project {...project}
        key={project._id}
        setListItem={e => {
          setListItem(project._id)
          setHover(project._id)
        }}
        mouseOptions={{
          onClick: e => {
            setListItem(project._id)
            setHover(project._id)

          },
          onMouseDown: e => {
            e = e || window.event
            e.preventDefault()
            console.log(e)
            console.log(`mouse: ${e.which}`)
          },
          onContextMenu: e => {
            e.preventDefault()
          }
        }}
        isFocused={project._id === focusedId}
        isHovered={project._id === hoveredId}
      />
      )}
    </div>
    <div className="max-width container justify-space-between footer">
      <div className="container">
        {Action({
          label: 'View',
          isFocused: action === 'view',
          mouseOptions: {
            onMouseEnter: _ => setAction('view'),
            onMouseLeave: _ => setNone
          }
        })}
        {Action({
          label: 'Edit',
          isFocused: action === 'edit',
          mouseOptions: {
            onMouseEnter: _ => setAction('edit'),
            onMouseLeave: _ => setNone
          }
        })}
      </div>

    </div>
  </div >
}

export default useApollo(client, Projects)