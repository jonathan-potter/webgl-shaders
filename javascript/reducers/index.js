import { combineReducers } from 'redux'
import { DEFAULT_CONFIG } from 'javascript/config'
import currentFractal, * as fromCurrentFractal from 'reducers/currentFractal'
import createFractal, * as Fractal from 'reducers/createFractal'
import menuOpen from 'reducers/menuOpen'

export default combineReducers({
  currentFractal,
  fractals: combineReducers({
    'julia set': createFractal('julia set', DEFAULT_CONFIG['julia set']),
    'mandelbrot set': createFractal('mandelbrot set', DEFAULT_CONFIG['mandelbrot set'])
  }),
  menuOpen
})

export const getCurrentFractal = state => fromCurrentFractal.getCurrentFractal(state)
export const getFractalConfig = (state, fractal) => Fractal.getFractalConfig(state, fractal)
export const getFractalViewport = (state, fractal) => Fractal.getFractalViewport(state, fractal)
