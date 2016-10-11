import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

export default function (SHADER, DEFAULT_PROPERTIES) {
  return combineReducers({
    viewport (state = DEFAULT_PROPERTIES.viewport, action) {
      if (action.shader !== SHADER) { return state }

      const viewport = Viewport.create({ center: state.center, range: state.range })

      const { range, rotation = 0 } = action.initialViewport

      switch (action.type) {
        case 'RESET_SHADER_CONFIG':
          return DEFAULT_PROPERTIES.viewport
        case 'SET_VIEWPORT':
          return action.value
        case 'PINCH_ZOOM':
          return {
            ...state,
            range: {
              x: range.x / action.scale,
              y: range.y / action.scale
            },
            rotation: rotation + Math.PI / 180 * action.rotation
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
