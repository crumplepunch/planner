import React, { useState } from 'react'
import { useApollo } from '../components/hoc'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'

import './index.scss'
const log = debug('Projects:general')
const statelog = debug('Projects:state')
const Project = ({ name, description, _id }) => {
  const [expanded, setExpand] = useState(false)
  statelog({
    expanded
  })

  return <div className='project' id={_id} onClick={e => {
    e.preventDefault()
    log(e.currentTarget.id)
    setExpand(!expanded)
  }}>
    <h1>{name}</h1>
    {expanded && <h3>{description}</h3>}
  </div>
}

const Projects = props => {
  const { data, loading, error } = useQuery(GET_PROJECTS)
  log({
    data,
    loading,
    error
  })

  if (loading) return <h1>Loading</h1>
  if (error) return <h1> error</h1>
  if (!data) return <h1> 404 Not found</h1>

  const { projects } = data

  return <div className='projects'>
    <h1>Projects:</h1>
    {projects.map((project) => <Project key={project._id} {...project}></Project>)}
  </div>
}
export default useApollo(client, Projects)