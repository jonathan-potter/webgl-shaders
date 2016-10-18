import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

const { atan2, cos, PI: pi, sin, sqrt } = Math

export default function (SHADER, DEFAULT_PROPERTIES) {
  return combineReducers({
    viewport (state = DEFAULT_PROPERTIES.viewport, action) {
      if (action.shader !== SHADER) { return state }

      const viewport = Viewport.create({ center: state.center, range: state.range })

      switch (action.type) {
        case 'RESET_SHADER_CONFIG':
          return DEFAULT_PROPERTIES.viewport
        case 'SET_VIEWPORT':
          return action.value
        case 'PINCH_ZOOM':
          const start = action.pinchStart
          const current = action.pinchCurrent

          const { canvas } = start
          const { range } = start.viewport

          const rotation = ((start.viewport.rotation || 0) + current.rotation * pi / 180) % (2 * pi)

          /* translate */
          let dx = (start.center.x - current.center.x) / canvas.width * range.x
          let dy = (start.center.y - current.center.y) / canvas.height * range.y

          /* rotate */
          const magnitude = sqrt(dx * dx + dy * dy)
          const angle = atan2(dy, dx)

          dx = magnitude * cos(angle - rotation)
          dy = magnitude * sin(angle - rotation)

          /* scale */
          dx /= current.scale
          dy /= current.scale

          return {
            center: {
              x: start.viewport.center.x + dx,
              y: start.viewport.center.y - dy
            },
            range: {
              x: range.x / current.scale,
              y: range.y / current.scale
            },
            rotation
          }
        case 'ZOOM_TO_LOCATION':
          const location = viewport.cartesianLocation(action.location)

          return viewport.zoomToLocation(location).serialize()
        case 'ZOOM_OUT':
          return viewport.zoomOut(location).serialize()
        default:
          return state
      }
    },

    config (state = DEFAULT_PROPERTIES.config, action) {
      if (action.shader !== SHADER) { return state }

      switch (action.type) {
        case 'RESET_SHADER_CONFIG':
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

export const getShaderConfig = (state, shader) => state.shaders[shader].config
export const getShaderViewport = (state, shader) => state.shaders[shader].viewport
