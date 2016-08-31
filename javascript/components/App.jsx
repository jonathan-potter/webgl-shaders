import React, { Component } from 'react'
import Header from 'components/Header'
import Menu from 'components/Menu'

import './App.css'

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