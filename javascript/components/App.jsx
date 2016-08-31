import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from 'components/Header'
import Menu from 'components/Menu'
import classnames from 'classnames'

const mapStateToProps = ({ menuOpen }) => ({ menuOpen })

class App extends Component {
  componentDidMount() {
    this.props.configureWebGL()
  }

  render() {
    const { menuOpen } = this.props

    const className = classnames('content', {
      'menu-open': menuOpen
    })

    return (
      <div>
        <Menu />
        <div className={className}>
          <Header />
          <canvas id="main"></canvas>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(App)
