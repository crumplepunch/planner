import React, { useState, useMemo, useRef } from 'react'
import { Action, Error } from '../../components'
import { useApollo, useList } from '../../hocs'
import { useListContext } from '../../hooks'

import { useQuery } from '@apollo/react-hooks'
import { client } from '../apollo/index'
import { GET_PROJECTS } from '../apollo/queries'

import Log from './Log'
import Project from './Project'

export const ProjectDescription = ({ _id, description }) => {
  return <div>
    <h1>Description</h1>
    <p>{description}</p>
  </div>
}

export const NewProjectLog = ({ _id }) => {
  const [active, setActive] = useState(false)
  const newEntryAction = {
    mouseOptions: {
      onClick: e => {
        setActive(!active)
      }
    }
  }

  return <div className={`container toolbar align-right flex-column ${active ? 'max-height' : ''}`}>
    <Action label='New Entry' {...newEntryAction} />
  </div>
}

export const Info = ({ project }) => {
  return <div className='listInfo container flex-column max-height half-width padding' onClick={e => e.preventDefault()}>
    <div className='container flex-column max-flex-room overflow-scroll-y hide-scroll'>
      {project.logs.length ? project.logs.map((log, key) => <Log key={key} {...log} />) : <code>No Logs</code>}
    </div>

    <NewProjectLog />
  </div>
}

export const ProjectActions = props => {
  return <div className="container" >
    <Action label='(Esc)ape' hotkey='Escape' />
    <Action label='(T)rack' hotkey='t' />
    <Action label='(A)dd' hotkey='a' to='/new' />
    <Action label='(V)iew' hotkey='v' />
    <Action label='(E)dit' hotkey='e' />
  </div>
}

const ProjectList = useList(Project)

export default useApollo(client, props => {
  const [ListContext, listState] = useListContext()
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })

  const { items, loadList } = listState
  useMemo(() => {
    const projects = data && data.projects ? data.projects : []

    if (projects.length && !items.length) {
      loadList(projects)
    }
  }, [data, items, loadList])

  const logsRef = useRef()

  if (loading) return <h1>Loading</h1>
  if (error) return <Error error={error} />
  if (!data) return <h1> 404 Not found</h1>

  return <div className='max-flex-room flex-row container'>
    <ListContext.Provider value={listState}>
      <div className='container flex-column max-flex-room'>
        <ProjectList {...props} />
        <ProjectActions />
      </div>
    </ListContext.Provider>

    <div className='flex-column container' ref={logsRef} tabIndex='0'>
      {listState.currentItem && <Info project={listState.currentItem} />}
    </div >
  </div>
})