import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions'

const { hypot, PI: pi, sign } = Math

class CanvasContainer extends Component {
  componentDidMount () {
    /* React onClick's SyntheticEvent does not contain all required properties */
    const canvas = document.getElementById('main')

    canvas.addEventListener('click', this.onClick.bind(this))
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this))
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this))
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this))
    canvas.addEventListener('wheel', this.onTrackpadPinchZoom.bind(this))
  }

  onTouchMove (event) {
    event.preventDefault()

    const touches = Array.from(event.touches)

    this.props.pinchZoom({
      scale: event.scale || 1,
      rotation: (event.rotation || 0) * pi / 180,
      center: {
        x: touches.reduce((sum, touch) => (sum + touch.clientX), 0) / touches.length / window.innerWidth,
        y: touches.reduce((sum, touch) => (sum + touch.clientY), 0) / touches.length / window.innerHeight
      }
    })
  }

  onTrackpadPinchZoom (event) {
    event.preventDefault()
    const delta = hypot(event.deltaX, event.deltaY) * sign(event.deltaX + event.deltaY);
    const center = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    }

    this.props.setPinchStart({
      center
    })

    this.props.pinchZoom({
      scale: 1 - delta / 200,
      rotation: 0,
      center
    })
  }

  onTouchStart (event) {
    event.preventDefault()

    const touches = Array.from(event.touches)

    this.props.setPinchStart({
      center: {
        x: touches.reduce((sum, touch) => (sum + touch.clientX), 0) / touches.length / window.innerWidth,
        y: touches.reduce((sum, touch) => (sum + touch.clientY), 0) / touches.length / window.innerHeight
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
