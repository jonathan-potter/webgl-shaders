import { combineReducers } from 'redux'
import fractal, * as fromFractal from 'reducers/fractal'
import menuOpen from 'reducers/menuOpen'

export default combineReducers({
  fractal,
  menuOpen,
  propertiesByFractal: fromFractal.propertiesByFractal
})

export const getCurrentFractal = state => fromFractal.getCurrentFractal(state)
export const getFractalConfig = (state, fractal) => fromFractal.getFractalConfig(state, fractal)
export const getFractalBounds = (state, fractal) => fromFractal.getFractalBounds(state, fractal)


