import React from 'react'
import Menu from 'components/Menu'

export default () => {
  return (
    <div>
      <Menu />
      <Header />
      <canvas id="main"></canvas>
    </div>
  )
}

function Header () {
  return (
    <header>
      <div className="container">
        <heading>
          <button className="hamberger-menu header-block-button">
            <i className="header-icon icon-menu"></i>
          </button>
          <a className="header-block-button" href="https://jonathan-potter.github.io/webgl-shaders/">
            WebGL Fractal Renderer
          </a>
          <button className="reset-button button-primary">
            reset
          </button>
        </heading>
        <nav className="right">
          <ul>
            <li>
              <a className="header-block-button" href="https://github.com/jonathan-potter/webgl-shaders" title="Github repo">
                <i className="header-icon icon-github-circled"></i>
              </a>
            </li>
            <li>
              <a className="header-block-button" href="https://twitter.com/PotterRawr" title="Twitter: @potterrawr">
                <i className="header-icon icon-twitter"></i>
              </a>
            </li>
            <li>
              <a className="header-block-button" href="https://en.wikipedia.org/wiki/Fractal" title="Wikipedia: Fractal">
                <i className="header-icon icon-wikipedia"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
