import React from 'react'
// import {connect} from 'react-redux'

const Navbar = () => {
  return (
    <div>
      {/* top nav */}
      <nav className="z-depth-0">
        <div className="nav-wrapper container">
          <a href="/">
            A Better<span>TODO</span>
          </a>
          <span className="right grey-text text-darken-1">
            <i
              className="material-icons sidenav-trigger"
              data-target="side-menu"
            >
              menu
            </i>
          </span>
        </div>
      </nav>

      {/* side nav */}
      <ul id="side-menu" className="sidenav side-menu">
        <li>
          <a className="subheader">FOODNINJA</a>
        </li>
        <li>
          <a href="/" className="waves-effect">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="waves-effect">
            About
          </a>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a href="contact" className="waves-effect">
            <i className="material-icons">mail_outline</i>Contact
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
