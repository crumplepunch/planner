import React, { useState, useMemo, useRef, useCallback } from 'react'

import { useQuery } from '@apollo/react-hooks'

import Log from './Log'
import Project from './Project'
import { START } from '../paths'
import { useHistory } from 'react-router-dom'

import { client, GET_PROJECTS } from '../apollo'
import { useApollo, useList } from '../../hocs'
import { useListContext, useProject } from '../../hooks'
import { Action, Error } from '../../components'

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
    <Action label='(A)dd' hotkey='a' to={START} />
    <Action label='(V)iew' hotkey='v' />
    <Action label='(E)dit' hotkey='e' />
  </div>
}

const ProjectList = useList(Project)

export default useApollo(client, props => {
  const [ListContext, listState, ops] = useListContext()
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })

  const { loadList } = ops
  const { items, currentItem } = listState
  const setProject = useProject()[1]
  const history = useHistory()

  ops.enter = useCallback(() => {
    history.push(`/projects/${currentItem._id}`)
    setProject(currentItem)
  }, [currentItem, setProject, history])

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
    <ListContext.Provider value={{
      listState,
      ops
    }}>
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