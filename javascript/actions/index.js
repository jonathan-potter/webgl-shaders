export const resetFractal = () => (dispatch, getState) => {
  dispatch({
    type: 'RESET_FRACTAL_CONFIG',
    fractal: getState().fractal
  })
}

export const setConfigValue = ({ name, value }) => (dispatch, getState) => {
  dispatch({
    type: 'SET_CONFIG_VALUE',
    fractal: getState().fractal,
    name,
    value
  })
}

export const toggleMenu = () => dispatch => {
  dispatch({
    type: 'TOGGLE_MENU'
  })
}
