import { useContext, useCallback, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { ProjectContext } from '../contexts'

const reducer = (acc, { type, project }) => {
  switch (type) {
    case ('view'):
      return Object.assign({}, acc, {
        mode: 'view',
        project
      })
    default:
      console.log(`unknown dispatch: ${type}`)
  }
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  return context
}

export const useProjectContext = () => {
  const [state, dispatch] = useReducer(reducer, {})
  const setProject = useCallback(project => {
    document.title = project.name
    dispatch({
      type: 'view',
      project
    })
  }, [dispatch])

  return [state, setProject]
}