import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions/viewport'

class CanvasContainer extends Component {
  componentDidMount () {
    const canvas = document.getElementById('main')

    canvas.addEventListener('click', event => {
      /* React onClick's SyntheticEvent does not contain all required properties */
      this.props.zoomToLocation({
        location: {
          x: event.offsetX / canvas.width,
          y: event.offsetY / canvas.height
        }
      })
    })
  }

  render () {
    return (
      <canvas id='main' />
    )
  }
}

export default connect(
  () => ({}),
  actions
)(CanvasContainer)
