import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

const DEFAULT_VIEWPORT = {
  center: { x: 0, y: 0 },
  range: { x: 4, y: 4 }
}

export default (FRACTAL) => {
  return combineReducers({
    viewport (state = DEFAULT_VIEWPORT, action) {
      if (action.fractal !== FRACTAL) { return state }

      switch (action.type) {
        case 'RESET_FRACTAL_CONFIG':
          return DEFAULT_VIEWPORT
        case 'ZOOM_TO_LOCATION':
          const viewport = Viewport.create({ center: state.center, range: state.range })

          const location = viewport.cartesianLocation(action.location)

          return viewport.zoomToLocation(location).serialize()
        default:
          return state
      }
    }
  })
}
