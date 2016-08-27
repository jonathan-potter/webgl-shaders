import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'

import { loadState, saveState } from 'utility/localStorage'

import rootReducer from 'reducers'

import throttle from 'lodash/throttle'

export default function configureStore() {
  const middlewares = [createLogger()]

  const initialState = loadState()
  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))

  store.subscribe(throttle(() => {
    saveState(store.getState())
  }, 1000))

  return store
}
