import { combineReducers } from 'redux'
import { DEFAULT_CONFIG } from 'javascript/config'
import currentFractal, * as fromCurrentFractal from 'reducers/currentFractal'
import createFractal, * as Fractal from 'reducers/createFractal'
import menuOpen from 'reducers/menuOpen'
import mapValues from 'lodash/mapValues'

export default combineReducers({
  currentFractal,
  fractals: combineReducers(mapValues(DEFAULT_CONFIG, (fractalConfig, fractalName) => (
    createFractal(fractalName, fractalConfig)
  ))),
  menuOpen
})

export const getCurrentFractal = state => fromCurrentFractal.getCurrentFractal(state)
export const getFractalConfig = (state, fractal) => Fractal.getFractalConfig(state, fractal)
export const getFractalViewport = (state, fractal) => Fractal.getFractalViewport(state, fractal)
