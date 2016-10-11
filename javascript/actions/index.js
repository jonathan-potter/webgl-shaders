import { getCurrentShader, getShaderViewport, getInitialViewport } from 'reducers'
import registerEvent from 'utility/registerEvent'
import mapValues from 'lodash/mapValues'
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

export const setInitialViewport = () => (dispatch, getState) => {
  const state = getState()

  const currentShader = getCurrentShader(state)
  const viewport = getShaderViewport(state, currentShader)
  const action = 'SET_INITIAL_VIEWPORT'

  dispatch({
    type: action,
    value: viewport
  })
}

export const pinchZoom = ({ scale }) => (dispatch, getState) => {
  const state = getState()

  const currentShader = getCurrentShader(state)
  const viewport = getShaderViewport(state, currentShader)
  const initialViewport = getInitialViewport(state)
  const action = 'SET_VIEWPORT'

  const newViewport = {
    ...viewport,
    range: mapValues(initialViewport.range, axisScale => axisScale / scale)
  }

  dispatch({
    type: action,
    shader: currentShader,
    value: newViewport
  })
}

