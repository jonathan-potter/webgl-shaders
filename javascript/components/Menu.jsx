import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getCurrentFractal, getFractalConfig } from 'reducers'
import map from 'lodash/map'

export default () => {
  return (
    <menu className="slide-out-menu">
      <ul className="menu-items">
        <ShareGroup />
        <SelectFractalItem name="fractal" options={['Julia Set', 'Mandelbrot Set']} />
        <SelectMenuItem name="colorset" options={['linear', 'squared periodic']} />
        <RangeMenuItem name="brightness" min="1" max="8" />
        <RangeMenuItem name="speed" min="0" max="320" />
        <RangeMenuItem name="exponent" min="0" max="10" />
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

const mapStateToProps = (state) => ({
  config: getFractalConfig(state, getCurrentFractal(state)),
  currentFractal: getCurrentFractal(state)
})

const SelectFractalItem = connect(mapStateToProps, actions)(({ currentFractal, name, options, setCurrentFractal }) => {
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
        <select
          className={`${name}-selector`}
          type="select"
          name={name}
          value={currentFractal}
          onChange={event => setCurrentFractal({
            fractal: event.currentTarget.value
          })}>
          {optionElements}
        </select>
      </div>
    </li>
  )
})

const SelectMenuItem = connect(mapStateToProps, actions)(({ config, name, options, setConfigValue }) => {
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
        <select
          className={`${name}-selector`}
          type="select"
          name={name}
          value={config[name]}
          onChange={event => setConfigValue({
            value: event.currentTarget.value,
            name
          })}>
          {optionElements}
        </select>
      </div>
    </li>
  )
})

const RangeMenuItem = connect(mapStateToProps, actions)(({ config, name, min, max, setConfigValue }) => {
  return (
    <li className="menu-item">
      <div className="menu-item-label left">
        <label htmlFor={name}>{name}</label>
      </div>
      <div className="menu-item-range left">
        <input type="range"
          className="config-input"
          name={name}
          min={min}
          max={max}
          step="0.001"
          value={config[name]}
          onChange={event => setConfigValue({
            value: event.currentTarget.value,
            name
          })} />
      </div>
    </li>
  )
})
