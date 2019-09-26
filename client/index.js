import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './components/app'
import store from './store'
import * as serviceWorker from './serviceWorker'

// establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('App')
)

serviceWorker.register()
