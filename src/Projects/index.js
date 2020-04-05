import React, { useState, useRef } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import './index.scss'
import ProjectList, { Info, ProjectActions } from './Project'

export default props => {
  const pointerState = useState(null)
  const [currentProject] = pointerState
  const logsRef = useRef()

  return <div className='projects container flex-column flex-grow'>
    <div className='max-flex-room flex-row container'>
      <ProjectList pointerState={pointerState} path='projects' nextRef={logsRef} />
      <div className='flex-column container' ref={logsRef} tabIndex='0'>
        <Switch>
          <Route path="/:id">
            {currentProject && <Info project={currentProject} />}
          </Route>
        </Switch>
      </div >
    </div>
  </div>
}