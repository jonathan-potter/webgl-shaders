import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'components'

import configureStore from 'utility/configureStore'
import initializeWebGL from 'webgl/initializeWebGL'

const store = configureStore()

ReactDOM.render(
  <Root store={store} initializeWebGL={initializeWebGL.bind(null, { store })} />,
  document.getElementById('root')
)
