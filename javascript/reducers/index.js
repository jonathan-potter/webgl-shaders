import { combineReducers } from 'redux'
import { DEFAULT_STORE } from 'javascript/config'
import currentShader, * as fromCurrentShader from 'reducers/currentShader'
import createShader, * as Shader from 'reducers/createShader'
import menuOpen from 'reducers/menuOpen'
import mapValues from 'lodash/mapValues'

export default combineReducers({
  currentShader,
  shaders: combineReducers(mapValues(DEFAULT_STORE, (shaderConfig, shaderName) => (
    createShader(shaderName, shaderConfig)
  ))),
  menuOpen
})

export const getCurrentShader = state => fromCurrentShader.getCurrentShader(state)
export const getShaderConfig = (state, shader) => Shader.getShaderConfig(state, shader)
export const getShaderViewport = (state, shader) => Shader.getShaderViewport(state, shader)
