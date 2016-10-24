import { getCurrentShader, getShaderViewport, getPinchStart } from 'reducers'
import registerEvent from 'utility/registerEvent'
import throttle from 'lodash/throttle'

const throttledRegisterEvent = throttle(registerEvent, 1000)

export const resetShader = () => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'RESET_SHADER_CONFIG'

  registerEvent({
    category: currentShader,
    action: action
  })

  dispatch({
    type: action,
    shader: currentShader
  })
}

export const zoomToLocation = ({ location, shader }) => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'ZOOM_TO_LOCATION'

  registerEvent({
    category: currentShader,
    action: action
  })

  dispatch({
    type: action,
    shader: currentShader,
    location
  })
}

export const zoomOut = () => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'ZOOM_OUT'

  registerEvent({
    category: currentShader,
    action: action
  })

  dispatch({
    type: action,
    shader: currentShader
  })
}

export const setConfigValue = ({ name, value }) => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'SET_CONFIG_VALUE'

  throttledRegisterEvent({
    category: currentShader,
    action: action,
    label: name,
    value
  })

  dispatch({
    type: action,
    shader: getCurrentShader(getState()),
    name,
    value
  })
}

export const setCurrentShader = ({ shader }) => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'SET_SHADER'

  throttledRegisterEvent({
    category: currentShader,
    action: action,
    label: shader
  })

  dispatch({
    type: action,
    value: shader
  })
}

export const toggleMenu = () => (dispatch, getState) => {
  const currentShader = getCurrentShader(getState())
  const action = 'TOGGLE_MENU'

  throttledRegisterEvent({
    category: currentShader,
    action: action
  })

  dispatch({
    type: action
  })
}

export const setPinchStart = ({ center }) => (dispatch, getState) => {
  const state = getState()

  const currentShader = getCurrentShader(state)
  const viewport = getShaderViewport(state, currentShader)
  const action = 'SET_PINCH_START'

  registerEvent({
    category: currentShader,
    action: action
  })

  dispatch({
    type: action,
    value: {
      center,
      viewport: { ...viewport }
    }
  })
}

export const pinchZoom = ({ center, rotation, scale }) => (dispatch, getState) => {
  const state = getState()

  const currentShader = getCurrentShader(state)
  const pinchStart = getPinchStart(state)
  const action = 'PINCH_ZOOM'

  if (Object.keys(pinchStart).length > 0) {
    /* pinch start must have registered before firing this action */

    dispatch({
      type: action,
      shader: currentShader,
      pinchStart,
      pinchCurrent: {
        center,
        rotation,
        scale
      }
    })
  }
}

export const resetPinchStart = () => (dispatch) => {
  dispatch({
    type: 'RESET_PINCH_START'
  })
}
