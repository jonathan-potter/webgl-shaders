import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'components'

import configureStore from 'utility/configureStore'
import configureWebGL from 'javascript/configureWebGL'

const store = configureStore()
// configureWebGL({store})

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)
