import React from 'react'
import { useApollo } from '../components/hoc'
import { useQuery } from '@apollo/react-hooks'
import { client } from './apollo/index'

import { GET_PROJECTS } from './apollo/queries'
import debug from 'debug'
const log = debug('Projects:log')

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

  return <div>
    <h1> Found</h1>
  </div>
}
export default useApollo(client, Projects)