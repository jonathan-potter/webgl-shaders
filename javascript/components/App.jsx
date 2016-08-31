import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from 'components/Header'
import Menu from 'components/Menu'

export default class App extends Component {
  componentDidMount() {
    this.props.configureWebGL()
  }

  render() {
    return (
      <div>
        <Menu />
        <div className="content">
          <Header />
          <canvas id="main"></canvas>
        </div>
      </div>
    )
  }
}
