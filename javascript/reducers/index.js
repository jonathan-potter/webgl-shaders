import { combineReducers } from 'redux'
import fractal, * as fromFractal from 'reducers/fractal'
import createFractal from 'reducers/createFractal'
import menuOpen from 'reducers/menuOpen'

export default combineReducers({
  fractal,
  menuOpen,
  propertiesByFractal: fromFractal.propertiesByFractal,
  viewports: combineReducers({
    'julia set': createFractal('julia set'),
    'mandelbrot set': createFractal('mandelbrot set')
  })
})

export const getCurrentFractal = state => fromFractal.getCurrentFractal(state)
export const getFractalConfig = (state, fractal) => fromFractal.getFractalConfig(state, fractal)
