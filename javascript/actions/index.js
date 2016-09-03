import { getCurrentFractal } from 'reducers'

export const resetFractal = () => (dispatch, getState) => {
  dispatch({
    type: 'RESET_FRACTAL_CONFIG',
    fractal: getCurrentFractal(getState())
  })
}

export const zoomToLocation = ({ location, fractal }) => (dispatch, getState) => {
  dispatch({
    type: 'ZOOM_TO_LOCATION',
    fractal: getCurrentFractal(getState()),
    location
  })
}

export const zoomOut = () => (dispatch, getState) => {
  dispatch({
    type: 'ZOOM_OUT',
    fractal: getCurrentFractal(getState())
  })
}

export const setConfigValue = ({ name, value }) => (dispatch, getState) => {
  dispatch({
    type: 'SET_CONFIG_VALUE',
    fractal: getCurrentFractal(getState()),
    name,
    value
  })
}

export const setCurrentFractal = ({fractal}) => dispatch => {
  dispatch({
    type: 'SET_FRACTAL',
    value: fractal
  })
}

export const toggleMenu = () => dispatch => {
  dispatch({
    type: 'TOGGLE_MENU'
  })
}
