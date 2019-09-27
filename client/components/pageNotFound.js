import React from 'react'

const PageNotFound = props => (
  <div class="container grey-text center">
    <p>
      The page you are trying to access ({props.location.pathname}) is not
      available. please try one of the links on the navigation bar.
    </p>
    <a href="/" class="btn-small orange z-depth-0">
      Go to the Homepage
    </a>
    <br />
  </div>
)

export default PageNotFound
