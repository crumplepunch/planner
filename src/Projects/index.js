import React, { useState, useEffect, useRef } from 'react'
import { Link, Switch, Route, useHistory, useLocation, useParams } from 'react-router-dom'
import { useApollo } from '../components/hoc'
import { Action, Error } from '../components'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'

import './index.scss'
import ProjectListItem, { Info } from './Project'

const log = debug('Projects:general')
const statelog = debug('Projects:state')
const keylog = debug('Projects:keylog')

const Projects = props => {
  const location = useLocation()
  const params = useParams()
  const history = useHistory()
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })
  const listRef = useRef()
  const logsRef = useRef()
  const [currentProject, setCurrentProject] = useState(null)
  const [focusedId, setFocus] = useState(null)
  const [hoveredId, setHover] = useState(null)
  const [modifiers, setModifiers] = useState({})
  const [action, setAction] = useState('')

  const setListItem = (arg, push = true) => {

    if (!arg) {
      return setCurrentProject(null)
    }

    const project = projects.find(({ _id }) => _id === arg)
    const slug = project.name.toLowerCase().replace(/ /g, '-')

    if (currentProject !== project) {
      setCurrentProject(project)
      setHover(project._id)
      setFocus(project._id)
    }

    if (document.title !== project.name) {
      document.title = project.name
      push && history.push(`/projects/${project.name.toLowerCase().replace(/ /g, '-')}`)
    }
  }

  log({ data, loading, error })
  statelog({ currentProject })

  const projects = data && data.projects ? data.projects : []
  listRef.current && listRef.current.focus()

  useEffect(() => {
    document.getElementById('listref') && document.getElementById('listref').focus()
    console.log(document.getElementById('listref'))

    if (projects.length) {
      const hoverPrev = _ => {
        const index = projects.map(project => project._id).indexOf(hoveredId)
        if (index <= 0) return setListItem(projects[projects.length - 1]._id)
        setListItem(projects[index - 1]._id)

      }
      const hoverNext = _ => {
        const index = projects.map(project => project._id).indexOf(hoveredId)
        if (!(index < (projects.length - 1))) return setListItem(projects[0]._id)
        setListItem(projects[index + 1]._id)
      }

      const listEventListeners = {
        keydown: ({ key }) => {
          const keys = {
            Enter: () => document.getElementById(hoveredId).classList.add('active'),
            j: () => hoverNext(),
            k: () => hoverPrev(),

            //:::: HOTKEYS ::::
            Control: () => setModifiers(Object.assign(modifiers, {
              ctrl: true
            }))
          }
          keys[key] && keys[key]()
        },
        keyup: ({ key }) => {
          const keys = {
            Enter: () => {
              document.getElementById(hoveredId).classList.remove('active')
              logsRef.current.focus()
            },
            Control: () => setModifiers(Object.assign(modifiers, {
              ctrl: false
            }))
          }
          keys[key] && keys[key]()
        }
      }
      const windowEventListeners = {
        keydown: ({ key }) => {
          const keys = {
            Escape: () => listRef.current.focus()
          }
          keys[key] && keys[key]()
        }
      }

      if (listRef.current) {
        Object.keys(listEventListeners).forEach(event => listRef.current.addEventListener(event, listEventListeners[event]))
        Object.keys(windowEventListeners).forEach(event => window.addEventListener(event, windowEventListeners[event]))

      }

      return () => {
        Object.keys(listEventListeners).forEach(event => listRef.current.removeEventListener(event, listEventListeners[event]))
        Object.keys(windowEventListeners).forEach(event => window.removeEventListener(event, windowEventListeners[event]))
      }
    }
  }, [hoveredId, projects, modifiers, listRef])

  if (loading) return <h1>Loading</h1>
  if (error) return <Error error={error} />
  if (!data) return <h1> 404 Not found</h1>

  if (projects.length) {
    const id = params.id ? projects[projects.map(project => project.name.replace(/-/g, '').replace(/ /g, '').toLowerCase()).indexOf(params.id.replace(/-/g, ''))]._id : projects[0]._id
    if (!currentProject || currentProject._id !== id) {
      setListItem(id, false)
    }
  }

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
    },
    add: _ => {
      history.push('/projects/new')
    },
    esc: _ => {
      setListItem(null)
    },
    track: _ => {
      history.push(`/projects/${currentProject.name.toLowerCase().replace(/ /g, '-')}/track`)
    }
  }

  return <div className='projects container flex-column flex-grow' onClick={e => {
    action && actions[action]()
  }}>
    <div className='max-flex-room flex-row container' >
      <div className='flex-column padding max-flex-room' ref={listRef} tabIndex='0'>
        {projects.map((project) => <ProjectListItem {...project}
          key={project._id}
          mouseOptions={{
            onClick: e => {
              setListItem(project._id)
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
      <div ref={logsRef} tabIndex='0'>
        <Switch>
          <Route path='/:id/logs/add'>
          </Route>
          <Route path="/:id">
            <Info project={currentProject} />
          </Route>
          <Route path='/new'>
            {}
          </Route>

        </Switch>
      </div >
    </div >
    <div className="max-width container justify-space-between footer">
      <div className="container">
        <Action label='(T)rack' isFocused={action === 'track'} mouseOptions={{ onMouseEnter: _ => setAction('track'), onMouseLeave: _ => setAction('') }} />
        <Action label='(A)dd' isFocused={action === 'add'} mouseOptions={{ onMouseEnter: _ => setAction('add'), onMouseLeave: _ => setAction('') }} />
        <Action label='(V)iew' isFocused={action === 'view'} mouseOptions={{ onMouseEnter: _ => setAction('view'), onMouseLeave: _ => setAction('') }} />
        <Action label='(E)dit' isFocused={action === 'edit'} mouseOptions={{ onMouseEnter: _ => setAction('edit'), onMouseLeave: _ => setAction('') }} />
        {currentProject && <Action label='(Esc)ape' isFocused={action === 'esc'} mouseOptions={{ onMouseEnter: _ => setAction('esc'), onMouseLeave: _ => setAction('') }} />}
      </div>
    </div>
  </div >
}

export default useApollo(client, Projects)