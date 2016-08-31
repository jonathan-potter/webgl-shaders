import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getCurrentFractal, getFractalConfig } from 'reducers'
import map from 'lodash/map'

const mapStateToProps = (state) => ({
  config: getFractalConfig(state, getCurrentFractal(state))
})

export default connect(mapStateToProps, actions)(({ config, name, options, setConfigValue }) => {
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
