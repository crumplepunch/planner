import React from 'react'
import { useApollo } from '../components/hoc'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'
import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'


const log = debug('Projects:log')
const Project = ({ name, description }) => {
  return <div className='project'>
    <h1>{name}</h1>
    <h3>{description}</h3>
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

  return <div>
    <h1>Projects:</h1>
    {projects.map((project, key) => <Project key={key} {...project}></Project>)}
  </div>
}
export default useApollo(client, Projects)