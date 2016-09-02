import createReducer from 'reducers/createReducer'

export default createReducer('fractal', 'julia set')

export const getCurrentFractal = (state) => state.currentFractal

