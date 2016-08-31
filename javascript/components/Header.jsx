import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'
import classnames from 'classnames'

import 'css/header.css'

export default () => {
  return (
    <header>
      <div className="container">
        <MenuGroup />
        <NavGroup />
      </div>
    </header>
  )
}
const mapStateToProps = ({ fractal }) => ({ fractal })
const MenuGroup = connect(mapStateToProps, actions)(({ fractal, toggleMenu, resetFractal }) => {
  return (
    <heading>
      <button
        className="hamberger-menu header-block-button"
        onClick={toggleMenu}>
        <i className="header-icon icon-menu"></i>
      </button>
      <a className="header-block-button" href="https://jonathan-potter.github.io/webgl-shaders/">
        WebGL Fractal Renderer
      </a>
      <button
        className="reset-button button-primary"
        onClick={resetFractal}>
        reset
      </button>
    </heading>
  )
})

const NavGroup = () => (
  <nav className="right">
    <ul>
      <NavGroupLink
        href="https://github.com/jonathan-potter/webgl-shaders"
        title="Github repo"
        iconClass="icon-github-circled" />
      <NavGroupLink
        href="https://twitter.com/PotterRawr"
        title="Twitter: @potterrawr"
        iconClass="icon-twitter" />
      <NavGroupLink
        href="https://en.wikipedia.org/wiki/Fractal"
        title="Wikipedia: Fractal"
        iconClass="icon-wikipedia" />
    </ul>
  </nav>
)

const NavGroupLink = ({ href, iconClass, title }) => {
  const className = classnames('header-icon', iconClass)

  return (
    <li>
      <a className="header-block-button" href={href} title={title}>
        <i className={className}></i>
      </a>
    </li>
  )
}
