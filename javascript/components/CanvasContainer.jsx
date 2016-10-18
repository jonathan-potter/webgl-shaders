import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'

class CanvasContainer extends Component {
  componentDidMount () {
    /* React onClick's SyntheticEvent does not contain all required properties */
    const canvas = document.getElementById('main')

    canvas.addEventListener('click', this.onClick.bind(this))
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this))
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this))
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this))
  }

  onTouchMove (event) {
    event.preventDefault()

    const touches = Array.from(event.touches)

    this.props.pinchZoom({
      scale: event.scale || 1,
      rotation: event.rotation || 0,
      center: {
        x: touches.reduce((sum, touch) => (sum + touch.clientX), 0) / touches.length,
        y: touches.reduce((sum, touch) => (sum + touch.clientY), 0) / touches.length
      }
    })
  }

  onTouchStart (event) {
    event.preventDefault()

    const touches = Array.from(event.touches)
    const { width, height } = document.getElementById('main')

    this.props.setPinchStart({
      center: {
        x: touches.reduce((sum, touch) => (sum + touch.clientX), 0) / touches.length,
        y: touches.reduce((sum, touch) => (sum + touch.clientY), 0) / touches.length
      },
      canvas: {
        width,
        height
      }
    })
  }

  onTouchEnd (event) {
    event.preventDefault()

    this.props.resetPinchStart()
  }

  onClick (event) {
    const canvas = document.getElementById('main')

    this.props.zoomToLocation({
      location: {
        x: event.offsetX / canvas.width,
        y: event.offsetY / canvas.height
      }
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
