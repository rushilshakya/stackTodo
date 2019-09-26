import React from 'react'

const PageNotFound = props => (
  <div>
    The page you are trying to access ({props.location.pathname}) is not
    available. please try one of the links on the navigation bar.
  </div>
)

export default PageNotFound
