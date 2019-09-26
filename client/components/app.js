import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Navbar from './navbar'
import Footer from './footer'
import PageNotFound from './pageNotFound'

const App = () => (
  <Router>
    <div>
      <Navbar />
      <main>
        <h1>Better TODO</h1>
        <Switch>
          {/* <Route exact path="/" component={Campuses} /> */}
          <Route exact path="/" />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  </Router>
)

export default App
