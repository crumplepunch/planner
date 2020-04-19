import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { client, GET_PROJECT } from '../apollo'
import { useApollo } from '../../hocs'
import { useProjectContext } from '../../hooks'
import { useParams } from 'react-router'

export default useApollo(client, () => {
  const { id } = useParams()

  const { data, loading, error } = useQuery(GET_PROJECT, {
    variables: {
      id: id
    }
  })
  const project = useMemo(() => (data || {}).project || {}, [data])
  const [state, dispatch, ProjectContext] = useProjectContext(project)


  return <ProjectContext.Provider value={[state, dispatch]}>
    <div className='container'>
      <h1>{project.name}</h1>
    </div>
  </ProjectContext.Provider>
})