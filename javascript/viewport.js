const ZOOM_SIZE = 0.5

const VIEWPORT_PROTOTYPE = {
  update() {
    const currentConfig = this.getConfig()

    this.setBounds({
      x: {min: currentConfig.x_min, max: currentConfig.x_max},
      y: {min: currentConfig.y_min, max: currentConfig.y_max}
    })

    this.growToAspectRatio()
  },
  init({canvas, getConfig, setConfig}) {
    this.getConfig = getConfig
    this.setConfig = setConfig
    this.bindToCanvas(canvas)

    this.update()
  },
  xBounds: {min: 0, max: 0},
  yBounds: {min: 0, max: 0},
  setBounds(bounds) {
    this.xBounds = bounds.x
    this.yBounds = bounds.y
  },
  locationHash() {
    return {
      x_min: this.xBounds.min,
      x_max: this.xBounds.max,
      y_min: this.yBounds.min,
      y_max: this.yBounds.max
    }
  },
  center() {
    return {
      x: (this.xBounds.max + this.xBounds.min) / 2,
      y: (this.yBounds.max + this.yBounds.min) / 2
    }
  },
  range() {
    return {
      x: this.xBounds.max - this.xBounds.min,
      y: this.yBounds.max - this.yBounds.min
    }
  },
  delta() {
    return {
      x: this.range().x / this.width,
      y: this.range().y / this.height
    }
  },
  topLeft() {
    return {
      x: this.xBounds.min,
      y: this.yBounds.min
    }
  },
  canvasSize() {
    return {
      x: this.canvas.offsetWidth,
      y: this.canvas.offsetHeight
    }
  },
  canvasClickLocation(event) {
    const currentCanvasSize = this.canvasSize()

    return {
      x: event.offsetX / currentCanvasSize.x * this.width,
      y: event.offsetY / currentCanvasSize.y * this.height
    }
  },
  cartesianClickLocation(canvasClickLocation) {
    const range = this.range()
    const topLeft = this.topLeft()

    return {
      x: topLeft.x + range.x * canvasClickLocation.x / this.width,
      y: topLeft.y + range.y * canvasClickLocation.y / this.height
    }
  },
  zoomToLocation(location) {
    const range = this.range()

    this.setBounds({
      x: {
        min: location.x - (range.x * ZOOM_SIZE * 0.5),
        max: location.x + (range.x * ZOOM_SIZE * 0.5)
      },
      y: {
        min: location.y - (range.y * ZOOM_SIZE * 0.5),
        max: location.y + (range.y * ZOOM_SIZE * 0.5)
      }
    })

    this.setConfig(this.locationHash())
  },
  zoomOut(location) {
    const center = this.center()
    const range = this.range()

    this.setBounds({
      x: {
        min: center.x - (range.x / ZOOM_SIZE * 0.5),
        max: center.x + (range.x / ZOOM_SIZE * 0.5)
      },
      y: {
        min: center.y - (range.y / ZOOM_SIZE * 0.5),
        max: center.y + (range.y / ZOOM_SIZE * 0.5)
      }
    })

    this.setConfig(this.locationHash())
  },
  bindToCanvas(canvas) {
    this.canvas = canvas
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.width = this.canvas.width
    this.height = this.canvas.height

    this.canvas.addEventListener('click', event => {
      const canvasClickLocation    = this.canvasClickLocation(event)
      const cartesianClickLocation = this.cartesianClickLocation(canvasClickLocation)

      this.zoomToLocation(cartesianClickLocation)
    })
  },
  growToAspectRatio() {
    const canvasAspectRatio = this.canvas.width / this.canvas.height

    const range = this.range()
    const center = this.center()
    const currentAspectRatio = range.x / range.y

    let newDistanceFromCenter
    let xBounds = this.xBounds
    let yBounds = this.yBounds
    if (currentAspectRatio > canvasAspectRatio) {
      /* height needs expansion */
      const verticalEdgeToCenterDistance = yBounds.min - center.y

      newDistanceFromCenter = verticalEdgeToCenterDistance * (currentAspectRatio / canvasAspectRatio)
      yBounds = {
        min: center.y + newDistanceFromCenter,
        max: center.y - newDistanceFromCenter
      }
    } else {
      /* width needs expansion */
      const horizontalEdgeToCenterDistance = xBounds.min - center.x

      newDistanceFromCenter = horizontalEdgeToCenterDistance * (canvasAspectRatio / currentAspectRatio)
      xBounds = {
        min: center.x + newDistanceFromCenter,
        max: center.x - newDistanceFromCenter
      }
    }

    this.setBounds({
      x: xBounds,
      y: yBounds
    })
  }
}

export default {
  create({canvas, getConfig, setConfig}) {
    const viewport = Object.create(VIEWPORT_PROTOTYPE)

    viewport.init({canvas, getConfig, setConfig})

    return viewport
  }
}
