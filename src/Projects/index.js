import React, { useState, useEffect } from 'react'
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
  const [currentProject, setCurrentProject] = useState(null)
  const [focusedId, setFocus] = useState(null)
  const [hoveredId, setHover] = useState(null)
  const [action, setAction] = useState('')

  const setListItem = arg => {
    if (!arg) {
      return setCurrentProject(null)
    }

    setCurrentProject(projects.find(({ _id }) => _id === arg))

    return setFocus(arg)
  }

  log({ data, loading, error })
  statelog({ currentProject })

  const projects = data && data.projects ? data.projects : []
  const view = overrideId => {
    history.push(`/projects/${projects.find(({ _id }) => _id === (overrideId || hoveredId)).name.toLowerCase().replace(/ /g, '-')}`)
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
        if (key === 'Escape') return setListItem(null)
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
  if (error) return <Error error={error} />
  if (!data) return <h1> 404 Not found</h1>

  if (projects.length) {
    const id = params.id ? projects[projects.map(project => project.name.replace(/-/g, '').replace(/ /g, '').toLowerCase()).indexOf(params.id.replace(/-/g, ''))]._id : projects[0]._id
    if (!hoveredId) setHover(id)
    if (!focusedId) setFocus(id)
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
    view,
    add: _ => {
      history.push('/projects/new')
    },
    esc: _ => {
      setListItem(null)
    },
  }

  return <div className='projects container flex-column flex-grow' onClick={e => {
    action && actions[action]()
  }}>
    <h1 className='max-width justify-center'>Blackboard</h1>
    <div className='max-flex-room flex-row container'>
      <div className='flex-column padding max-flex-room'>
        {projects.map((project) => <ProjectListItem {...project}
          key={project._id}
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
        <Switch>
          <Route path="/:id">
            {currentProject && <Info project={currentProject} />}
          </Route>
          <Route path='/new'>
            {}
          </Route>

        </Switch>
      </div>
    </div>
    <div className="max-width container justify-space-between footer">
      <div className="container">
        <Action label='(A)dd' isFocused={action === 'add'} mouseOptions={{ onMouseEnter: _ => setAction('add'), onMouseLeave: _ => setAction('') }} />
        <Action label='(V)iew' isFocused={action === 'view'} mouseOptions={{ onMouseEnter: _ => setAction('view'), onMouseLeave: _ => setAction('') }} />
        <Action label='(E)dit' isFocused={action === 'edit'} mouseOptions={{ onMouseEnter: _ => setAction('edit'), onMouseLeave: _ => setAction('') }} />
        {currentProject && <Action label='(Esc)ape' isFocused={action === 'esc'} mouseOptions={{ onMouseEnter: _ => setAction('esc'), onMouseLeave: _ => setAction('') }} />}
      </div>
    </div>
  </div >
}

export default useApollo(client, Projects)