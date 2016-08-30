import React from 'react'

import map from 'lodash/map'

export default () => {
  return (
    <menu className="slide-out-menu">
      <ul className="menu-items">
        <ShareGroup />
        <SelectMenuItem name="fractal" options={['Julia Set', 'Mandelbrot Set']} />
        <SelectMenuItem name="colorset" options={['linear', 'squared periodic']} />
        <RangeMenuItem name="brightness" min="1" max="8" value="4" />
        <RangeMenuItem name="speed" min="0" max="320" value="30" />
        <RangeMenuItem name="exponent" min="0" max="10" value="2" />
        <SelectMenuItem name="supersamples" options={{ 1: '1x', 4: '4x', 16: '16x' }} />
      </ul>
    </menu>
  )
}

const ShareGroup = () => (
  <li className="menu-item share-group">
    <div className="ssk-group ssk-lg">
      <a href="" className="ssk menu-size-mod ssk-facebook"></a>
      <a href="" className="ssk menu-size-mod ssk-twitter"></a>
      <a href="" className="ssk menu-size-mod ssk-google-plus"></a>
      <a href="" className="ssk menu-size-mod ssk-pinterest"></a>
      <a href="" className="ssk menu-size-mod ssk-tumblr"></a>
    </div>
  </li>
)

const SelectMenuItem = ({ name, options }) => {
  const optionElements = map(options, (name, key) => (
    <option key={key} value={key}>
      {name}
    </option>
  ))

  return (
    <li className="menu-item">
      <div className="menu-item-label left">
        <label htmlFor={name}>{name}</label>
      </div>
      <div className="menu-item-range left">
        <select type="select" name={name} className={`${name}-selector`} className={`${name}-selector`}>
          {optionElements}
        </select>
      </div>
    </li>
  )
}

const RangeMenuItem = ({ name, min, max, value }) => (
  <li className="menu-item">
    <div className="menu-item-label left">
        <label htmlFor={name}>{name}</label>
    </div>
    <div className="menu-item-range left">
      <input type="range" name={name} min={min} max={max} step="0.001" value={value} className="config-input" />
    </div>
  </li>
)
