import { combineReducers } from 'redux'
import Viewport from 'javascript/Viewport'

const { atan2, cos, PI: pi, sin, sqrt } = Math

export default function (SHADER, DEFAULT_PROPERTIES) {
  return combineReducers({
    viewport (state = DEFAULT_PROPERTIES.viewport, action) {
      if (action.shader !== SHADER) { return state }

      const viewport = Viewport.create(state)

      switch (action.type) {
        case 'RESET_SHADER_CONFIG':
          return DEFAULT_PROPERTIES.viewport
        case 'SET_VIEWPORT':
          return action.value
        case 'PINCH_ZOOM':
          const start = action.pinchStart
          const current = action.pinchCurrent

          const rotation = ((start.viewport.rotation || 0) + current.rotation) % (2 * pi)

          const cartesianCenter = start.viewport.center
          const startViewport = Viewport.create(start.viewport)
          const cartesianTouchCenter = startViewport.cartesianLocation(start.center)

          let newCenter = rotatePointAroundCenter({
            point: cartesianCenter,
            center: cartesianTouchCenter,
            rotation: current.rotation
          })

          newCenter = scalePointAroundCenter({
            point: newCenter,
            center: cartesianTouchCenter,
            scale: current.scale
          })

          /* range.x is intentionally ignored in favor of setting */
          /* the window dimensions to dictate aspect ratio */
          const ASPECT_RATIO = window.innerWidth / window.innerHeight
          const range = {
            x: start.viewport.range.y * ASPECT_RATIO,
            y: start.viewport.range.y
          }

          /* translate */
          let dx = (start.center.x - current.center.x) * range.x
          let dy = (start.center.y - current.center.y) * range.y

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
              x: newCenter.x + dx,
              y: newCenter.y - dy
            },
            range: {
              x: range.x / current.scale,
              y: range.y / current.scale
            },
            rotation: rotation
          }
        case 'ZOOM_TO_LOCATION':
          const location = viewport.cartesianLocation(action.location)

          return viewport.zoomToLocation(location).serialize()
        case 'ZOOM_OUT':
          return viewport.zoomOut(location).serialize()
        case 'ROTATE_VIEWPORT': {
          /* placed here for desktop debugging */
          return {
            ...state,
            rotation: state.rotation + pi / 4
          }
        }
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

function rotatePointAroundCenter ({ point, center, rotation }) {
  const dx = point.x - center.x
  const dy = point.y - center.y

  const magnitude = sqrt(dx * dx + dy * dy)
  const angle = atan2(dy, dx)

  center = {
    x: center.x + magnitude * cos(angle + rotation),
    y: center.y + magnitude * sin(angle + rotation)
  }

  return center
}

function scalePointAroundCenter ({ point, center, scale }) {
  const dx = point.x - center.x
  const dy = point.y - center.y

  return {
    x: center.x + dx / scale,
    y: center.y + dy / scale
  }
}
