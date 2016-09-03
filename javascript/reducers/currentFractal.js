import createReducer from 'reducers/createReducer'

export default createReducer('fractal', 'modified collatz')

export const getCurrentFractal = (state) => state.currentFractal

