import React, { useState, useEffect } from 'react'
import { Link, Switch, Route, useHistory, useLocation, useParams } from 'react-router-dom'
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
  const location = useLocation()
  const params = useParams()
  const history = useHistory()
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
    // history.push('/1234')
    return setFocus(arg)
  }

  log({ data, loading, error })
  statelog({ params })

  const projects = data && data.projects ? data.projects : []
  const view = overrideId => {
    log({ location, params })
    const index = projects.map(project => project._id).indexOf(overrideId || hoveredId)

    history.push(`/projects/${projects[index].name.toLowerCase().replace(/ /g, '-')}`)
  }

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
          view(hoveredId)
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

  if (projects.length) {
    const id = params.id ? projects[projects.map(project => project.name.replace(/-/g, '').replace(/ /g, '').toLowerCase()).indexOf(params.id.replace(/-/g, ''))]._id : projects[0]._id
    if (!hoveredId) setHover(id)
    if (!focusedId) setListItem(id)
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
    view
  }

  const setNone = _ => setAction('')

  return <div className='projects container flex-column flex-grow' onClick={e => { action && actions[action]() }}>
    <h1 className='max-width justify-center'>Projects</h1>
    <div className='max-flex-room container'>
      <div className='max-flex-room'>
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
              view(project._id)
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
      <div>
        <h1>Hellos</h1>
      </div>
    </div>
    <div className="max-width container justify-space-between footer">
      <div className="container">
        {Action({
          label: '(V)iew',
          isFocused: action === 'view',
          mouseOptions: {
            onMouseEnter: _ => setAction('view'),
            onMouseLeave: _ => setNone
          }
        })}
        {Action({
          label: '(E)dit',
          isFocused: action === 'edit',
          mouseOptions: {
            onMouseEnter: _ => setAction('edit'),
            onMouseLeave: _ => setNone
          }
        })}
        <Switch>
          <Route path="/:id">
          </Route>
        </Switch>
      </div>
    </div>
  </div >
}

export default useApollo(client, Projects)