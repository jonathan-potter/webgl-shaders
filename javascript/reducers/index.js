import { combineReducers } from 'redux'
import { DEFAULT_CONFIG } from 'javascript/config'
import bounds from 'reducers/bounds'

import mapValues from 'lodash/mapValues'

const config = mapValues(DEFAULT_CONFIG, (defaultValue, name) => {
  return createReducer(name, defaultValue)
})

export default combineReducers({
  config: combineReducers(config),
  bounds
})

function createReducer(name, defaultValue) {
  return function (state = defaultValue, action) {
    switch (action.type) {
      case `SET_${name.toUpperCase()}`:
        return action.value
      case 'RESET':
        return defaultValue
      default:
        return state
    }
  }
}
