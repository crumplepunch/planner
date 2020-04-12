import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import ViewProjects from './ViewList'
import StartProject from './Start'
import './style.scss'
import { START, LIST } from './paths'

export default () => <div className='projects container flex-column flex-grow'>
  <Router>
    <Switch>
      <Route path={START}>
        <StartProject />
      </Route>
      <Route path={LIST}>
        <ViewProjects />
      </Route>
    </Switch>
  </Router>
</div >