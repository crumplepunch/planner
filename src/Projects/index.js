import React, { useState, useRef } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useApollo } from '../hocs'
import { Action, Error } from '../components'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'

import './index.scss'
import { Info, ProjectList } from './Project'

const log = debug('Projects:general')
// const statelog = debug('Projects:state')
// const keylog = debug('Projects:keylog')

const Projects = props => {
  const history = useHistory()
  const pointerState = useState(null)
  const [currentProject] = pointerState
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })
  const listRef = useRef()
  const logsRef = useRef()
  const [action, setAction] = useState('')

  log({ data, loading, error })

  const projects = data && data.projects ? data.projects : []
  listRef.current && listRef.current.focus()

  if (loading) return <h1>Loading</h1>
  if (error) return <Error error={error} />
  if (!data) return <h1> 404 Not found</h1>

  const actions = {
    add: _ => {
      history.push('/projects/new')
    }
  }

  return <div className='projects container flex-column flex-grow' onClick={e => {
    action && actions[action]()
  }}>
    <div className='max-flex-room flex-row container' >
      {projects.length && <ProjectList pointerState={pointerState} items={projects} path='projects' nextRef={logsRef} />}
      <div className='flex-column container' ref={logsRef} tabIndex='0'>
        <Switch>
          <Route path='/:id/logs/add'>
          </Route>
          <Route path="/:id">
            {currentProject && <Info project={currentProject} />}

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
      </div>
    </div>
  </div >
}

export default useApollo(client, Projects)