import { combineReducers } from 'redux'
import fractal, { propertiesByFractal } from 'reducers/fractal'
import menuOpen from 'reducers/menuOpen'

export default combineReducers({
  fractal,
  menuOpen,
  propertiesByFractal
})


