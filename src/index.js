import React from 'react'
import ReactDOM from 'react-dom'
import Planner from './Planner'
import Projects from './Projects'
import * as serviceWorker from './serviceWorker'
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route
} from 'react-router-dom'
import './index.scss'

const Nav = () => <nav>
  <div className='container navigation justify-space max-width'>
    <Link to='/'>Home</Link>
    <Link to='/projects'>Projects</Link>
    <Link to='/planner'>Blackboard</Link>
  </div>
</nav>

const Routes = () => <Router>
  <div className='container flex-column window-height'>
    {/* <Nav /> */}
    <Switch>
      <Route path='/projects/:id'><Projects /></Route>
      <Route path='/projects'><Projects /></Route>
      <Route path='/planner'><Planner /></Route>
    </Switch>
  </div>
</Router>

ReactDOM.render(<Routes />, document.getElementById('planner'))
serviceWorker.unregister()