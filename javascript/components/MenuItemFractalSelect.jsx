import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getCurrentFractal } from 'reducers'
import map from 'lodash/map'

const mapStateToProps = (state) => ({
  currentFractal: getCurrentFractal(state)
})

export default connect(mapStateToProps, actions)(
  ({ currentFractal, name, options, setCurrentFractal }) => {
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
  }
)
