import React from 'react'
import { Provider } from 'react-redux'
import App from 'components/App'

export default ({ store, configureWebGL }) => {
  return (
    <Provider store={store}>
      <App configureWebGL={configureWebGL} />
    </Provider>
  )
}
