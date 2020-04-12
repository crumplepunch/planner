import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import ViewProjects from './Lists'
import StartProject from './Start'
import './style.scss'

export default () => <div className='projects container flex-column flex-grow'>
  <Router>
    <Switch>
      <Route path='/start'>
        <StartProject />
      </Route>
      <Route path='/'>
        <ViewProjects />
      </Route>
    </Switch>
  </Router>
</div >