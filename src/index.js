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
    <Link to='/planner'>Planner</Link>
  </div>
</nav>
const Routes = () => <Router>
  <div className='container'>
    <Nav />
    <Switch>
      <Route path='/projects'><Projects /></Route>
      <Route path='/planner'><Planner /></Route>
    </Switch>
  </div>
</Router>

ReactDOM.render(<Routes />, document.getElementById('planner'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()