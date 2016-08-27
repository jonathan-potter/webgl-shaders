import { combineReducers } from 'redux'

import { DEFAULT_CONFIG } from 'javascript/config'

import mapValues from 'lodash/mapValues'

const reducers = mapValues(DEFAULT_CONFIG, (defaultValue, name) => {
  return createReducer(name, defaultValue)
})

export default combineReducers(reducers)

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
