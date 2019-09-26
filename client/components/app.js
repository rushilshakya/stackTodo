import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Navbar from './navbar'
import Todos from './todos'
import Footer from './footer'
import About from './about'
import Contact from './contact'
import PageNotFound from './pageNotFound'

const App = () => (
  <Router>
    <div>
      <Navbar />
      <main>
        <Switch>
          {/* <Route exact path="/" component={Campuses} /> */}
          <Route exact path="/" component={Todos} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  </Router>
)

export default App
