import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import ViewProjects from './ViewList'
import ViewProject from './ViewProject'
import StartProject from './Start'
import './style.scss'
import { START, LIST, VIEW } from './paths'

import { ProjectContext } from '../contexts'
import { useProjectContext } from '../hooks'

export default () => {
  const [state, dispatch] = useProjectContext()
  console.log('hey')

  return <div className='projects container flex-column flex-grow'>
    <Router>
      <Switch>
        <ProjectContext.Provider value={[state, dispatch]}>
          <Route path={START}>
            <StartProject />
          </Route>

          <Route exact path={LIST}>
            <ViewProjects />
          </Route>

          <Route path={VIEW}>
            <ViewProject />
          </Route>

        </ProjectContext.Provider >
      </Switch>
    </Router>
  </div >

}