import { loadState, saveState } from 'utility/localStorage'
import rootReducer from 'reducers'

import { applyMiddleware, createStore } from 'redux'
import throttle from 'lodash/throttle'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

export default function configureStore () {
  const middlewares = [thunk, createLogger()]

  const initialState = loadState()
  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))

  store.subscribe(throttle(() => {
    const state = store.getState()

    saveState({
      currentShader: state.currentShader,
      shaders: state.shaders,
      viewports: state.viewports
    })
  }, 1000))

  return store
}
