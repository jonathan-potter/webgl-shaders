import React from 'react'
import { Provider } from 'react-redux'
import App from 'components/App'

export default ({ store, initializeWebGL }) => {
  return (
    <Provider store={store}>
      <App initializeWebGL={initializeWebGL} />
    </Provider>
  )
}
