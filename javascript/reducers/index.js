import { combineReducers } from 'redux'
// import createReducer from 'reducers/createReducer'
import fractal, { propertiesByFractal } from 'reducers/fractal'

export default combineReducers({
  fractal,
  propertiesByFractal
})


