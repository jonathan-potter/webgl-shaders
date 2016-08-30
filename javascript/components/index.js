import React from 'react'
import { connect, Provider } from 'react-redux'
import Header from 'components/Header'
import Menu from 'components/Menu'
import classnames from 'classnames'

export default ({ store }) => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const mapStateToProps = ({ menuOpen }) => ({ menuOpen })

const App = connect(mapStateToProps)(({ menuOpen }) => {
  const className = classnames({
    'menu-open': menuOpen
  })

  return (
    <div>
      <Menu />
      <Header />
      <canvas id="main" className={className}></canvas>
    </div>
  )
})
