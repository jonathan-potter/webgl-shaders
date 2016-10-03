import createReducer from 'reducers/createReducer'

export default createReducer('shader', 'julia set')

export const getCurrentShader = (state) => state.currentShader

