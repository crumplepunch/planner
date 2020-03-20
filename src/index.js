import React from 'react'
import ReactDOM from 'react-dom'
import Planner from './Planner';
import * as serviceWorker from './serviceWorker'

import './index.css'


ReactDOM.render(<Planner />, document.getElementById('planner'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
