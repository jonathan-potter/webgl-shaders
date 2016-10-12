import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

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

          const rotation = start.viewport.rotation + current.rotation * Math.PI / 180

          /* translate */
          let dx = (start.center.x - current.center.x) / start.canvas.width
          let dy = (start.center.y - current.center.y) / start.canvas.height

          /* rotate */
          const magnitude = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

          dx = magnitude * Math.cos(angle - rotation)
          dy = magnitude * Math.sin(angle - rotation)

          /* scale */
          dx /= current.scale
          dy /= current.scale

          return {
            center: {
              x: start.viewport.center.x + dx * start.viewport.range.x,
              y: start.viewport.center.y - dy * start.viewport.range.y
            },
            range: {
              x: start.viewport.range.x / current.scale,
              y: start.viewport.range.y / current.scale
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
