import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './components/app'
import store from './store'

// establishes socket connection
// import './socket'

//register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.log('service worker not registered', err))
}

//establish firebase connection
import './firebase'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('App')
)
