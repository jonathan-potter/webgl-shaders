import { getCurrentFractal } from 'reducers'
import registerEvent from 'utility/registerEvent'
import throttle from 'lodash/throttle'

const throttledRegisterEvent = throttle(registerEvent, 1000)

export const resetFractal = () => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'RESET_FRACTAL_CONFIG'

  registerEvent({
    category: currentFractal,
    action: action
  })

  dispatch({
    type: action,
    fractal: currentFractal
  })
}

export const zoomToLocation = ({ location, fractal }) => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'ZOOM_TO_LOCATION'

  registerEvent({
    category: currentFractal,
    action: action
  })

  dispatch({
    type: action,
    fractal: currentFractal,
    location
  })
}

export const zoomOut = () => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'ZOOM_OUT'

  registerEvent({
    category: currentFractal,
    action: action
  })

  dispatch({
    type: action,
    fractal: currentFractal
  })
}

export const setConfigValue = ({ name, value }) => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'SET_CONFIG_VALUE'

  throttledRegisterEvent({
    category: currentFractal,
    action: action,
    label: name,
    value
  })

  dispatch({
    type: action,
    fractal: getCurrentFractal(getState()),
    name,
    value
  })
}

export const setCurrentFractal = ({fractal}) => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'SET_FRACTAL'

  throttledRegisterEvent({
    category: currentFractal,
    action: action,
    label: fractal
  })

  dispatch({
    type: action,
    value: fractal
  })
}

export const toggleMenu = () => (dispatch, getState) => {
  const currentFractal = getCurrentFractal(getState())
  const action = 'TOGGLE_MENU'

  throttledRegisterEvent({
    category: currentFractal,
    action: action
  })

  dispatch({
    type: action
  })
}

