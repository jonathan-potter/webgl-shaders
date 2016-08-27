import { DEFAULT_BOUNDS } from 'javascript/config'

export default function (state = DEFAULT_BOUNDS, action) {
  switch(action.type) {
    case 'SET_BOUNDS':
      return {
        x_min: action.x_min,
        x_max: action.x_max,
        y_min: action.y_min,
        y_max: action.y_max
      }
    case 'RESET':
      return DEFAULT_BOUNDS
    default:
      return state
  }
}
