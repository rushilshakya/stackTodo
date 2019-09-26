import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Navbar from './navbar'
import Todos from './todos'
import Footer from './footer'
import PageNotFound from './pageNotFound'

const App = () => (
  <Router>
    <div>
      <Navbar />
      <main>
        <Switch>
          {/* <Route exact path="/" component={Campuses} /> */}
          <Route exact path="/" component={Todos} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  </Router>
)

export default App
