import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import IndexPage from './IndexPage'
import NotFoundPage from './NotFound'

class Index extends Component {
  render() {
    return (
      <Router>
        <div className='header'> 
          <nav className='navbar navbar-default navigation-clean'>
              <div className='container'>
                  <div className='navbar-header'>
                    <a className='navbar-brand navbar-link'>
                      <NavLink to='/'><img src='/assets/img/Logo.png' id='logo' title='logo' /></NavLink>
                    </a>
                    <button className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navcol1'>
                      <span className='sr-only'>Toggle navigation</span>
                      <span className='icon-bar'></span><span className='icon-bar'></span><span className='icon-bar'></span>
                    </button>
                  </div>
                  <div className='collapse navbar-collapse' id='navcol1'>
                      <ul className='nav navbar-nav navbar-right'>
                          <li className='dropdown'><a className='dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>About Us<span className='caret'></span></a>
                              <ul className='dropdown-menu' role='menu'>
                                  <li role='presentation'><NavLink to='/about-us/vision'>Vision</NavLink></li>
                                  <li role='presentation'><NavLink to='/about-us/team'>Team</NavLink></li>
                                  <li role='presentation'><NavLink to='/about-us/constitution'>Constitution</NavLink></li>
                              </ul>
                          </li>
                          <li role='presentation'><NavLink to='/schools'>For Schools</NavLink></li>
                          <li role='presentation'><NavLink to='/parents'>For Parents</NavLink></li>
                          <li role='presentation'><NavLink to='/blog'>Blog</NavLink></li>
                          <li role='presentation'><NavLink to='/get-involved'>Get Involved</NavLink></li>
                          <li role='presentation' id='donate'><NavLink to='/donate'>Donate</NavLink></li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div id='spacer'></div>
          <main>
            <Switch>
              <Route exact path='/' component={ IndexPage } />
              <Route path='*' component={ NotFoundPage } />
            </Switch>
          </main>
        </div>
      </Router>
    )
  }
}

export default Index