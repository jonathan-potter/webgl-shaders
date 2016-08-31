import createReducer from 'reducers/createReducer'
import { DEFAULT_FRACTALS } from 'javascript/config'

export default createReducer('fractal', 0)

export function propertiesByFractal(state = DEFAULT_FRACTALS, action) {
  const properties = state[action.fractal]

  switch(action.type) {
    case 'SET_CONFIG_VALUE':
      return {
        ...state,
        [action.fractal]: {
          ...properties,
          config: {
            ...properties.config,
            [action.name]: action.value
          }
        }
      }
    case 'SET_BOUNDS':
      return {
        ...state,
        [action.fractal]: {
          ...properties,
          bounds: action.bounds
        }
      }
    case 'RESET_FRACTAL_CONFIG':
      return {
        ...state,
        [action.fractal]: DEFAULT_FRACTALS[action.fractal]
      }
    default:
      return state
  }
}

export const getCurrentFractal = (state) => state.fractal
export const getFractalConfig = (state, fractal) => state.propertiesByFractal[fractal].config
export const getFractalBounds = (state, fractal) => state.propertiesByFractal[fractal].bounds

