import { combineReducers } from 'redux'
import { DEFAULT_STORE } from 'javascript/config'
import createReducer from 'reducers/createReducer'
import currentShader, * as fromCurrentShader from 'reducers/currentShader'
import createShader, * as Shader from 'reducers/createShader'
import menuOpen from 'reducers/menuOpen'
import mapValues from 'lodash/mapValues'

export default combineReducers({
  currentShader,
  pinchStart: createReducer('pinch_start', {}),
  menuOpen,
  shaders: combineReducers(mapValues(DEFAULT_STORE, (shaderConfig, shaderName) => (
    createShader(shaderName, shaderConfig)
  )))
})

export const getCurrentShader = state => fromCurrentShader.getCurrentShader(state)
export const getShaderConfig = (state, shader) => Shader.getShaderConfig(state, shader)
export const getShaderViewport = (state, shader) => Shader.getShaderViewport(state, shader)
export const getPinchStart = state => state.pinchStart
