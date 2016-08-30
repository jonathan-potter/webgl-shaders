import React from 'react'

export default () => {
  return (
    <div>
      <Menu />
      <Header />
      <canvas id="main"></canvas>
    </div>
  )
}

function Menu () {
  return (
    <menu className="slide-out-menu">
      <ul className="menu-items">
        <li className="menu-item share-group">
          <div className="ssk-group ssk-lg">
            <a href="" className="ssk menu-size-mod ssk-facebook"></a>
            <a href="" className="ssk menu-size-mod ssk-twitter"></a>
            <a href="" className="ssk menu-size-mod ssk-google-plus"></a>
            <a href="" className="ssk menu-size-mod ssk-pinterest"></a>
            <a href="" className="ssk menu-size-mod ssk-tumblr"></a>
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="fractal">fractal</label>
          </div>
          <div className="menu-item-range left">
            <select type="select" name="fractal" className="fractal-selector" className="fractal-selector">
              <option value="0">Julia Set</option>
              <option value="1">Mandelbrot Set</option>
            </select>
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="colorset">colorset</label>
          </div>
          <div className="menu-item-range left">
            <select type="select" name="colorset" className="config-selector">
              <option value="0">linear</option>
              <option value="1">squared periodic</option>
            </select>
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="brightness">brightness</label>
          </div>
          <div className="menu-item-range left">
            <input type="range" name="brightness" min="1" max="8" step="0.001" value="4" className="config-input" />
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="speed">speed</label>
          </div>
          <div className="menu-item-range left">
            <input type="range" name="speed" min="0" max="320" step="0.001" value="30" className="config-input" />
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="exponent">exponent</label>
          </div>
          <div className="menu-item-range left">
            <input type="range" name="exponent" min="0" max="10" step="0.001" value="2" className="config-input" />
          </div>
        </li>
        <li className="menu-item">
          <div className="menu-item-label left">
            <label htmlFor="supersamples">supersamples</label>
          </div>
          <div className="menu-item-range left">
            <select type="select" name="supersamples" id="supersamples" className="config-selector">
              <option value="1">1x</option>
              <option value="4">4x</option>
              <option value="16">16x</option>
            </select>
          </div>
        </li>
      </ul>
    </menu>
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
