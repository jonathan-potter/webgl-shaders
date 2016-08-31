import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'components'

import configureStore from 'utility/configureStore'
import configureWebGL from 'javascript/configureWebGL'

const store = configureStore()

ReactDOM.render(
  <Root store={store} configureWebGL={configureWebGL.bind(null, {store})} />,
  document.getElementById('root')
)
