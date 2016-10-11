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

          /* translate */
          let dx = current.center.x - start.center.x
          let dy = current.center.y - start.center.y

          /* rotate */
          const magnitude = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

          dx = magnitude * Math.cos(angle + Math.PI / 180 * current.rotation)
          dy = magnitude * Math.sin(angle + Math.PI / 180 * current.rotation)

          /* scale */
          dx *= current.scale / start.canvas.width
          dy *= current.scale / start.canvas.height

          const center = {
            x: start.viewport.center.x - dx * start.viewport.range.x,
            y: start.viewport.center.y + dy * start.viewport.range.y
          }

          return {
            center,
            range: {
              x: start.viewport.range.x / current.scale,
              y: start.viewport.range.y / current.scale
            },
            rotation: start.viewport.rotation + Math.PI / 180 * current.rotation
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
