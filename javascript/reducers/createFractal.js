import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

export default function (FRACTAL, DEFAULT_PROPERTIES) {
  return combineReducers({
    viewport (state = DEFAULT_PROPERTIES.viewport, action) {
      if (action.fractal !== FRACTAL) { return state }

      switch (action.type) {
        case 'RESET_FRACTAL_CONFIG':
          return DEFAULT_PROPERTIES.viewport
        case 'ZOOM_TO_LOCATION':
          const viewport = Viewport.create({ center: state.center, range: state.range })

          const location = viewport.cartesianLocation(action.location)

          return viewport.zoomToLocation(location).serialize()
        default:
          return state
      }
    },

    config (state = DEFAULT_PROPERTIES.config, action) {
      if (action.fractal !== FRACTAL) { return state }

      switch (action.type) {
        case 'RESET_FRACTAL_CONFIG':
          return DEFAULT_PROPERTIES.config
        case 'SET_CONFIG_VALUE':
          return {
            ...state,
            [action.name]: action.value
          }
        default:
          return state
      }
    }
  })
}

export const getFractalConfig = (state, fractal) => state.fractals[fractal].config
export const getFractalViewport = (state, fractal) => state.fractals[fractal].viewport
