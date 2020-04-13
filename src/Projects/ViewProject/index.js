import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { client, GET_PROJECTS } from '../apollo'
import { useApollo } from '../../hocs'
import { useProject } from '../../hooks'

export default useApollo(client, () => {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: {
      sortField: 'name',
      direction: 1
    }
  })

  const asdf = useProject()

  return <div className='container'>
    <h1>Hello from View Project</h1>
  </div>
})