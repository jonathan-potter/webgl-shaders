import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getCurrentShader, getShaderConfig } from 'reducers'

const mapStateToProps = (state) => ({
  config: getShaderConfig(state, getCurrentShader(state))
})

export default connect(mapStateToProps, actions)(({ config, name, min, max, setConfigValue }) => {
  return (
    <li className='menu-item'>
      <div className='menu-item-label left'>
        <label htmlFor={name}>{name}</label>
      </div>
      <div className='menu-item-range left'>
        <input type='range'
          className='config-input'
          name={name}
          min={min}
          max={max}
          step='0.001'
          value={config[name]}
          onChange={event => setConfigValue({
            value: event.currentTarget.value,
            name
          })} />
      </div>
    </li>
  )
})
