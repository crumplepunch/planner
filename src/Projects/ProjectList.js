import React, { useState, useContext, useEffect } from 'react'
import { Action, Error } from '../components'
import { useApollo, useList, ListContext } from '../hocs'
import LogList from './LogList'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import AddProject from './AddProject'

const Header = ({ name, description, expanded }) => {
  return <div className='header flex-column'>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
  </div>
}

export const ProjectDescription = ({ _id, description }) => {
  return <div>
    <h1>Description</h1>
    <p>{description}</p>
  </div>
}

export const ProjectLog = (props) => {
  return <LogList {...props} />
}

export const NewProjectLog = ({ _id }) => {
  const [active, setActive] = useState(false)
  const newEntryAction = {
    mouseOptions: {
      onClick: e => {
        setActive('true')
      }
    }
  }

  return <div className={`container toolbar align-right flex-column ${active ? 'max-height' : ''}`}>
    <Action label='New Entry' {...newEntryAction} />
  </div>
}

export const Info = ({ project }) => {
  // const { name, _id, description, tasks, updated } = project

  return <div className='listInfo container flex-column max-height half-width padding' onClick={e => e.preventDefault()}>
    <div className='container flex-column max-flex-room overflow-scroll-y hide-scroll'>
      {project.logs.length ? project.logs.map((log, key) => <ProjectLog key={key} {...log} />) : <code>No Logs</code>}
    </div>

    <NewProjectLog />
  </div>
}

export const ProjectListItem = ({ name, description, _id, mouseOptions, isFocused, isHovered }) => {
  // const [showMenu, setMenu] = useState(false)
  const props = {
    style: {
      color: isFocused ? '#fff' : '#343434'
    },
    className: `project container flex-column hover-text ${isHovered ? 'hovered' : ''}`,
    id: _id
  }

  return <div {...props} {...mouseOptions}>
    <span>{
      _id
        ? <Header name={name} description={description} expanded={isFocused || isHovered} />
        : <Header name={'+'} description={'Create a new project'} expanded={isFocused} />
    }</span>
  </div >
}

const ProjectList = useList(ProjectListItem)


export const ProjectActions = props => {
  return <div className="container" >
    <Action label='(Esc)ape' hotkey='Escape' />
    <Action label='(T)rack' hotkey='t' />
    <Action label='(A)dd' hotkey='a' />
    <Action label='(V)iew' hotkey='v' />
    <Action label='(E)dit' hotkey='e' />
  </div>
}

export default useApollo(client, props => {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })

  const { loadList, listItems } = useContext(ListContext)
  const projects = data && data.projects ? data.projects : []

  useEffect(() => {
    if (projects.length && !listItems.length) {
      loadList(projects)
    }
  })

  if (loading) return <h1>Loading</h1>
  if (error) return <Error error={error} />
  if (!data) return <h1> 404 Not found</h1>

  return <div className='container flex-column max-flex-room'>
    <ProjectList {...props} AddListItem={AddProject} options={{ enableAdd: true }} />
    <ProjectActions />
  </div>
})