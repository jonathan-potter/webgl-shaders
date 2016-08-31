export const resetFractal = () => (dispatch, getState) => {
  dispatch({
    type: 'RESET_FRACTAL_CONFIG',
    fractal: getState().fractal
  })
}

export const toggleMenu = () => dispatch => {
  dispatch({
    type: 'TOGGLE_MENU'
  })
}
